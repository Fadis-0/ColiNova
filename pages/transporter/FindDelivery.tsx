import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MapPin, ArrowDown, Maximize, Package as PackageIcon } from 'lucide-react';
import { Parcel, ParcelStatus } from '../../types';
import RealMap from '../../components/ui/RealMap';
import { Marker } from 'react-map-gl/maplibre';
import { ParcelMarker } from '../../components/ui/ParcelMarker';
import { assignTransporter, updateParcelStatus } from '../../services/data';
import { ParcelSearch } from '../../components/ui/ParcelSearch';
import { BackButton } from '../../components/ui/BackButton';
import { useNotification } from '../../context/NotificationContext';
import { EmptyState } from '../../components/ui/EmptyState';

export const FindDelivery = () => {
  const { parcels, refreshData, role, user } = useApp();
  const { t, dir } = useLanguage();
  const { addNotification } = useNotification();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [routeForModal, setRouteForModal] = useState(null);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);

  const availableParcels = parcels.filter(p => p.status === ParcelStatus.PENDING);

  useEffect(() => {
    setFilteredParcels(availableParcels);
  }, [parcels]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!selectedParcel || !selectedParcel.origin.lat || !selectedParcel.origin.lng || !selectedParcel.destination.lat || !selectedParcel.destination.lng) {
        setRouteForModal(null);
        return;
      }

      const origin = `${selectedParcel.origin.lng},${selectedParcel.origin.lat}`;
      const destination = `${selectedParcel.destination.lng},${selectedParcel.destination.lat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRouteForModal(data.routes[0].geometry);
        } else {
          setRouteForModal(null);
        }
      } catch (error) {
        console.error("Failed to fetch route for modal:", error);
        setRouteForModal(null);
      }
    };

    fetchRoute();
  }, [selectedParcel]);


  const handleConfirmTrip = async () => {
    if (!selectedParcel || !user) return;
    try {
      await assignTransporter(selectedParcel.id, user.id);
      await refreshData(role, user.id);
      setSelectedParcel(null);
      addNotification(t('tripConfirmed'), 'success');
    } catch (error) {
      console.error("Failed to confirm trip:", error);
      addNotification(t('errorConfirmingTrip'), 'error');
    }
  };

  const handleSearch = (searchParams) => {
    const filtered = availableParcels.filter(p => {
      const pickupMatch = !searchParams.pickup || searchParams.pickup.split(' ').some(word => p.origin.label.toLowerCase().includes(word.toLowerCase()));
      const dropoffMatch = !searchParams.dropoff || searchParams.dropoff.split(' ').some(word => p.destination.label.toLowerCase().includes(word.toLowerCase()));
      const sizeMatch = !searchParams.size || p.size.toLowerCase() === searchParams.size.toLowerCase();
      const weightMatch = !searchParams.weight || p.weight_kg <= searchParams.weight;
      return pickupMatch && dropoffMatch && sizeMatch && weightMatch;
    });
    setFilteredParcels(filtered);
  };

  return (
    <div className={`flex h-screen ${isFullScreenMap ? 'flex-col' : ''}`} dir={dir}>
      <div className={`flex flex-col ${isFullScreenMap ? 'hidden' : 'w-1/3'}`}>
        <div className="p-6 border-b border-gray-200">
          <BackButton />
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('findDeliveryTitle')}</h1>
            <p className="text-lg text-gray-600 mt-2">{t('findDeliverySubtitle')}</p>
          </div>
          <ParcelSearch onSearch={handleSearch} />
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-3 bg-gray-50">
          {filteredParcels.length === 0 ? (
            <EmptyState
              icon={<PackageIcon className="w-16 h-16" />}
              title={t('noAvailableDeliveries')}
              subtitle={t('noAvailableDeliveriesSubtitle')}
            />
          ) : (
            filteredParcels.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedParcel(p)}
                className={`p-4 rounded-lg border cursor-pointer transition-all bg-white relative overflow-hidden group ${
                  selectedParcel?.id === p.id 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex gap-4">
                  <img src={p.images?.[0] || 'https://placehold.co/128x128/e2e8f0/e2e8f0'} alt={p.title} className="w-24 h-24 rounded-md object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                    <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2 pt-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{p.origin.label}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                            <span>{p.destination.label}</span>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                        <span className="font-semibold">{p.price}</span>
                        <span className="text-gray-500">{new Date(p.delivery_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={`relative my-auto ${isFullScreenMap ? 'h-full w-full' : 'w-2/3 h-full'}`}>
        <RealMap>
          {filteredParcels.filter(p => p.origin && p.origin.lat != null && p.origin.lng != null).map(p => (
            <Marker key={p.id} longitude={p.origin.lng!} latitude={p.origin.lat!} anchor="bottom">
              <ParcelMarker parcel={p} onClick={setSelectedParcel} />
            </Marker>
          ))}
        </RealMap>
        <Button
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
          variant="outline"
          size="sm"
          onClick={() => setIsFullScreenMap(!isFullScreenMap)}
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
      <Modal
        isOpen={!!selectedParcel}
        onClose={() => setSelectedParcel(null)}
        title="Delivery Opportunity"
      >
         {selectedParcel && (
             <div className="animate-in fade-in" dir={dir}>
                 <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 text-3xl">📦</div>
                        <p className="font-bold text-gray-900">{selectedParcel.size} Package</p>
                        <p className="text-sm text-gray-500">{selectedParcel.weight_kg} kg</p>
                    </div>
                 <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-bold text-gray-900 text-xl">{selectedParcel.title}</h2>
                        </div>
                        <p className="mb-4 text-sm text-gray-500">Published by {selectedParcel.receiverName} • <span className="text-yellow-500">★ 4.9</span></p>
                        
                        <div className={`space-y-3 relative ${dir === 'rtl' ? 'pr-2' : 'pl-2'}`}>
                             <div className={`absolute ${dir === 'rtl' ? 'right-[7px]' : 'left-[7px]'} top-[7px] bottom-[7px] w-0.5 bg-gray-200`}></div>
                             <div className="flex items-center text-sm relative z-10">
                               <div className={`w-3 h-3 rounded-full border-2 border-primary bg-white ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></div>
                               <span className="font-medium text-gray-900">{selectedParcel.origin.label}</span>
                            </div>
                             <div className="flex items-center text-sm relative z-10">
                               <div className={`w-3 h-3 rounded-full border-2 border-secondary bg-white ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></div>
                               <span className="font-medium text-gray-900">{selectedParcel.destination.label}</span>
                            </div>
                        </div>
                    </div>
                 </div>

               <div className="h-48 rounded-xl overflow-hidden border border-gray-200 mb-4">
                  <RealMap
                    initialViewState={{
                      latitude: ((selectedParcel.origin.lat ?? 49.5) + (selectedParcel.destination.lat ?? 49.5)) / 2,
                      longitude: ((selectedParcel.origin.lng ?? 8) + (selectedParcel.destination.lng ?? 8)) / 2,
                      zoom: 2
                    }}
                    markers={[
                      { ...selectedParcel.origin, color: 'blue' },
                      { ...selectedParcel.destination, color: 'red' }
                    ]}
                    route={routeForModal}
                  />
               </div>

               {selectedParcel.images && selectedParcel.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {selectedParcel.images.map((img, i) => (
                    <img key={i} src={img} alt="Parcel" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  ))}
                </div>
               )}

                 

                 <div className="flex gap-3">
                   {selectedParcel.status === ParcelStatus.PENDING && (
                      <Button onClick={handleConfirmTrip} className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3">{t('acceptDelivery')}</Button>
                   )}
                 </div>
             </div>
         )}
      </Modal>
    </div>
  );
};