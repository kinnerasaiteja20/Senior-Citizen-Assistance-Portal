import axios from 'axios';
import { User, AssistanceRequest, HelpCategory, Feedback, PortalStats } from './types.ts';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle unauthenticated 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Token expired or invalid
      console.warn('Unauthorized session. Token may be expired.');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<{ message: string; token: string; user: User }>('/auth/login', credentials);
    return res.data;
  },
  register: async (payload: any) => {
    const res = await api.post<{ message: string; token: string; user: User }>('/auth/register', payload);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ user: User; profile: any }>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.put<{ message: string; user: User; profile: any }>('/auth/profile', data);
    return res.data;
  },
};

export const categoriesApi = {
  getAll: async () => {
    const res = await api.get<HelpCategory[]>('/categories');
    return res.data;
  },
  create: async (data: Partial<HelpCategory>) => {
    const res = await api.post<{ message: string; category: HelpCategory }>('/categories', data);
    return res.data;
  },
  update: async (id: string, data: Partial<HelpCategory>) => {
    const res = await api.put<{ message: string; category: HelpCategory }>(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/categories/${id}`);
    return res.data;
  },
};

export const requestsApi = {
  getAll: async (params?: { status?: string; category?: string; urgency?: string; search?: string; view?: string }) => {
    const res = await api.get<AssistanceRequest[]>('/requests', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<AssistanceRequest>(`/requests/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post<{ message: string; request: AssistanceRequest }>('/requests', data);
    return res.data;
  },
  accept: async (id: string) => {
    const res = await api.put<{ message: string; request: AssistanceRequest }>(`/requests/${id}/accept`);
    return res.data;
  },
  assignVolunteer: async (requestId: string, volunteerId: string) => {
    const res = await api.put<{ message: string; request: AssistanceRequest }>(`/requests/${requestId}/assign`, {
      volunteerId,
    });
    return res.data;
  },
  updateStatus: async (id: string, status: string, volunteerNotes?: string, comment?: string) => {
    const res = await api.put<{ message: string; request: AssistanceRequest }>(`/requests/${id}/status`, {
      status,
      volunteerNotes,
      comment,
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/requests/${id}`);
    return res.data;
  },
};

export const volunteersApi = {
  getAll: async () => {
    const res = await api.get<(User & { profile: any })[]>('/volunteers');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<User & { profile: any; feedbacks: Feedback[] }>(`/volunteers/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, data: { status?: string; isVerified?: boolean }) => {
    const res = await api.put<{ message: string }>(`/volunteers/${id}/status`, data);
    return res.data;
  },
};

export const seniorsApi = {
  getAll: async () => {
    const res = await api.get<(User & { profile: any })[]>('/seniors');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<User & { profile: any; requestCount: number }>(`/seniors/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await api.put<{ message: string }>(`/seniors/${id}/status`, { status });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/seniors/${id}`);
    return res.data;
  },
};

export const feedbackApi = {
  getAll: async (params?: { volunteerId?: string; seniorId?: string }) => {
    const res = await api.get<Feedback[]>('/feedback', { params });
    return res.data;
  },
  create: async (data: { requestId: string; rating: number; punctualityRating?: number; kindnessRating?: number; comments: string }) => {
    const res = await api.post<{ message: string; feedback: Feedback }>('/feedback', data);
    return res.data;
  },
};

export const statsApi = {
  getOverview: async () => {
    const res = await api.get<PortalStats>('/stats');
    return res.data;
  },
  resetSeed: async () => {
    const res = await api.post<{ message: string }>('/stats/reset-seed');
    return res.data;
  },
};

export default api;
