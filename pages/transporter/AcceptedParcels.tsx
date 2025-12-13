import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Parcel, ParcelStatus } from '../../types';
import { BackButton } from '../../components/ui/BackButton';
import { MapPin, Package as PackageIcon } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AcceptedParcels = () => {
  const { parcels, user } = useApp();
  const { t } = useLanguage();
  const [acceptedParcels, setAcceptedParcels] = useState<Parcel[]>([]);

  useEffect(() => {
    if (user) {
      const filteredParcels = parcels.filter(p => p.status !== ParcelStatus.PENDING && p.transporter_id === user.id);
      setAcceptedParcels(filteredParcels);
    }
  }, [parcels, user]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('acceptedParcels')}</h1>
            <p className="text-lg text-gray-600 mt-4">{t('acceptedParcelsSubtitle')}</p>
          </div>
        </div>
      </div>
      {acceptedParcels.length === 0 ? (
        <EmptyState
          icon={<PackageIcon className="w-16 h-16" />}
          title={t('noAcceptedDeliveries')}
          subtitle={t('noAcceptedDeliveriesSubtitle')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {acceptedParcels.map(parcel => (
            <div 
              key={parcel.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                    parcel.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                    parcel.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>{parcel.status}</span>
                  <p className="font-bold text-lg">{parcel.price}</p>
                </div>
                <div className="mt-4">
                    <h3 className="font-bold text-lg mb-1">{parcel.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <p className="font-semibold">{parcel.origin.label}</p>
                    </div>
                    <div className="h-4 w-px bg-gray-300 mx-auto my-1"></div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <p className="font-semibold">{parcel.destination.label}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(parcel.delivery_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
