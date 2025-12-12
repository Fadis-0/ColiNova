import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Search, Navigation, Calendar, Filter, Truck, Car, X, Package, ArrowDown } from 'lucide-react';
import { Parcel, ParcelStatus, Trip } from '../../types';
import RealMap from '../../components/ui/RealMap';
import { Marker, Source, Layer } from 'react-map-gl/maplibre';
import { ParcelMarker } from '../../components/ui/ParcelMarker';
import { assignTransporter, updateParcelStatus, fetchTrips } from '../../services/data';
import { ParcelSearch } from '../../components/ui/ParcelSearch';
import { CreateTrip } from './CreateTrip';
import { Footer } from '../../components/layout/Footer';


export const TransporterDashboard = ({ activeTab }) => {
  const { parcels, refreshData, role, user } = useApp();
  const { t, dir } = useLanguage();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [routeForModal, setRouteForModal] = useState(null);
  const [isSearching, setIsSearching] = useState(true);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);

  const availableParcels = parcels.filter(p => p.status === ParcelStatus.PENDING);
  const myDeliveries = parcels.filter(p => p.transporter_id === user?.id && p.status !== ParcelStatus.PENDING && p.status !== ParcelStatus.DELIVERED);

  useEffect(() => {
    if (role === 'TRANSPORTER') {
      refreshData(role, user?.id);
      fetchTrips().then(setMyTrips);
    }
  }, [role, user?.id]);

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
    } catch (error) {
      console.error("Failed to confirm trip:", error);
      alert("Error: Could not confirm trip.");
    }
  };

  const handleStartTrip = async () => {
    if (!selectedParcel) return;
    try {
      await updateParcelStatus(selectedParcel.id, ParcelStatus.IN_TRANSIT);
      await refreshData(role, user?.id);
      setSelectedParcel(null);
    } catch (error) {
      console.error("Failed to start trip:", error);
      alert("Error: Could not start trip.");
    }
  };

  const handleDeliver = async () => {
    if (!selectedParcel) return;
    try {
      await updateParcelStatus(selectedParcel.id, ParcelStatus.DELIVERED);
      await refreshData(role, user?.id);
      setSelectedParcel(null);
    } catch (error) {
      console.error("Failed to deliver parcel:", error);
      alert("Error: Could not deliver parcel.");
    }
  };

  const handleSearch = (searchParams) => {
    const filtered = availableParcels.filter(p => {
      const pickupMatch = !searchParams.pickup || p.origin.label.toLowerCase().includes(searchParams.pickup.toLowerCase());
      const dropoffMatch = !searchParams.dropoff || p.destination.label.toLowerCase().includes(searchParams.dropoff.toLowerCase());
      const sizeMatch = !searchParams.size || p.size.toLowerCase() === searchParams.size.toLowerCase();
      const weightMatch = !searchParams.weight || p.weight_kg <= searchParams.weight;
      const priceMatch = !searchParams.price || p.price <= searchParams.price;
      return pickupMatch && dropoffMatch && sizeMatch && weightMatch && priceMatch;
    });
    setFilteredParcels(filtered);
    setIsSearching(false);
  };

  return (
    <div className="h-[1200px] flex flex-col" dir={dir}>
      <div className="flex-grow overflow-hidden">
        {activeTab === 'find' && (
          isSearching ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ParcelSearch onSearch={handleSearch} />
            </div>
          ) : ( 
            <div className="h-full flex flex-col md:flex-row">
              <div className={`w-full md:w-[450px] bg-white ${dir === 'rtl' ? 'border-l' : 'border-r'} border-gray-200 flex flex-col z-10 shadow-xl h-full`}>
                <div className="p-5 border-b border-gray-200 space-y-4 bg-white z-20">
                  <Button onClick={() => setIsSearching(true)}>{t('back')}</Button>
                  <h1 className="text-xl font-bold text-gray-900">{filteredParcels.length} {t('availableRequests')}</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {filteredParcels.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedParcel(p)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all bg-white relative overflow-hidden group ${
                        selectedParcel?.id === p.id 
                        ? 'border-primary ring-1 ring-primary shadow-md' 
                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex">
                        <img src={p.images || 'https://placehold.co/128x128/e2e8f0/e2e8f0'} alt={p.title} className="w-24 h-24 rounded-xl my-auto object-cover" />
                        <div className="p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{p.origin.label}</span>
                                </div>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <ArrowDown className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{p.destination.label}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                                <span>{t(p.size)}</span>
                                <span>{p.weight_kg} kg</span>
                                <span className="font-semibold text-md" >{new Date(p.delivery_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
              <div className="flex-1 relative bg-gray-200 hidden md:block">
                <RealMap>
                  {filteredParcels.filter(p => p.origin && p.origin.lat != null && p.origin.lng != null).map(p => (
                    <Marker key={p.id} longitude={p.origin.lng!} latitude={p.origin.lat!} anchor="bottom">
                      <ParcelMarker parcel={p} onClick={setSelectedParcel} />
                    </Marker>
                  ))}
                </RealMap>
              </div>
            </div>
          )
        )}
        {activeTab === 'trips' && (
          <div className="p-8 max-w-6xl mx-auto mt-5">
            <div className="flex justify-between items-center mb-6">
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
          </div>
        )}
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
                   {selectedParcel.status === ParcelStatus.MATCHED && selectedParcel.transporter_id === user?.id && (
                     <>
                        <Button onClick={() => updateParcelStatus(selectedParcel.id, ParcelStatus.PICKED_UP).then(() => refreshData(role, user.id)).then(() => setSelectedParcel(null))} className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-3">Mark as Picked Up</Button>
                     </>
                   )}
                   {selectedParcel.status === ParcelStatus.PICKED_UP && selectedParcel.transporter_id === user?.id && (
                     <>
                        <Button onClick={handleStartTrip} className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3">Start Trip</Button>
                     </>
                   )}
                   {selectedParcel.status === ParcelStatus.IN_TRANSIT && selectedParcel.transporter_id === user?.id && (
                        <Button onClick={handleDeliver} className="flex-1 bg-purple-600 hover:bg-purple-700 text-lg py-3">Mark Delivered</Button>
                   )}
                   
                 </div>
             </div>
         )}
      </Modal>
      <Footer />

    </div>
  );
};
