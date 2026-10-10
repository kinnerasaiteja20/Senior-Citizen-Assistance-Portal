import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'senior' | 'volunteer' | 'admin';

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['senior', 'volunteer', 'admin'], default: 'senior' },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, default: 'Metro City' },
    status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
