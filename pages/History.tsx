import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Clock, Package, ArrowRight, ArrowLeft } from 'lucide-react';

export const History = () => {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  
  // Mock data for completed trips - replace with actual data later
  const completedTrips = [
    { id: 1, from: 'Paris, France', to: 'Lille, France', date: '2024-07-15', items: 2 },
    { id: 2, from: 'Algiers, Algeria', to: 'Oran, Algeria', date: '2024-06-28', items: 1 },
    { id: 3, from: 'New York, USA', to: 'Boston, USA', date: '2024-05-10', items: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" dir={dir}>
      <div className="max-w-4xl mt-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('tripHistory')}</h1>
        </div>

        {completedTrips.length === 0 ? (
          <div className="text-center bg-white rounded-3xl shadow-lg p-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('noCompletedTrips')}</h2>
            <p className="text-gray-500">{t('pastTripsAppearHere')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {completedTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-800">{trip.from}</span>
                        </div>
                        <Arrow className="w-5 h-5 text-gray-400 mt-1"/>
                        <div className="flex flex-col items-center">
                           <span className="font-bold text-lg text-gray-800">{trip.to}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        {t('completedOn')} {new Date(trip.date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="text-center">
                        <p className="font-bold text-2xl text-primary">{trip.items}</p>
                        <p className="text-sm text-gray-500">{t('parcels')}</p>
                    </div>
                    <Button variant="secondary">{t('viewDetails')}</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
