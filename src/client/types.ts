export type UserRole = 'senior' | 'volunteer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  createdAt: string;
}

export interface SeniorProfile {
  _id?: string;
  userId: string;
  age: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalConditions: string[];
  mobilityNeeds: string;
  preferredLanguage: string;
}

export interface VolunteerProfile {
  _id?: string;
  userId: string;
  skills: string[];
  serviceAreas: string[];
  availability: 'weekdays' | 'weekends' | 'all_days' | 'flexible';
  preferredCategories: string[];
  isVerified: boolean;
  tasksCompleted: number;
  averageRating: number;
  bio: string;
  emergencyContact?: string;
}

export interface HelpCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  badgeColor: string;
  isActive: boolean;
  estimatedDuration: string;
  order: number;
}

export type RequestStatus =
  | 'Requested'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Emergency';

export interface StatusHistoryItem {
  status: RequestStatus;
  changedBy: string;
  timestamp: string;
  comment?: string;
}

export interface AssistanceRequest {
  _id: string;
  requestId: string;
  seniorId: string;
  seniorName: string;
  seniorPhone: string;
  seniorAddress: string;
  category: string;
  categoryId?: string;
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
  statusHistory: StatusHistoryItem[];
  volunteerNotes?: string;
  hasFeedback?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  _id: string;
  requestId: string;
  seniorId: string;
  seniorName: string;
  volunteerId: string;
  volunteerName: string;
  rating: number;
  punctualityRating: number;
  kindnessRating: number;
  comments: string;
  category: string;
  createdAt: string;
}

export interface PortalStats {
  totals: {
    seniorCitizens: number;
    volunteers: number;
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    inProgressRequests: number;
    completedRequests: number;
    cancelledRequests: number;
    rejectedRequests: number;
    totalFeedbacks: number;
    averageSatisfactionRating: number;
    activeCategories: number;
  };
  categoryDistribution: { name: string; count: number }[];
  databaseStatus: {
    usingMongoDB: boolean;
    engine: string;
  };
  recentRequests: AssistanceRequest[];
}
