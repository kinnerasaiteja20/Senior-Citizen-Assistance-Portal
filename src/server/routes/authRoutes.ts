import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.ts';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      city,
      // Senior specific
      age,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      medicalConditions,
      mobilityNeeds,
      // Volunteer specific
      skills,
      serviceAreas,
      availability,
      bio,
    } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ error: 'Please provide all required registration fields.' });
    }

    if (!['senior', 'volunteer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.users.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'senior',
      phone,
      address,
      city: city || 'Metro City',
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0284c7`,
    });

    if (role === 'senior') {
      await db.seniorProfiles.upsert(newUser._id.toString(), {
        age: Number(age) || 68,
        emergencyContactName: emergencyContactName || 'Family Member',
        emergencyContactPhone: emergencyContactPhone || phone,
        emergencyContactRelation: emergencyContactRelation || 'Relative',
        medicalConditions: Array.isArray(medicalConditions) ? medicalConditions : (medicalConditions ? [medicalConditions] : []),
        mobilityNeeds: mobilityNeeds || 'Independent',
        preferredLanguage: 'English',
      });
    } else if (role === 'volunteer') {
      await db.volunteerProfiles.upsert(newUser._id.toString(), {
        skills: Array.isArray(skills) ? skills : (skills ? [skills] : ['Elderly Support', 'Grocery Delivery']),
        serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? [serviceAreas] : ['Central District']),
        availability: availability || 'flexible',
        bio: bio || 'Dedicated volunteer ready to assist elderly community members.',
        isVerified: true,
        tasksCompleted: 0,
        averageRating: 5.0,
      });
    }

    const token = generateToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _, ...userSafe } = user;
    return res.json({
      message: 'Login successful',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.users.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let extraProfile = null;
    if (user.role === 'senior') {
      extraProfile = await db.seniorProfiles.findByUserId(user._id.toString());
    } else if (user.role === 'volunteer') {
      extraProfile = await db.volunteerProfiles.findByUserId(user._id.toString());
    }

    const { password: _, ...userSafe } = user;
    return res.json({
      user: userSafe,
      profile: extraProfile,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error fetching profile' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address, city, avatarUrl, profileData } = req.body;
    const updatedUser = await db.users.update(req.user!.id, {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(city && { city }),
      ...(avatarUrl && { avatarUrl }),
    });

    let updatedProfile = null;
    if (req.user!.role === 'senior' && profileData) {
      updatedProfile = await db.seniorProfiles.upsert(req.user!.id, profileData);
    } else if (req.user!.role === 'volunteer' && profileData) {
      updatedProfile = await db.volunteerProfiles.upsert(req.user!.id, profileData);
    }

    const { password: _, ...userSafe } = updatedUser;
    return res.json({
      message: 'Profile updated successfully',
      user: userSafe,
      profile: updatedProfile,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error updating profile' });
  }
});

export default router;
