import React from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import maplibregl, { MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Coordinates } from '../../types';
import GeocoderControl from './GeocoderControl';
import { MapboxglGeocodingEvent } from '@maplibre/maplibre-gl-geocoder/dist/types';
import { MapPin } from 'lucide-react';

interface MarkerProps extends Coordinates {
  color: string;
}

interface RealMapProps {
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers?: MarkerProps[];
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  onGeocodeResult?: (e: MapboxglGeocodingEvent) => void;
  route?: any;
  locationSelectionMode?: 'origin' | 'destination';
  children?: React.ReactNode;
}

const RealMap: React.FC<RealMapProps> = ({ initialViewState, markers, onLocationSelect, onGeocodeResult, route, locationSelectionMode, children }) => {
  const handleClick = (event: MapLayerMouseEvent) => {
    if (onLocationSelect && locationSelectionMode) {
      onLocationSelect({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      });
    }
  };

  const apiKey = import.meta.env.VITE_MAPTILER_KEY;
  const mapStyle = `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`;

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-red-500">MapTiler API key is missing.</p>
      </div>
    );
  }

  const cursorStyle = locationSelectionMode ? 'crosshair' : 'grab';

  return (
    <Map
      mapLib={maplibregl}
      initialViewState={initialViewState}
      style={{ width: '100%', height: '100%' }}
      mapStyle={mapStyle}
      onClick={handleClick}
      cursor={cursorStyle}
    >
      <GeocoderControl apiKey={apiKey} onResult={onGeocodeResult} />
      {markers?.filter(marker => marker.lat && marker.lng).map((marker, index) => (
        <Marker key={index} longitude={marker.lng!} latitude={marker.lat!} anchor="bottom">
          <MapPin style={{ color: marker.color }} fill={marker.color} stroke="white" strokeWidth={2} size={32} />
        </Marker>
      ))}
      {children}
      {route && (
        <Source id="route" type="geojson" data={route}>
          <Layer
            id="route"
            type="line"
            source="route"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#007cbf',
              'line-width': 5,
              'line-opacity': 0.75
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default RealMap;
