import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/volunteers (List volunteers with profile data)
router.get('/', authenticateToken, async (_req: AuthRequest, res: Response) => {
  try {
    const allUsers = await db.users.find();
    const volunteerUsers = allUsers.filter((u) => u.role === 'volunteer');

    const volunteersWithProfiles = await Promise.all(
      volunteerUsers.map(async (u) => {
        const profile = await db.volunteerProfiles.findByUserId(u._id.toString());
        const { password: _, ...safeUser } = u;
        return {
          ...safeUser,
          profile: profile || {
            skills: ['General Assistance'],
            serviceAreas: ['Metro Area'],
            availability: 'flexible',
            tasksCompleted: 0,
            averageRating: 5.0,
            isVerified: true,
            bio: 'Registered volunteer',
          },
        };
      })
    );

    return res.json(volunteersWithProfiles);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve volunteers list.' });
  }
});

// GET /api/volunteers/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user || user.role !== 'volunteer') {
      return res.status(404).json({ error: 'Volunteer not found.' });
    }
    const profile = await db.volunteerProfiles.findByUserId(user._id.toString());
    const feedbacks = await db.feedbacks.find({ volunteerId: user._id.toString() });
    const { password: _, ...safeUser } = user;
    return res.json({
      ...safeUser,
      profile,
      feedbacks,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve volunteer profile.' });
  }
});

// PUT /api/volunteers/:id/status (Admin updates status or verification)
router.put('/:id/status', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, isVerified } = req.body;

    if (status) {
      await db.users.update(id, { status });
    }
    if (isVerified !== undefined) {
      await db.volunteerProfiles.upsert(id, { isVerified });
    }

    return res.json({ message: 'Volunteer status updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update volunteer status.' });
  }
});

export default router;
