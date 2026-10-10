import mongoose from 'mongoose';
import { getSeedData } from './seedData.ts';
import { UserModel, IUser } from './models/User.ts';
import { SeniorProfileModel, ISeniorProfile } from './models/SeniorProfile.ts';
import { VolunteerProfileModel, IVolunteerProfile } from './models/VolunteerProfile.ts';
import { HelpCategoryModel, IHelpCategory } from './models/HelpCategory.ts';
import { AssistanceRequestModel, IAssistanceRequest } from './models/AssistanceRequest.ts';
import { FeedbackModel, IFeedback } from './models/Feedback.ts';

let isMongooseConnected = false;

// In-memory / fallback store
interface DataStore {
  users: any[];
  seniorProfiles: any[];
  volunteerProfiles: any[];
  categories: any[];
  requests: any[];
  feedbacks: any[];
}

const store: DataStore = {
  users: [],
  seniorProfiles: [],
  volunteerProfiles: [],
  categories: [],
  requests: [],
  feedbacks: [],
};

export async function initDatabase() {
  const seed = await getSeedData();
  store.users = [...seed.users];
  store.seniorProfiles = [...seed.seniorProfiles];
  store.volunteerProfiles = [...seed.volunteerProfiles];
  store.categories = [...seed.categories];
  store.requests = [...seed.requests];
  store.feedbacks = [...seed.feedbacks];

  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log(`[DB] Attempting MongoDB connection to: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
      // Fast timeout to not block app startup if mongod is not locally running
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      isMongooseConnected = true;
      console.log('[DB] Connected successfully to MongoDB!');

      // Populate MongoDB collections if empty
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        console.log('[DB] Seeding MongoDB with initial data...');
        for (const cat of seed.categories) {
          await HelpCategoryModel.updateOne({ _id: cat._id }, { $set: cat }, { upsert: true });
        }
        for (const u of seed.users) {
          await UserModel.updateOne({ _id: u._id }, { $set: u }, { upsert: true });
        }
        for (const sp of seed.seniorProfiles) {
          await SeniorProfileModel.updateOne({ userId: sp.userId }, { $set: sp }, { upsert: true });
        }
        for (const vp of seed.volunteerProfiles) {
          await VolunteerProfileModel.updateOne({ userId: vp.userId }, { $set: vp }, { upsert: true });
        }
        for (const req of seed.requests) {
          await AssistanceRequestModel.updateOne({ _id: req._id }, { $set: req }, { upsert: true });
        }
        for (const fb of seed.feedbacks) {
          await FeedbackModel.updateOne({ _id: fb._id }, { $set: fb }, { upsert: true });
        }
        console.log('[DB] MongoDB initial seed complete.');
      }
    } catch (err: any) {
      console.warn('[DB] MongoDB connection unavailable or offline. Operating in High-Speed In-Memory/Fallback Database Mode:', err.message);
      isMongooseConnected = false;
    }
  } else {
    console.log('[DB] No MONGODB_URI provided. Running in Standalone In-Memory Database Mode for instant demonstration.');
  }
}

export function isDbUsingMongoDB() {
  return isMongooseConnected;
}

// Unified Data Access Layer
export const db = {
  async resetSeed() {
    const seed = await getSeedData();
    store.users = [...seed.users];
    store.seniorProfiles = [...seed.seniorProfiles];
    store.volunteerProfiles = [...seed.volunteerProfiles];
    store.categories = [...seed.categories];
    store.requests = [...seed.requests];
    store.feedbacks = [...seed.feedbacks];

    if (isMongooseConnected) {
      try {
        await Promise.all([
          UserModel.deleteMany({}),
          SeniorProfileModel.deleteMany({}),
          VolunteerProfileModel.deleteMany({}),
          HelpCategoryModel.deleteMany({}),
          AssistanceRequestModel.deleteMany({}),
          FeedbackModel.deleteMany({}),
        ]);
        await Promise.all([
          UserModel.insertMany(seed.users),
          SeniorProfileModel.insertMany(seed.seniorProfiles),
          VolunteerProfileModel.insertMany(seed.volunteerProfiles),
          HelpCategoryModel.insertMany(seed.categories),
          AssistanceRequestModel.insertMany(seed.requests),
          FeedbackModel.insertMany(seed.feedbacks),
        ]);
      } catch (e) {
        console.error('Error reseeding MongoDB:', e);
      }
    }
  },

  // USERS
  users: {
    async find() {
      if (isMongooseConnected) {
        try {
          return await UserModel.find().sort({ createdAt: -1 }).lean();
        } catch {
          return store.users;
        }
      }
      return [...store.users];
    },
    async findById(id: string) {
      if (isMongooseConnected) {
        try {
          const doc = await UserModel.findById(id).lean();
          if (doc) return doc;
        } catch {}
      }
      return store.users.find((u) => u._id.toString() === id.toString()) || null;
    },
    async findByEmail(email: string) {
      if (isMongooseConnected) {
        try {
          const doc = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
          if (doc) return doc;
        } catch {}
      }
      return (
        store.users.find(
          (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
        ) || null
      );
    },
    async create(userData: any) {
      const id = userData._id || `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const doc = {
        _id: id,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.unshift(doc);

      if (isMongooseConnected) {
        try {
          await UserModel.create(doc);
        } catch (e) {
          console.error('MongoDB UserModel.create error:', e);
        }
      }
      return doc;
    },
    async update(id: string, updateData: any) {
      const idx = store.users.findIndex((u) => u._id.toString() === id.toString());
      if (idx !== -1) {
        store.users[idx] = {
          ...store.users[idx],
          ...updateData,
          updatedAt: new Date(),
        };
      }
      if (isMongooseConnected) {
        try {
          await UserModel.findByIdAndUpdate(id, { $set: updateData });
        } catch {}
      }
      return idx !== -1 ? store.users[idx] : null;
    },
    async delete(id: string) {
      store.users = store.users.filter((u) => u._id.toString() !== id.toString());
      if (isMongooseConnected) {
        try {
          await UserModel.findByIdAndDelete(id);
        } catch {}
      }
      return true;
    },
  },

  // SENIOR PROFILES
  seniorProfiles: {
    async findByUserId(userId: string) {
      if (isMongooseConnected) {
        try {
          const doc = await SeniorProfileModel.findOne({ userId }).lean();
          if (doc) return doc;
        } catch {}
      }
      return store.seniorProfiles.find((sp) => sp.userId === userId) || null;
    },
    async upsert(userId: string, data: any) {
      const idx = store.seniorProfiles.findIndex((sp) => sp.userId === userId);
      let updated;
      if (idx !== -1) {
        store.seniorProfiles[idx] = { ...store.seniorProfiles[idx], ...data, updatedAt: new Date() };
        updated = store.seniorProfiles[idx];
      } else {
        updated = { _id: `sp_${Date.now()}`, userId, ...data, createdAt: new Date(), updatedAt: new Date() };
        store.seniorProfiles.push(updated);
      }
      if (isMongooseConnected) {
        try {
          await SeniorProfileModel.findOneAndUpdate({ userId }, { $set: data }, { upsert: true });
        } catch {}
      }
      return updated;
    },
    async find() {
      return [...store.seniorProfiles];
    },
  },

  // VOLUNTEER PROFILES
  volunteerProfiles: {
    async findByUserId(userId: string) {
      if (isMongooseConnected) {
        try {
          const doc = await VolunteerProfileModel.findOne({ userId }).lean();
          if (doc) return doc;
        } catch {}
      }
      return store.volunteerProfiles.find((vp) => vp.userId === userId) || null;
    },
    async upsert(userId: string, data: any) {
      const idx = store.volunteerProfiles.findIndex((vp) => vp.userId === userId);
      let updated;
      if (idx !== -1) {
        store.volunteerProfiles[idx] = { ...store.volunteerProfiles[idx], ...data, updatedAt: new Date() };
        updated = store.volunteerProfiles[idx];
      } else {
        updated = { _id: `vp_${Date.now()}`, userId, ...data, createdAt: new Date(), updatedAt: new Date() };
        store.volunteerProfiles.push(updated);
      }
      if (isMongooseConnected) {
        try {
          await VolunteerProfileModel.findOneAndUpdate({ userId }, { $set: data }, { upsert: true });
        } catch {}
      }
      return updated;
    },
    async find() {
      return [...store.volunteerProfiles];
    },
  },

  // CATEGORIES
  categories: {
    async find() {
      if (isMongooseConnected) {
        try {
          return await HelpCategoryModel.find().sort({ order: 1 }).lean();
        } catch {}
      }
      return [...store.categories].sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    async findById(id: string) {
      return store.categories.find((c) => c._id.toString() === id.toString()) || null;
    },
    async create(data: any) {
      const id = data._id || `cat_${Date.now()}`;
      const doc = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() };
      store.categories.push(doc);
      if (isMongooseConnected) {
        try {
          await HelpCategoryModel.create(doc);
        } catch {}
      }
      return doc;
    },
    async update(id: string, data: any) {
      const idx = store.categories.findIndex((c) => c._id.toString() === id.toString());
      if (idx !== -1) {
        store.categories[idx] = { ...store.categories[idx], ...data, updatedAt: new Date() };
      }
      if (isMongooseConnected) {
        try {
          await HelpCategoryModel.findByIdAndUpdate(id, { $set: data });
        } catch {}
      }
      return idx !== -1 ? store.categories[idx] : null;
    },
    async delete(id: string) {
      store.categories = store.categories.filter((c) => c._id.toString() !== id.toString());
      if (isMongooseConnected) {
        try {
          await HelpCategoryModel.findByIdAndDelete(id);
        } catch {}
      }
      return true;
    },
  },

  // REQUESTS
  requests: {
    async find(filter: any = {}) {
      let results = [...store.requests];
      if (filter.seniorId) {
        results = results.filter((r) => r.seniorId === filter.seniorId);
      }
      if (filter.assignedVolunteerId) {
        results = results.filter((r) => r.assignedVolunteerId === filter.assignedVolunteerId);
      }
      if (filter.status) {
        if (Array.isArray(filter.status)) {
          results = results.filter((r) => filter.status.includes(r.status));
        } else {
          results = results.filter((r) => r.status === filter.status);
        }
      }
      if (filter.category) {
        results = results.filter((r) => r.category === filter.category);
      }
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async findById(id: string) {
      if (isMongooseConnected) {
        try {
          const doc = await AssistanceRequestModel.findById(id).lean();
          if (doc) return doc;
        } catch {}
      }
      return store.requests.find((r) => r._id.toString() === id.toString() || r.requestId === id) || null;
    },
    async create(data: any) {
      const id = data._id || `req_${Date.now()}`;
      const count = store.requests.length + 1;
      const formattedRequestId = `REQ-2026-${String(count).padStart(3, '0')}`;
      const doc = {
        _id: id,
        requestId: formattedRequestId,
        ...data,
        statusHistory: [
          {
            status: data.status || 'Requested',
            changedBy: data.seniorName || 'Senior Citizen',
            timestamp: new Date(),
            comment: 'Assistance request created',
          },
        ],
        hasFeedback: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.requests.unshift(doc);
      if (isMongooseConnected) {
        try {
          await AssistanceRequestModel.create(doc);
        } catch {}
      }
      return doc;
    },
    async update(id: string, updateData: any) {
      const idx = store.requests.findIndex(
        (r) => r._id.toString() === id.toString() || r.requestId === id
      );
      if (idx !== -1) {
        const existing = store.requests[idx];
        const newStatus = updateData.status;
        let newHistory = [...(existing.statusHistory || [])];
        if (newStatus && newStatus !== existing.status) {
          newHistory.push({
            status: newStatus,
            changedBy: updateData.changedBy || 'User',
            timestamp: new Date(),
            comment: updateData.statusComment || `Status updated to ${newStatus}`,
          });
        }
        store.requests[idx] = {
          ...existing,
          ...updateData,
          statusHistory: newHistory,
          updatedAt: new Date(),
        };
        if (isMongooseConnected) {
          try {
            await AssistanceRequestModel.findByIdAndUpdate(existing._id, {
              $set: { ...updateData, statusHistory: newHistory },
            });
          } catch {}
        }
        return store.requests[idx];
      }
      return null;
    },
    async delete(id: string) {
      store.requests = store.requests.filter(
        (r) => r._id.toString() !== id.toString() && r.requestId !== id
      );
      if (isMongooseConnected) {
        try {
          await AssistanceRequestModel.findByIdAndDelete(id);
        } catch {}
      }
      return true;
    },
  },

  // FEEDBACKS
  feedbacks: {
    async find(filter: any = {}) {
      let results = [...store.feedbacks];
      if (filter.volunteerId) {
        results = results.filter((f) => f.volunteerId === filter.volunteerId);
      }
      if (filter.seniorId) {
        results = results.filter((f) => f.seniorId === filter.seniorId);
      }
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async create(data: any) {
      const id = data._id || `fb_${Date.now()}`;
      const doc = {
        _id: id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.feedbacks.unshift(doc);

      // mark request as having feedback
      if (data.requestId) {
        const reqIdx = store.requests.findIndex((r) => r._id === data.requestId);
        if (reqIdx !== -1) {
          store.requests[reqIdx].hasFeedback = true;
        }
      }

      // recalculate volunteer average rating
      if (data.volunteerId) {
        const volReviews = store.feedbacks.filter((f) => f.volunteerId === data.volunteerId);
        const avg =
          volReviews.reduce((sum, item) => sum + item.rating, 0) / (volReviews.length || 1);
        const vProf = store.volunteerProfiles.find((v) => v.userId === data.volunteerId);
        if (vProf) {
          vProf.averageRating = Number(avg.toFixed(1));
          vProf.tasksCompleted = (vProf.tasksCompleted || 0) + 1;
        }
      }

      if (isMongooseConnected) {
        try {
          await FeedbackModel.create(doc);
        } catch {}
      }
      return doc;
    },
  },
};
