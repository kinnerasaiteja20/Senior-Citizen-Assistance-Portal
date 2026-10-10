import mongoose, { Schema, Document } from 'mongoose';

export interface IHelpCategory extends Document {
  _id: any;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  badgeColor: string;
  isActive: boolean;
  estimatedDuration: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const HelpCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'HeartHandshake' },
    badgeColor: { type: String, default: 'blue' },
    isActive: { type: Boolean, default: true },
    estimatedDuration: { type: String, default: '1-2 hours' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HelpCategoryModel =
  mongoose.models.HelpCategory ||
  mongoose.model<IHelpCategory>('HelpCategory', HelpCategorySchema);
