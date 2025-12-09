import React from 'react';
import { Package } from 'lucide-react';
import { Parcel } from '../../types';

interface ParcelMarkerProps {
  parcel: Parcel;
  onClick: (parcel: Parcel) => void;
}

export const ParcelMarker: React.FC<ParcelMarkerProps> = ({ parcel, onClick }) => {
  return (
    <button
      onClick={() => onClick(parcel)}
      className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all border-2 border-transparent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="flex flex-col items-center">
        <Package className="w-5 h-5 text-gray-800" />
        <span className="text-xs font-bold text-gray-900">DZD{parcel.price}</span>
      </div>
    </button>
  );
};
