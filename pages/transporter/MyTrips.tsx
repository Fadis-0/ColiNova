import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Trip } from '../../types';
import { fetchTrips, deleteTrip } from '../../services/data';
import { CreateTrip } from './CreateTrip';
import { BackButton } from '../../components/ui/BackButton';

export const MyTrips = () => {
  const { user, role, refreshData } = useApp();
  const { t } = useLanguage();
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (role === 'TRANSPORTER') {
      fetchTrips().then(setMyTrips);
    }
  }, [role, user?.id]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="mt-8 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('myDeliveries')}</h1>
        <Button onClick={() => setIsCreateTripModalOpen(true)}>{t('publishTrip')}</Button>
      </div>
      <div className="space-y-4 mt-10">
        {myTrips.map(trip => (
          <div key={trip.id} className="bg-white mx-10 p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{trip.destination.label} - {trip.origin.label}</p>
                <p className="text-sm text-gray-500">
                  {new Date(trip.departure_date).toLocaleDateString()} - {new Date(trip.arrival_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{trip.price} DZD</p>
                <p className="text-sm text-gray-500">{trip.status}</p>
                <Button
                  variant="danger"
                  className="bg-red-500 text-white mt-5"
                  size="sm"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this trip?')) {
                      await deleteTrip(trip.id);
                      fetchTrips().then(setMyTrips);
                    }
                  }}
                >
                  {t('delete')}
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>
      <Modal isOpen={isCreateTripModalOpen} onClose={() => setIsCreateTripModalOpen(false)} title={t('publishTrip')}>
        <CreateTrip
          onClose={() => setIsCreateTripModalOpen(false)}
          onTripCreated={() => {
            fetchTrips().then(setMyTrips);
            setIsCreateTripModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};
