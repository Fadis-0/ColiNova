import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Trip } from '../../types';
import { fetchTrips, deleteTrip } from '../../services/data';
import { CreateTrip } from './CreateTrip';
import { BackButton } from '../../components/ui/BackButton';
import { MapPin, Calendar, Trash2, Edit, Plus } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const MyTrips = () => {
  const { user, role } = useApp();
  const { t } = useLanguage();
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    if (role === 'TRANSPORTER') {
      fetchTrips().then(setMyTrips);
    }
  }, [role, user?.id, updateKey]);

  const onTripCreated = () => {
    setUpdateKey(k => k + 1);
    setIsCreateTripModalOpen(false);
  }

  const onTripDeleted = async (tripId: string) => {
    await deleteTrip(tripId);
    setUpdateKey(k => k + 1);
    setSelectedTrip(null);    
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('myTripsTitle')}</h1>
            <p className="text-lg text-gray-600 mt-2">{t('myTripsSubtitle')}</p>
          </div>
          <Button onClick={() => setIsCreateTripModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            <p className="text-lg">{t('publishTrip')}</p>
          </Button>
        </div>
      </div>
      {myTrips.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-16 h-16" />}
          title={t('noPublishedTrips')}
          subtitle={t('noPublishedTripsSubtitle')}
          action={
            <Button onClick={() => setIsCreateTripModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              {t('publishTrip')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {myTrips.map(trip => (
            <div 
              key={trip.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform cursor-pointer"
              onClick={() => setSelectedTrip(trip)}
            >
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
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={isCreateTripModalOpen} onClose={() => setIsCreateTripModalOpen(false)} title={t('publishTrip')}>
        <CreateTrip
          onClose={() => setIsCreateTripModalOpen(false)}
          onTripCreated={onTripCreated}
        />
      </Modal>
      <Modal isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} title="تفاصيل الرحلة">
        {selectedTrip && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">
                  <div><span className="text-sm font-normal">من: </span>{selectedTrip.origin.label}</div>
                  <div><span className="text-sm font-normal">الى: </span>{selectedTrip.destination.label}</div>
                </p>
                <p className="font-bold text-xl">{selectedTrip.price} DZD</p>
              </div>
              <div className="mt-6 flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>{new Date(selectedTrip.departure_date).toLocaleDateString()} - {new Date(selectedTrip.arrival_date).toLocaleDateString()}</span>
                <span>{selectedTrip.status}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                className="flex-1"
                variant="danger"
                onClick={() => onTripDeleted(selectedTrip.id)}
                className="mt-4 bg-red-500 text-white flex gap-2 flex-1 text-lg"
              >
                <Trash2 className="w-5 h-5" />
                <span>{t('delete')}</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};