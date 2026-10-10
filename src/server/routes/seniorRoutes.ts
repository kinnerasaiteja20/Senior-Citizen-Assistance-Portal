import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/seniors
router.get('/', authenticateToken, requireRole(['admin']), async (_req: AuthRequest, res: Response) => {
  try {
    const allUsers = await db.users.find();
    const seniorUsers = allUsers.filter((u) => u.role === 'senior');

    const seniorsWithProfiles = await Promise.all(
      seniorUsers.map(async (u) => {
        const profile = await db.seniorProfiles.findByUserId(u._id.toString());
        const { password: _, ...safeUser } = u;
        return {
          ...safeUser,
          profile: profile || {
            age: 70,
            emergencyContactName: 'Relative',
            emergencyContactPhone: u.phone,
            emergencyContactRelation: 'Family',
            medicalConditions: [],
            mobilityNeeds: 'Independent',
            preferredLanguage: 'English',
          },
        };
      })
    );

    return res.json(seniorsWithProfiles);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve senior citizens' });
  }
});

// GET /api/seniors/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user || user.role !== 'senior') {
      return res.status(404).json({ error: 'Senior citizen not found' });
    }
    const profile = await db.seniorProfiles.findByUserId(user._id.toString());
    const requests = await db.requests.find({ seniorId: user._id.toString() });
    const { password: _, ...safeUser } = user;
    return res.json({
      ...safeUser,
      profile,
      requestCount: requests.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve senior citizen' });
  }
});

// PUT /api/seniors/:id/status (Admin activates or suspends user)
router.put('/:id/status', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid user status.' });
    }
    await db.users.update(id, { status });
    return res.json({ message: `User status changed to ${status}.` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// DELETE /api/seniors/:id (Admin removes user)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.users.delete(id);
    return res.json({ message: 'User account removed.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
});

export default router;
