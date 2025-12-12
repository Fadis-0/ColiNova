import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Trip } from '../../types';
import { ArrowRight, ArrowLeft, Users } from 'lucide-react';
import { fetchTrips } from '../../services/data';
import { BackButton } from '../../components/ui/BackButton';

export const AvailableTrips = () => {
  const { t, dir } = useLanguage();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    fetchTrips().then(setTrips);
  }, []);

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col lg:flex-row" dir={dir}>
      <div className={`flex-1 ${dir === 'rtl' ? 'lg:mr-0' : 'lg:ml-0'} p-4 lg:p-8`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <BackButton />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mt-4 text-gray-900">{t('availableTravelers')}</h2>
            <div className="space-y-4">
              {trips.length > 0 ? trips.map(trip => (
                <div key={trip.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-bold">{trip.origin.label} <Arrow className="inline w-4 h-4" /> {trip.destination.label}</p>
                      <p className="text-sm text-gray-500">
                        {t('departure')}: {new Date(trip.departure_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">{t('contact')}</Button>
                </div>
              )) : <p>{t('noTrips')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
