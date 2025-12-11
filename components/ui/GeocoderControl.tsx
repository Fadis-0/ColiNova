import { useControl } from 'react-map-gl';
import MaplibreGeocoder, { GeocoderOptions } from '@maplibre/maplibre-gl-geocoder';
import maplibregl from 'maplibre-gl';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import { MapboxglGeocodingEvent } from '@maplibre/maplibre-gl-geocoder/dist/types';

type GeocoderControlProps = {
  apiKey: string;
  onResult?: (e: MapboxglGeocodingEvent) => void;
  bbox?: [number, number, number, number] | [[number, number], [number, number]];
};

export default function GeocoderControl({ apiKey, onResult, bbox }: GeocoderControlProps) {
  const geocoder = useControl<MaplibreGeocoder>(
    () => {
      const geocoderOptions: Partial<GeocoderOptions> = {
        maplibregl: maplibregl,
        marker: false,
        showResultsWhileTyping: true,
        showResultType: false,
        popup: false,
        apiKey: apiKey,
      };
      if (bbox) {
        geocoderOptions.bbox = bbox;
      }

      const ctrl = new MaplibreGeocoder(
        geocoderOptions,
        {
          // API configuration
          url: 'https://api.maptiler.com/geocoding',
          getRequest: (url: string) => {
            return new Request(url + '.json');
          },
        }
      );
      if (onResult) {
        ctrl.on('result', onResult);
      }
      return ctrl;
    },
    {
      position: 'top-left',
    }
  );

  return null;
}
