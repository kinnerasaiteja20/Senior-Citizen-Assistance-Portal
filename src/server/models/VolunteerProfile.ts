import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteerProfile extends Document {
  userId: string;
  skills: string[];
  serviceAreas: string[];
  availability: 'weekdays' | 'weekends' | 'all_days' | 'flexible';
  preferredCategories: string[];
  isVerified: boolean;
  tasksCompleted: number;
  averageRating: number;
  bio: string;
  idProofType?: string;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
}

export const VolunteerProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: { type: [String], default: ['First Aid', 'Patient Driving', 'Grocery Shopping'] },
    serviceAreas: { type: [String], default: ['Downtown', 'North Suburb', 'Westside'] },
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'all_days', 'flexible'],
      default: 'flexible',
    },
    preferredCategories: { type: [String], default: [] },
    isVerified: { type: Boolean, default: true },
    tasksCompleted: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5.0 },
    bio: { type: String, default: 'Passionate community volunteer helping senior citizens.' },
    idProofType: { type: String, default: 'Government Issued ID' },
    emergencyContact: { type: String, default: '' },
  },
  { timestamps: true }
);

export const VolunteerProfileModel =
  mongoose.models.VolunteerProfile ||
  mongoose.model<IVolunteerProfile>('VolunteerProfile', VolunteerProfileSchema);
