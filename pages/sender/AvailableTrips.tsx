import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Trip, Parcel, ParcelStatus } from '../../types';
import { ArrowRight, ArrowLeft, MapPin, Calendar, Plus, Search } from 'lucide-react';
import { fetchTrips, assignTransporter } from '../../services/data';
import { BackButton } from '../../components/ui/BackButton';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';

export const AvailableTrips = () => {
  const { t, dir } = useLanguage();
  const { user, parcels, refreshData, role } = useApp();
  const { addNotification } = useNotification();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const senderParcels = parcels.filter(p => p.sender_id === user?.id && p.status === ParcelStatus.PENDING);

  useEffect(() => {
    fetchTrips().then(setTrips);
  }, []);
  
  const handleAssignClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsAssignModalOpen(true);
  }
  
  const handleAssignParcel = async (parcelId: string) => {
    if(!selectedTrip || !user) return;
    try {
      await assignTransporter(parcelId, selectedTrip.transporter_id);
      addNotification(t('parcelAssignedSuccess'), 'success');
      await refreshData(role, user.id);
    } catch (error) {
      addNotification(t('failedToAssignParcel'), 'error');
    }
  }

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-4 lg:p-8" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mt-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('availableTripsTitle')}</h1>
          <p className="text-lg text-gray-600 mt-2">{t('availableTripsSubtitle')}</p>
        </div>
        {trips.length === 0 ? (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title={t('noAvailableTrips')}
            subtitle={t('noAvailableTripsSubtitle')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      trip.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' : 
                      trip.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>{trip.status}</span>
                    <p className="font-bold text-lg">{trip.price} DZD</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <p className="font-semibold">{trip.origin.label}</p>
                    </div>
                    <div className="h-4 w-px bg-gray-300 mx-auto my-1"></div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <p className="font-semibold">{trip.destination.label}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(trip.departure_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(trip.arrival_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                   <Button className="w-full mt-4" onClick={() => handleAssignClick(trip)}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('assign')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={t('assignParcelToTrip')}>
        <div className="space-y-4">
            {senderParcels.map(p => (
                <div key={p.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">{p.title}</p>
                        <p className="text-sm text-gray-500">{p.origin.label} to {p.destination.label}</p>
                    </div>
                    <Button onClick={() => handleAssignParcel(p.id)}>{t('assign')}</Button>
                </div>
            ))}
            {senderParcels.length === 0 && <p>{t('noPendingParcels')}</p>}
        </div>
      </Modal>
    </div>
  );
};
