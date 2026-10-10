import mongoose, { Schema, Document } from 'mongoose';

export type RequestStatus =
  | 'Requested'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Emergency';

export interface IStatusHistoryItem {
  status: RequestStatus;
  changedBy: string;
  timestamp: Date;
  comment?: string;
}

export interface IAssistanceRequest extends Document {
  _id: any;
  requestId: string;
  seniorId: string;
  seniorName: string;
  seniorPhone: string;
  seniorAddress: string;
  category: string;
  categoryId: string;
  title: string;
  description: string;
  specialInstructions?: string;
  urgency: UrgencyLevel;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedVolunteerPhone?: string;
  status: RequestStatus;
  statusHistory: IStatusHistoryItem[];
  volunteerNotes?: string;
  hasFeedback?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AssistanceRequestSchema: Schema = new Schema(
  {
    requestId: { type: String, required: true, unique: true },
    seniorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seniorName: { type: String, required: true },
    seniorPhone: { type: String, required: true },
    seniorAddress: { type: String, required: true },
    category: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'HelpCategory' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    specialInstructions: { type: String, default: '' },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Emergency'],
      default: 'Normal',
    },
    scheduledDate: { type: String, required: true },
    scheduledTime: { type: String, required: true },
    location: { type: String, required: true },
    assignedVolunteerId: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedVolunteerName: { type: String, default: '' },
    assignedVolunteerPhone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Requested',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedBy: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
    volunteerNotes: { type: String, default: '' },
    hasFeedback: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AssistanceRequestModel =
  mongoose.models.AssistanceRequest ||
  mongoose.model<IAssistanceRequest>('AssistanceRequest', AssistanceRequestSchema);
