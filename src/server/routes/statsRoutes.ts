import { Router, Response } from 'express';
import { db, isDbUsingMongoDB } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/stats
router.get('/', async (_req, res: Response) => {
  try {
    const allUsers = await db.users.find();
    const allRequests = await db.requests.find();
    const allFeedbacks = await db.feedbacks.find();
    const allCategories = await db.categories.find();

    const seniors = allUsers.filter((u) => u.role === 'senior');
    const volunteers = allUsers.filter((u) => u.role === 'volunteer');

    const pendingRequests = allRequests.filter((r) => r.status === 'Requested');
    const acceptedRequests = allRequests.filter((r) => r.status === 'Accepted');
    const inProgressRequests = allRequests.filter((r) => r.status === 'In Progress');
    const completedRequests = allRequests.filter((r) => r.status === 'Completed');
    const cancelledRequests = allRequests.filter((r) => r.status === 'Cancelled');
    const rejectedRequests = allRequests.filter((r) => r.status === 'Rejected');

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    for (const req of allRequests) {
      categoryCounts[req.category] = (categoryCounts[req.category] || 0) + 1;
    }

    const avgRating =
      allFeedbacks.length > 0
        ? Number(
            (
              allFeedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) /
              allFeedbacks.length
            ).toFixed(1)
          )
        : 5.0;

    return res.json({
      totals: {
        seniorCitizens: seniors.length,
        volunteers: volunteers.length,
        totalRequests: allRequests.length,
        pendingRequests: pendingRequests.length,
        acceptedRequests: acceptedRequests.length,
        inProgressRequests: inProgressRequests.length,
        completedRequests: completedRequests.length,
        cancelledRequests: cancelledRequests.length,
        rejectedRequests: rejectedRequests.length,
        totalFeedbacks: allFeedbacks.length,
        averageSatisfactionRating: avgRating,
        activeCategories: allCategories.length,
      },
      categoryDistribution: Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
      })),
      databaseStatus: {
        usingMongoDB: isDbUsingMongoDB(),
        engine: isDbUsingMongoDB() ? 'MongoDB Atlas / Local mongod' : 'High-Performance Persistent In-Memory Engine (Demo Ready)',
      },
      recentRequests: allRequests.slice(0, 5),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to compute portal statistics' });
  }
});

// POST /api/seed/reset
router.post('/reset-seed', authenticateToken, requireRole(['admin']), async (_req: AuthRequest, res: Response) => {
  try {
    await db.resetSeed();
    return res.json({ message: 'Demo data reset successfully to initial state!' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reset demo data' });
  }
});

export default router;
