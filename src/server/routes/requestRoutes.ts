import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/requests
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    const { status, category, urgency, search, view } = req.query;

    let allRequests = await db.requests.find();

    // Role-based filtering
    if (role === 'senior') {
      allRequests = allRequests.filter((r) => r.seniorId === id);
    } else if (role === 'volunteer') {
      if (view === 'assigned') {
        // Only tasks assigned to this volunteer
        allRequests = allRequests.filter((r) => r.assignedVolunteerId === id);
      } else if (view === 'available') {
        // Open tasks waiting for volunteer
        allRequests = allRequests.filter((r) => r.status === 'Requested' && !r.assignedVolunteerId);
      } else {
        // Both assigned to volunteer and available
        allRequests = allRequests.filter(
          (r) => r.assignedVolunteerId === id || (r.status === 'Requested' && !r.assignedVolunteerId)
        );
      }
    }
    // Admin gets all by default

    // Filters
    if (status && status !== 'all') {
      allRequests = allRequests.filter((r) => r.status === status);
    }
    if (category && category !== 'all') {
      allRequests = allRequests.filter((r) => r.category === category);
    }
    if (urgency && urgency !== 'all') {
      allRequests = allRequests.filter((r) => r.urgency === urgency);
    }
    if (search) {
      const q = String(search).toLowerCase();
      allRequests = allRequests.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q) ||
          r.seniorName.toLowerCase().includes(q) ||
          (r.assignedVolunteerName && r.assignedVolunteerName.toLowerCase().includes(q))
      );
    }

    return res.json(allRequests);
  } catch (err: any) {
    console.error('Error fetching requests:', err);
    return res.status(500).json({ error: 'Failed to retrieve assistance requests' });
  }
});

// GET /api/requests/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const request = await db.requests.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Assistance request not found' });
    }
    return res.json(request);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch assistance request details' });
  }
});

// POST /api/requests
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, categoryId, specialInstructions, urgency, scheduledDate, scheduledTime, location } = req.body;

    if (!title || !description || !category || !scheduledDate || !scheduledTime || !location) {
      return res.status(400).json({ error: 'Please provide all required request details.' });
    }

    const seniorUser = await db.users.findById(req.user!.id);
    if (!seniorUser) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    const newRequest = await db.requests.create({
      seniorId: seniorUser._id.toString(),
      seniorName: seniorUser.name,
      seniorPhone: seniorUser.phone,
      seniorAddress: seniorUser.address,
      category,
      categoryId: categoryId || '',
      title,
      description,
      specialInstructions: specialInstructions || '',
      urgency: urgency || 'Normal',
      scheduledDate,
      scheduledTime,
      location,
      status: 'Requested',
      assignedVolunteerId: undefined,
      assignedVolunteerName: '',
      assignedVolunteerPhone: '',
    });

    return res.status(201).json({
      message: 'Assistance request submitted successfully!',
      request: newRequest,
    });
  } catch (err: any) {
    console.error('Error creating request:', err);
    return res.status(500).json({ error: 'Failed to create assistance request' });
  }
});

// PUT /api/requests/:id/accept (Volunteer accepts open request)
router.put('/:id/accept', authenticateToken, requireRole(['volunteer']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await db.requests.findById(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    if (request.status !== 'Requested') {
      return res.status(400).json({ error: `Request cannot be accepted because it is already '${request.status}'.` });
    }

    const volunteer = await db.users.findById(req.user!.id);
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer user not found.' });
    }

    const updated = await db.requests.update(id, {
      status: 'Accepted',
      assignedVolunteerId: volunteer._id.toString(),
      assignedVolunteerName: volunteer.name,
      assignedVolunteerPhone: volunteer.phone,
      changedBy: volunteer.name,
      statusComment: `Volunteer ${volunteer.name} accepted this request.`,
    });

    return res.json({
      message: 'Request accepted successfully! You are now assigned to assist.',
      request: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to accept request' });
  }
});

// PUT /api/requests/:id/assign (Admin assigns volunteer)
router.put('/:id/assign', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({ error: 'Volunteer ID is required for assignment.' });
    }

    const volunteer = await db.users.findById(volunteerId);
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ error: 'Specified volunteer not found or invalid.' });
    }

    const updated = await db.requests.update(id, {
      status: 'Accepted',
      assignedVolunteerId: volunteer._id.toString(),
      assignedVolunteerName: volunteer.name,
      assignedVolunteerPhone: volunteer.phone,
      changedBy: `Admin (${req.user!.name})`,
      statusComment: `Assigned volunteer ${volunteer.name} by administrator.`,
    });

    return res.json({
      message: `Assigned ${volunteer.name} to request successfully.`,
      request: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to assign volunteer.' });
  }
});

// PUT /api/requests/:id/status (Volunteer or Admin updates progress)
router.put('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, volunteerNotes, comment } = req.body;

    const validStatuses = ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status transition.' });
    }

    const request = await db.requests.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    // Role verification
    if (req.user!.role === 'senior' && request.seniorId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only cancel your own requests.' });
    }
    if (req.user!.role === 'senior' && status !== 'Cancelled') {
      return res.status(403).json({ error: 'Seniors can only cancel requests.' });
    }

    const updatePayload: any = {
      status,
      changedBy: req.user!.name,
      statusComment: comment || `Status updated to ${status}`,
    };
    if (volunteerNotes !== undefined) {
      updatePayload.volunteerNotes = volunteerNotes;
    }

    const updated = await db.requests.update(id, updatePayload);
    return res.json({
      message: `Request status updated to ${status}.`,
      request: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update request status.' });
  }
});

// DELETE /api/requests/:id
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await db.requests.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    if (req.user!.role !== 'admin' && request.seniorId !== req.user!.id) {
      return res.status(403).json({ error: 'Permission denied to delete request.' });
    }
    await db.requests.delete(id);
    return res.json({ message: 'Request removed successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete request.' });
  }
});

export default router;
