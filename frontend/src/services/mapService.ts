import api from './api';

export interface MapFeature {
  id: string;
  name: string;
  type: string;
  visibility: string;
  geometry: {
    type: 'LineString' | 'Polygon' | 'Point';
    coordinates: number[][];
  };
  description?: string;
  incidentId?: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export const mapService = {
  getPublicFeatures: async (): Promise<MapFeature[]> => {
    const response = await api.get('/maps/public');
    return response.data;
  },

  getFeatures: async (): Promise<MapFeature[]> => {
    const response = await api.get('/maps');
    return response.data;
  },

  getFeature: async (id: string): Promise<MapFeature> => {
    const response = await api.get(`/maps/${id}`);
    return response.data;
  },

  createFeature: async (data: Partial<MapFeature>): Promise<MapFeature> => {
    const response = await api.post('/maps', data);
    return response.data;
  },

  updateFeature: async (id: string, data: Partial<MapFeature>): Promise<MapFeature> => {
    const response = await api.patch(`/maps/${id}`, data);
    return response.data;
  },

  deleteFeature: async (id: string): Promise<void> => {
    await api.delete(`/maps/${id}`);
  },
};

