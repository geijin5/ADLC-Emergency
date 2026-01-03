import * as turf from '@turf/turf';
import { MapFeature } from '../services/mapService';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const snapToRoads = async (coordinates: number[][]): Promise<number[][]> => {
  // Use Mapbox Matching API to snap coordinates to roads
  const coordinateString = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const url = `https://api.mapbox.com/matching/v5/mapbox/driving/${coordinateString}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.matchings && data.matchings[0]) {
      return data.matchings[0].geometry.coordinates;
    }
    
    return coordinates;
  } catch (error) {
    console.error('Error snapping to roads:', error);
    return coordinates;
  }
};

export const getRoute = async (start: [number, number], end: [number, number]): Promise<number[][]> => {
  // Use Mapbox Directions API to get route
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates;
    }
    
    return [start, end];
  } catch (error) {
    console.error('Error getting route:', error);
    return [start, end];
  }
};

export const getFeatureColor = (type: string): string => {
  const colors: Record<string, string> = {
    road_closure: '#dc2626',
    detour: '#f59e0b',
    parade_route: '#3b82f6',
    area_closure: '#ef4444',
    sar_operational_area: '#10b981',
  };
  return colors[type] || '#6b7280';
};

export const formatFeatureForMapbox = (feature: MapFeature) => {
  return {
    id: feature.id,
    type: 'Feature' as const,
    geometry: feature.geometry,
    properties: {
      name: feature.name,
      type: feature.type,
      description: feature.description,
      isActive: feature.isActive,
    },
  };
};

