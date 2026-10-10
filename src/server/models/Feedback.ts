import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  _id: any;
  requestId: string;
  seniorId: string;
  seniorName: string;
  volunteerId: string;
  volunteerName: string;
  rating: number; // 1 to 5
  punctualityRating: number;
  kindnessRating: number;
  comments: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export const FeedbackSchema: Schema = new Schema(
  {
    requestId: { type: Schema.Types.ObjectId, ref: 'AssistanceRequest', required: true },
    seniorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seniorName: { type: String, required: true },
    volunteerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    volunteerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    punctualityRating: { type: Number, default: 5, min: 1, max: 5 },
    kindnessRating: { type: Number, default: 5, min: 1, max: 5 },
    comments: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const FeedbackModel =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
