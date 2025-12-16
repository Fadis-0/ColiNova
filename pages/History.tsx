import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Clock, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { BackButton } from '../components/ui/BackButton';
import { Footer } from '../components/layout/Footer';
import { useApp } from '../context/AppContext';
import { ParcelStatus } from '../types';
import { updateParcelStatus } from '../services/data';
import { useNotification } from '../context/NotificationContext';

export const History = () => {
  const { t, dir } = useLanguage();
  const { parcels, refreshData, user, role } = useApp();
  const { addNotification } = useNotification();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const completedParcels = parcels.filter(p => p.status === ParcelStatus.DELIVERED || p.status === ParcelStatus.CONFIRMED);

  const handleConfirmDelivery = async (parcelId: string) => {
    try {
      await updateParcelStatus(parcelId, ParcelStatus.CONFIRMED);
      addNotification(t('statusUpdated'), 'success');
      if(user)
      refreshData(role, user.id);
    } catch (error) {
      addNotification(t('statusUpdateError'), 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="flex mt-8 justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('tripHistory')}</h1>
        </div>

        {completedParcels.length === 0 ? (
          <div className="text-center bg-white rounded-3xl shadow-lg p-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('noCompletedTrips')}</h2>
            <p className="text-gray-500">{t('pastTripsAppearHere')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {completedParcels.map((parcel) => (
              <div key={parcel.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                    <div className="flex-col items-center gap-4 mb-3">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-gray-800">{parcel.origin.label}</span>
                        </div>
                        <Arrow className="w-5 h-5 mr-4 text-gray-400 my-2"/>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm text-gray-800">{parcel.destination.label}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                        {t('completedOn')} {new Date(parcel.delivery_date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                  {parcel.status === ParcelStatus.DELIVERED ? (
                    <Button onClick={() => handleConfirmDelivery(parcel.id)}>{t('confirmDelivery')}</Button>
                  ) : (
                    <Button variant="secondary">{t('viewDetails')}</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
     
    </div>
  );
};