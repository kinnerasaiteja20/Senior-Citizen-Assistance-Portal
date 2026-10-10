import mongoose, { Schema, Document } from 'mongoose';

export interface ISeniorProfile extends Document {
  userId: string;
  age: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalConditions: string[];
  mobilityNeeds: string;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SeniorProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
    emergencyContactRelation: { type: String, default: 'Family' },
    medicalConditions: { type: [String], default: [] },
    mobilityNeeds: { type: String, default: 'Independent with cane' },
    preferredLanguage: { type: String, default: 'English' },
  },
  { timestamps: true }
);

export const SeniorProfileModel =
  mongoose.models.SeniorProfile ||
  mongoose.model<ISeniorProfile>('SeniorProfile', SeniorProfileSchema);
