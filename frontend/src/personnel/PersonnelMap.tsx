import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Map, { Source, Layer, MapRef, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapService } from '../services/mapService';
import { formatFeatureForMapbox, getFeatureColor, snapToRoads } from '../utils/mapUtils';
import './PersonnelMap.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PersonnelMap() {
  const mapRef = useState<MapRef | null>(null);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [currentFeature, setCurrentFeature] = useState<number[][]>([]);

  const { data: features, refetch } = useQuery({
    queryKey: ['mapFeatures'],
    queryFn: mapService.getFeatures,
  });

  const handleMapClick = async (event: any) => {
    if (!drawingMode) return;

    const { lng, lat } = event.lngLat;
    const newPoint = [lng, lat] as [number, number];

    if (currentFeature.length === 0) {
      setCurrentFeature([newPoint]);
    } else {
      const updated = [...currentFeature, newPoint];
      
      // Snap to roads if it's a line feature
      if (drawingMode !== 'area_closure') {
        const snapped = await snapToRoads(updated);
        setCurrentFeature(snapped);
      } else {
        setCurrentFeature(updated);
      }
    }
  };

  const saveFeature = async () => {
    if (currentFeature.length < 2) return;

    try {
      await mapService.createFeature({
        name: `New ${drawingMode?.replace('_', ' ')}`,
        type: drawingMode!,
        geometry: {
          type: drawingMode === 'area_closure' ? 'Polygon' : 'LineString',
          coordinates: drawingMode === 'area_closure' 
            ? [currentFeature] 
            : currentFeature,
        },
        visibility: 'public',
      });
      setCurrentFeature([]);
      setDrawingMode(null);
      refetch();
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  return (
    <div className="personnel-map-container">
      <div className="map-toolbar">
        <h3>Map Editor</h3>
        <div className="toolbar-actions">
          <button
            className={drawingMode === 'road_closure' ? 'active' : ''}
            onClick={() => setDrawingMode('road_closure')}
          >
            Road Closure
          </button>
          <button
            className={drawingMode === 'detour' ? 'active' : ''}
            onClick={() => setDrawingMode('detour')}
          >
            Detour
          </button>
          <button
            className={drawingMode === 'parade_route' ? 'active' : ''}
            onClick={() => setDrawingMode('parade_route')}
          >
            Parade Route
          </button>
          <button
            className={drawingMode === 'area_closure' ? 'active' : ''}
            onClick={() => setDrawingMode('area_closure')}
          >
            Area Closure
          </button>
          {drawingMode && (
            <>
              <button onClick={saveFeature} className="btn-save">
                Save
              </button>
              <button onClick={() => { setCurrentFeature([]); setDrawingMode(null); }}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -112.9544,
          latitude: 46.1306,
          zoom: 11,
        }}
        style={{ width: '100%', height: 'calc(100vh - 200px)' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={handleMapClick}
      >
        {/* Render existing features */}
        {features?.map((feature) => {
          const formatted = formatFeatureForMapbox(feature);
          return (
            <Source key={feature.id} id={feature.id} type="geojson" data={formatted}>
              <Layer
                id={`${feature.id}-line`}
                type={feature.geometry.type === 'Polygon' ? 'fill' : 'line'}
                paint={{
                  'line-color': getFeatureColor(feature.type),
                  'line-width': 4,
                  'fill-color': getFeatureColor(feature.type),
                  'fill-opacity': 0.3,
                }}
              />
            </Source>
          );
        })}

        {/* Render current drawing */}
        {currentFeature.length > 0 && (
          <Source
            id="current-drawing"
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: drawingMode === 'area_closure' ? 'Polygon' : 'LineString',
                coordinates: drawingMode === 'area_closure' 
                  ? [currentFeature] 
                  : currentFeature,
              },
            }}
          >
            <Layer
              id="current-drawing-line"
              type={drawingMode === 'area_closure' ? 'fill' : 'line'}
              paint={{
                'line-color': drawingMode ? getFeatureColor(drawingMode) : '#000',
                'line-width': 4,
                'fill-color': drawingMode ? getFeatureColor(drawingMode) : '#000',
                'fill-opacity': 0.3,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

