import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticateToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/feedback (Public or authenticated - list reviews)
router.get('/', async (req, res: Response) => {
  try {
    const { volunteerId, seniorId } = req.query;
    const feedbacks = await db.feedbacks.find({
      ...(volunteerId && { volunteerId: String(volunteerId) }),
      ...(seniorId && { seniorId: String(seniorId) }),
    });
    return res.json(feedbacks);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve feedback reviews.' });
  }
});

// POST /api/feedback (Senior submits review for completed task)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, rating, punctualityRating, kindnessRating, comments } = req.body;

    if (!requestId || !rating || !comments) {
      return res.status(400).json({ error: 'Request ID, star rating, and comments are required.' });
    }

    const request = await db.requests.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Assistance request not found.' });
    }

    if (request.status !== 'Completed') {
      return res.status(400).json({ error: 'Feedback can only be submitted for completed assistance requests.' });
    }

    if (req.user!.role === 'senior' && request.seniorId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only review requests created by your account.' });
    }

    if (!request.assignedVolunteerId) {
      return res.status(400).json({ error: 'This request does not have an assigned volunteer.' });
    }

    const newFeedback = await db.feedbacks.create({
      requestId: request._id.toString(),
      seniorId: request.seniorId,
      seniorName: request.seniorName,
      volunteerId: request.assignedVolunteerId,
      volunteerName: request.assignedVolunteerName || 'Volunteer',
      rating: Number(rating),
      punctualityRating: Number(punctualityRating) || 5,
      kindnessRating: Number(kindnessRating) || 5,
      comments,
      category: request.category,
    });

    return res.status(201).json({
      message: 'Feedback submitted successfully! Thank you for supporting our community.',
      feedback: newFeedback,
    });
  } catch (err: any) {
    console.error('Error submitting feedback:', err);
    return res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

export default router;
