import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Parcel, ParcelStatus } from '../../types';
import { BackButton } from '../../components/ui/BackButton';
import { MapPin, Package as PackageIcon } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { updateParcelStatus } from '../../services/data';
import { useNotification } from '../../context/NotificationContext';

const getNextStatus = (status: ParcelStatus): ParcelStatus | null => {
  switch (status) {
    case ParcelStatus.MATCHED:
      return ParcelStatus.PICKED_UP;
    case ParcelStatus.PICKED_UP:
      return ParcelStatus.IN_TRANSIT;
    case ParcelStatus.IN_TRANSIT:
      return ParcelStatus.DELIVERED;
    default:
      return null;
  }
};

export const AcceptedParcels = () => {
  const { parcels, user, refreshData } = useApp();
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const [acceptedParcels, setAcceptedParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  const handleStatusChange = async (parcelId: string, nextStatus: ParcelStatus) => {
    try {
      await updateParcelStatus(parcelId, nextStatus);
      addNotification(t('statusUpdated'), 'success');
      if (user) {
        refreshData(user.role, user.id);
      }
      setSelectedParcel(null);
    } catch (error) {
      addNotification(t('statusUpdateError'), 'error');
    }
  };

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
              className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform cursor-pointer"
              onClick={() => setSelectedParcel(parcel)}
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
      <Modal
        isOpen={!!selectedParcel}
        onClose={() => setSelectedParcel(null)}
        title={t('shipmentDetails')}
      >
        {selectedParcel && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('trackingNumber')}</p>
                <p className="text-lg font-bold text-gray-900">{selectedParcel.tracking_code}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                     ${selectedParcel.status === ParcelStatus.PENDING ? 'bg-amber-100 text-amber-700' : ''}
                     ${selectedParcel.status === ParcelStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-700' : ''}
                  `}>
                {t(selectedParcel.status.toLowerCase())}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase">{t('pickup')}</p>
                <p className="font-medium">{selectedParcel.origin.label}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-gray-500 uppercase">{t('dropoff')}</p>
                <p className="font-medium">{selectedParcel.destination.label}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-bold text-gray-900 mb-2">{t('itemInfo')}</h4>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded">{t('size')}: {selectedParcel.size}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{t('weight')}: {selectedParcel.weight_kg}kg</span>
              </div>
              <div className="mt-5 text-sm text-gray-500">{t('description')}: 
                <p>{selectedParcel.description}</p>
              </div>
              <div className="mt-5 text-sm text-gray-500">{t('specialInstructions')}: 
                <p>{selectedParcel.instructions}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1" 
                onClick={() => {
                  const nextStatus = getNextStatus(selectedParcel.status);
                  if (nextStatus) {
                    handleStatusChange(selectedParcel.id, nextStatus);
                  }
                }}
                disabled={!getNextStatus(selectedParcel.status)}
              >
                {
                  getNextStatus(selectedParcel.status) === ParcelStatus.PICKED_UP ? t('markAsPickedUp') :
                  getNextStatus(selectedParcel.status) === ParcelStatus.IN_TRANSIT ? t('markAsInTransit') :
                  getNextStatus(selectedParcel.status) === ParcelStatus.DELIVERED ? t('markAsDelivered') :
                  ''
                }
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
