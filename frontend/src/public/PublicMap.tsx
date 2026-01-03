import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Map, { Source, Layer, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapService, MapFeature } from '../services/mapService';
import { formatFeatureForMapbox, getFeatureColor } from '../utils/mapUtils';
import './PublicMap.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PublicMap() {
  const mapRef = useRef<MapRef>(null);
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    road_closure: true,
    detour: true,
    parade_route: true,
    area_closure: true,
    sar_operational_area: true,
  });

  const { data: features } = useQuery({
    queryKey: ['publicMapFeatures'],
    queryFn: mapService.getPublicFeatures,
    refetchInterval: 30000,
  });

  const getFeaturesByType = (type: string) => {
    if (!features) return [];
    return features
      .filter((f) => f.type === type && f.isActive)
      .map(formatFeatureForMapbox);
  };

  const toggleLayer = (type: string) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="public-map-container">
      <div className="map-legend">
        <h3>Map Layers</h3>
        {Object.entries(layerVisibility).map(([type, visible]) => (
          <label key={type} className="legend-item">
            <input
              type="checkbox"
              checked={visible}
              onChange={() => toggleLayer(type)}
            />
            <span
              className="legend-color"
              style={{ backgroundColor: getFeatureColor(type) }}
            />
            <span className="legend-label">{type.replace('_', ' ')}</span>
          </label>
        ))}
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -112.9544,
          latitude: 46.1306,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Road Closures */}
        {layerVisibility.road_closure && getFeaturesByType('road_closure').length > 0 && (
          <Source
            id="road-closures"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: getFeaturesByType('road_closure'),
            }}
          >
            <Layer
              id="road-closures-line"
              type="line"
              paint={{
                'line-color': getFeatureColor('road_closure'),
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* Detours */}
        {layerVisibility.detour && getFeaturesByType('detour').length > 0 && (
          <Source
            id="detours"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: getFeaturesByType('detour'),
            }}
          >
            <Layer
              id="detours-line"
              type="line"
              paint={{
                'line-color': getFeatureColor('detour'),
                'line-width': 4,
                'line-dasharray': [2, 2],
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* Parade Routes */}
        {layerVisibility.parade_route && getFeaturesByType('parade_route').length > 0 && (
          <Source
            id="parade-routes"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: getFeaturesByType('parade_route'),
            }}
          >
            <Layer
              id="parade-routes-line"
              type="line"
              paint={{
                'line-color': getFeatureColor('parade_route'),
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* Area Closures */}
        {layerVisibility.area_closure && getFeaturesByType('area_closure').length > 0 && (
          <Source
            id="area-closures"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: getFeaturesByType('area_closure'),
            }}
          >
            <Layer
              id="area-closures-fill"
              type="fill"
              paint={{
                'fill-color': getFeatureColor('area_closure'),
                'fill-opacity': 0.3,
              }}
            />
            <Layer
              id="area-closures-line"
              type="line"
              paint={{
                'line-color': getFeatureColor('area_closure'),
                'line-width': 2,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* SAR Operational Areas */}
        {layerVisibility.sar_operational_area && getFeaturesByType('sar_operational_area').length > 0 && (
          <Source
            id="sar-areas"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: getFeaturesByType('sar_operational_area'),
            }}
          >
            <Layer
              id="sar-areas-fill"
              type="fill"
              paint={{
                'fill-color': getFeatureColor('sar_operational_area'),
                'fill-opacity': 0.2,
              }}
            />
            <Layer
              id="sar-areas-line"
              type="line"
              paint={{
                'line-color': getFeatureColor('sar_operational_area'),
                'line-width': 3,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

