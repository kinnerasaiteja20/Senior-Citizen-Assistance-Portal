import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/categories
router.get('/', async (_req, res: Response) => {
  try {
    const categories = await db.categories.find();
    return res.json(categories);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// POST /api/categories (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, iconName, badgeColor, estimatedDuration } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = await db.categories.create({
      name,
      slug,
      description,
      iconName: iconName || 'HeartHandshake',
      badgeColor: badgeColor || 'blue',
      isActive: true,
      estimatedDuration: estimatedDuration || '1-2 hours',
      order: 99,
    });
    return res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, iconName, badgeColor, isActive, estimatedDuration } = req.body;
    const updated = await db.categories.update(id, {
      ...(name && { name }),
      ...(description && { description }),
      ...(iconName && { iconName }),
      ...(badgeColor && { badgeColor }),
      ...(isActive !== undefined && { isActive }),
      ...(estimatedDuration && { estimatedDuration }),
    });
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ message: 'Category updated successfully', category: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.categories.delete(id);
    return res.json({ message: 'Category removed successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
