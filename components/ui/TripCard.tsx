
import React from 'react';
import { Trip } from '../../types';
import { Button } from './Button';
import { MapPin, Calendar, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TripCardProps {
  trip: Trip;
  onSelect: (tripId: string, transporterId: string) => void;
  isSelected: boolean;
  rating?: number;
  successRate?: number;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, isSelected, rating = 4.5, successRate = 98 }) => {
  const { t } = useLanguage();
  const reviewCount = 12; // Mock data

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg text-gray-800">{trip.transporter_name || 'Anonymous'}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{rating} ({reviewCount} {t('reviews')})</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600">
                <ShieldCheck className="w-4 h-4 mr-1" />
                <span className="font-semibold">{successRate}%</span>
            </div>
            <p className="text-xs text-gray-500">{t('successRate')}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="font-semibold">{trip.origin.label}</p>
          </div>
          <div className="h-4 w-px bg-gray-300 ml-2 my-1" />
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-red-500" />
            <p className="font-semibold">{trip.destination.label}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(trip.departure_date).toLocaleDateString()}</span>
          </div>
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            onClick={() => onSelect(trip.id, trip.transporter_id)}
          >
            {isSelected ? t('selected') : t('select')}
          </Button>
        </div>
      </div>
    </div>
  );
};
