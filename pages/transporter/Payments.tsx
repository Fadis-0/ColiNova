import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/ui/BackButton';
import { CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ParcelStatus } from '../../types';

export const Payments = () => {
  const { t } = useLanguage();
  const { parcels, user } = useApp();

  const transporterParcels = parcels.filter(
    p => p.transporter_id === user?.id && (p.status === ParcelStatus.DELIVERED || p.status === ParcelStatus.CONFIRMED)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="mt-8 mb-6">
        <h1 className="text-3xl font-bold">{t('earningsHistory')}</h1>
        <p className="text-lg text-gray-600 mt-4">{t('earningsHistorySubtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {transporterParcels.map(parcel => {
            const isPaid = parcel.status === ParcelStatus.CONFIRMED;
            const statusText = isPaid ? t('paid') : t('pending');

            return (
              <li key={parcel.id} className="p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`mr-4 ${isPaid ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isPaid ? <CheckCircle size={24} /> : <Clock size={24} />}
                  </div>
                  <div className="mx-4">
                    <p className="font-bold text-lg">{parcel.title}</p>
                    <p className="text-sm text-gray-500">{t('completedOn')} {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-green-500">
                    +50 {t('points')}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
