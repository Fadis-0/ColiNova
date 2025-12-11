import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Search, Navigation, Calendar, Filter, Truck, Car, X, Package } from 'lucide-react';
import { Parcel, ParcelStatus, Trip } from '../../types';
import RealMap from '../../components/ui/RealMap';
import { Marker } from 'react-map-gl/maplibre';
import { ParcelMarker } from '../../components/ui/ParcelMarker';
import { assignTransporter, updateParcelStatus, fetchTrips } from '../../services/data';
import { ParcelSearch } from '../../components/ui/ParcelSearch';
import { CreateTrip } from './CreateTrip';

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
    <div className="h-[calc(100vh-80px)] flex flex-col" dir={dir}>
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
                      {/* ... parcel list item ... */}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative bg-gray-200 hidden md:block">
                <RealMap  
                  initialViewState={{
                    latitude: 36,
                    longitude: 3,
                    zoom: 5
                  }}
                >
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
                      <p className="font-bold">{trip.origin.label} to {trip.destination.label}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(trip.departure_date).toLocaleDateString()} - {new Date(trip.arrival_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{trip.price} DZD</p>
                      <p className="text-sm text-gray-500">{trip.status}</p>
                    </div>
                  </div>
                  <Button
                    variant="danger"
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
        {/* ... modal content ... */}
      </Modal>
    </div>
  );
};
