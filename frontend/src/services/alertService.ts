import api from './api';

export interface Alert {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  target: string;
  isActive: boolean;
  isPublished: boolean;
  scheduledFor?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export const alertService = {
  getPublicAlerts: async (): Promise<Alert[]> => {
    const response = await api.get('/alerts/public');
    return response.data;
  },

  getAlerts: async (): Promise<Alert[]> => {
    const response = await api.get('/alerts');
    return response.data;
  },

  getAlert: async (id: string): Promise<Alert> => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  createAlert: async (data: Partial<Alert>): Promise<Alert> => {
    const response = await api.post('/alerts', data);
    return response.data;
  },

  updateAlert: async (id: string, data: Partial<Alert>): Promise<Alert> => {
    const response = await api.patch(`/alerts/${id}`, data);
    return response.data;
  },

  publishAlert: async (id: string): Promise<Alert> => {
    const response = await api.post(`/alerts/${id}/publish`);
    return response.data;
  },

  acknowledgeAlert: async (id: string, status: string): Promise<void> => {
    await api.post(`/alerts/${id}/acknowledge`, null, {
      params: { status },
    });
  },

  deleteAlert: async (id: string): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },
};

