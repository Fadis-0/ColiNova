import React, { useState, useRef, useEffect } from 'react';
import { Coordinates } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

interface MapCanvasProps {
  markers?: Array<Coordinates & { id?: string; type?: 'origin' | 'destination' | 'parcel' | 'transporter' }>;
  routes?: Array<{ start: Coordinates; end: Coordinates; color?: string }>;
  interactive?: boolean;
  onLocationSelect?: (coords: Coordinates) => void;
  className?: string;
  zoom?: number; // visual scale 1-3
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ 
  markers = [], 
  routes = [], 
  interactive = false, 
  onLocationSelect,
  className = '',
  zoom = 1
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  const handleMapClick = (e: React.MouseEvent) => {
    if (!interactive || !onLocationSelect || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onLocationSelect({ x, y });
  };

  // Mock map background pattern
  return (
    <div 
      ref={mapRef}
      className={`relative overflow-hidden bg-slate-100 rounded-lg border border-slate-200 shadow-inner group ${className} ${interactive ? 'cursor-crosshair' : ''}`}
      onClick={handleMapClick}
    >
      {/* Background Grid/Roads Simulation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Random Rivers/Roads for aesthetic */}
            <path d="M 0 50 Q 50 20 100 60" stroke="black" strokeWidth="2" fill="none" />
            <path d="M 30 0 Q 60 50 40 100" stroke="black" strokeWidth="2" fill="none" />
         </svg>
      </div>

      {/* Routes Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {routes.map((route, i) => (
          <line 
            key={i}
            x1={`${route.start.x}%`} 
            y1={`${route.start.y}%`} 
            x2={`${route.end.x}%`} 
            y2={`${route.end.y}%`} 
            stroke={route.color || "#4F46E5"} 
            strokeWidth="3" 
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        ))}
      </svg>

      {/* Markers */}
      {markers.map((marker, i) => (
        <div
          key={i}
          className="absolute z-20 transform -translate-x-1/2 -translate-y-full transition-all duration-500 ease-out"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {marker.type === 'transporter' ? (
            <div className="bg-white p-1 rounded-full shadow-lg border-2 border-primary">
               <Navigation className="w-5 h-5 text-primary rotate-45" />
            </div>
          ) : (
            <div className="relative group/pin">
               <MapPin className={`w-8 h-8 ${marker.type === 'destination' ? 'text-secondary' : 'text-primary'} drop-shadow-md`} fill="currentColor" />
               {marker.label && (
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white px-2 py-1 text-xs font-bold rounded shadow border whitespace-nowrap hidden group-hover/pin:block">
                   {marker.label}
                 </div>
               )}
            </div>
          )}
        </div>
      ))}
      
      {/* Interactive Helper Text */}
      {interactive && (
        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-xs rounded shadow backdrop-blur-sm">
          Click map to set location
        </div>
      )}
    </div>
  );
};