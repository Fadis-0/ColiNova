import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Search, Navigation, Calendar, Filter, Truck, Car, X, Package } from 'lucide-react';
import { Parcel, ParcelStatus } from '../../types';
import RealMap from '../../components/ui/RealMap';
import { Marker } from 'react-map-gl/maplibre';
import { ParcelMarker } from '../../components/ui/ParcelMarker';
import { assignTransporter, updateParcelStatus } from '../../services/data';

export const TransporterDashboard = () => {
  const { parcels, refreshData, role, user } = useApp();
  const { t, dir } = useLanguage();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [routeForModal, setRouteForModal] = useState(null);

  const availableParcels = parcels.filter(p => p.status === ParcelStatus.PENDING);
  const myDeliveries = parcels.filter(p => p.transporter_id === user?.id && p.status !== ParcelStatus.PENDING && p.status !== ParcelStatus.DELIVERED);

  useEffect(() => {
    if(role === 'TRANSPORTER') refreshData(role, user?.id);
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

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-gray-100" dir={dir}>
      {/* Left Sidebar: Search & List */}
      <div className={`w-full md:w-[450px] bg-white ${dir === 'rtl' ? 'border-l' : 'border-r'} border-gray-200 flex flex-col z-10 shadow-xl h-full`}>
        {/* Search Header */}
        <div className="p-5 border-b border-gray-200 space-y-4 bg-white z-20">
          <h1 className="text-xl font-bold text-gray-900">{t('findDelivery')}</h1>
          
          <div className="space-y-3">
             <div className="relative">
               <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
               <input 
                 placeholder={t('whereGoingQ')} 
                 className={`w-full ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all`}
               />
             </div>
             <div className="flex gap-2">
                <div className="relative flex-1">
                   <Calendar className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
                   <input 
                     type="text"
                     placeholder={t('anyDate')}
                     className={`w-full ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white outline-none`}
                   />
                </div>
                <Button variant="outline" className="px-3 border-gray-200"><Filter className="w-4 h-4"/></Button>
             </div>
             
             {/* Tags */}
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 whitespace-nowrap flex items-center"><Car className="w-3 h-3 mx-1"/> {t('fitsCar')}</button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 whitespace-nowrap flex items-center"><Truck className="w-3 h-3 mx-1"/> {t('vanRequired')}</button>
             </div>
          </div>
        </div>
        
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <p className="text-xs font-bold text-gray-400 uppercase px-1 mb-1">{myDeliveries.length} {t('myDeliveries')}</p>
          {myDeliveries.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedParcel(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all bg-white relative overflow-hidden group ${
                selectedParcel?.id === p.id 
                ? 'border-primary ring-1 ring-primary shadow-md' 
                : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Vertical Color Strip */}
              <div className={`absolute ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 ${selectedParcel?.id === p.id ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/30'}`}></div>

              <div className={`flex justify-between items-start mb-3 ${dir === 'rtl' ? 'pr-2' : 'pl-2'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-indigo-50 overflow-hidden flex items-center justify-center">
                    {p.images && p.images.length > 0 ? (
                        <img className="w-full h-full object-cover" src={p.images[0]} alt="parcel" />
                    ) : (
                        <Package className="w-8 h-8 text-indigo-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <span className={`bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}>{p.size}</span>
                        <span>{p.weight_kg} kg</span>
                    </div>
                  </div>
                </div>
                <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
                   <span className="block text-lg font-bold text-green-600">DZD{p.price}</span>
                </div>
              </div>

              <div className={`space-y-2 ${dir === 'rtl' ? 'pr-2' : 'pl-2'} relative`}>
                 {/* Route Line */}
                 <div className={`absolute ${dir === 'rtl' ? 'right-[3px]' : 'left-[3px]'} top-[6px] bottom-[6px] w-0.5 bg-gray-200`}></div>

                 <div className="flex items-center text-sm relative z-10">
                   <div className={`w-2 h-2 rounded-full border border-gray-400 bg-white ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></div>
                   <span className="font-medium text-gray-700">{p.origin.label}</span>
                </div>
                 <div className="flex items-center text-sm relative z-10">
                   <div className={`w-2 h-2 rounded-full border border-gray-400 bg-gray-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></div>
                   <span className="font-medium text-gray-700">{p.destination.label}</span>
                </div>
              </div>
              
              <div className={`mt-3 ${dir === 'rtl' ? 'pr-2' : 'pl-2'} flex items-center justify-between text-xs`}>
                 <span className="text-gray-400">{p.status}</span>
                 <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">+ DZD2 tip possible</span>
              </div>
            </div>
          ))}
          <p className="text-xs font-bold text-gray-400 uppercase px-1 mb-1">{availableParcels.length} {t('availableRequests')}</p>
          {availableParcels.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedParcel(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all bg-white relative overflow-hidden group ${
                selectedParcel?.id === p.id 
                ? 'border-primary ring-1 ring-primary shadow-md' 
                : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Vertical Color Strip */}
              <div className={`absolute ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 ${selectedParcel?.id === p.id ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/30'}`}></div>

              <div className={`flex justify-between items-start mb-3 ${dir === 'rtl' ? 'pr-2' : 'pl-2'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-indigo-50 overflow-hidden flex items-center justify-center">
                    {p.images && p.images.length > 0 ? (
                        <img className="w-full h-full object-cover" src={p.images[0]} alt="parcel" />
                    ) : (
                        <Package className="w-8 h-8 text-indigo-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <span className={`bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}>{p.size}</span>
                        <span>{p.weight_kg} kg</span>
                    </div>
                  </div>
                </div>
                <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
                   <span className="block text-lg font-bold text-green-600">DZD{p.price}</span>
                </div>
              </div>

              <div className={`space-y-2 ${dir === 'rtl' ? 'pr-2' : 'pl-2'} relative`}>
                 {/* Route Line */}
                 <div className={`absolute ${dir === 'rtl' ? 'right-[3px]' : 'left-[3px]'} top-[6px] bottom-[6px] w-0.5 bg-gray-200`}></div>

                 <div className="flex items-center text-sm relative z-10">
                   <div className={`w-2 h-2 rounded-full border border-gray-400 bg-white ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></div>
                   <span className="font-medium text-gray-700">{p.origin.label}</span>
                </div>
                 <div className="flex items-center text-sm relative z-10">
                   <div className={`w-2 h-2 rounded-full border border-gray-400 bg-gray-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></div>
                   <span className="font-medium text-gray-700">{p.destination.label}</span>
                </div>
              </div>
              
              <div className={`mt-3 ${dir === 'rtl' ? 'pr-2' : 'pl-2'} flex items-center justify-between text-xs`}>
                 <span className="text-gray-400">Flex. dates</span>
                 <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">+ DZD2 tip possible</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Map */}
      <div className="flex-1 relative bg-gray-200 hidden md:block">
        <RealMap  
          initialViewState={{
            latitude: 36,
            longitude: 3,
            zoom: 5
          }}
        >
          {availableParcels.filter(p => p.origin && p.origin.lat != null && p.origin.lng != null).map(p => (
            <Marker key={p.id} longitude={p.origin.lng!} latitude={p.origin.lat!} anchor="bottom">
              <ParcelMarker parcel={p} onClick={setSelectedParcel} />
            </Marker>
          ))}
        </RealMap>
      </div>

      {/* Modal for details (Responsive) */}
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
                            <div className="font-black text-green-600 text-2xl">DZD{selectedParcel.price}</div>
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
                      zoom: 5
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

                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="text-xs text-gray-400 uppercase font-bold">{t('detour')}</span>
                       <p className="font-medium text-gray-900">+15 mins</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="text-xs text-gray-400 uppercase font-bold">{t('co2saved')}</span>
                       <p className="font-medium text-green-600">4.2 kg</p>
                    </div>
                 </div>

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
                   <Button variant="outline" className="px-4"><Navigation className="w-5 h-5"/></Button>
                 </div>
             </div>
         )}
      </Modal>
    </div>
  );
};
