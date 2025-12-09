import { ParcelStatus } from '../../types';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import RealMap from '../../components/ui/RealMap';
import { Plus, Package, Clock, MapPin, ChevronRight, Settings, CreditCard, MessageSquare, LayoutDashboard, Search, ArrowRight, ArrowLeft, X, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const SenderDashboard = () => {
  const { parcels, user } = useApp();
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [route, setRoute] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const activeParcels = parcels.filter(p => p.status !== ParcelStatus.DELIVERED);

  const filteredParcels = activeParcels.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status.toLowerCase() === filterStatus;
  });


  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchRoute = async () => {
      if (!selectedParcel || !selectedParcel.origin.lat || !selectedParcel.origin.lng || !selectedParcel.destination.lat || !selectedParcel.destination.lng) {
        setRoute(null);
        return;
      }
      const origin = `${selectedParcel.origin.lng},${selectedParcel.origin.lat}`;
      const destination = `${selectedParcel.destination.lng},${selectedParcel.destination.lat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute({
            type: 'Feature',
            geometry: data.routes[0].geometry,
            properties: {}
          });
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [selectedParcel]);


  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col lg:flex-row" dir={dir}>
      {/* Sidebar 
      <aside className={`w-full lg:w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-[calc(100vh-80px)] ${dir === 'rtl' ? 'border-l border-r-0' : 'border-r'}`}>
         <div className="p-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Main Menu</h2>
            <nav className="space-y-1">
               <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <LayoutDashboard className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}/> {t('dashboard')}
               </button>
               <button onClick={() => setActiveTab('shipments')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'shipments' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Package className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}/> {t('activeShipments')}
               </button>
               <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  <MessageSquare className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}/> Messages <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">2</span>
               </button>
               <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  <CreditCard className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}/> Payments
               </button>
            </nav>
         </div>
         <div className="mt-auto p-6 border-t border-gray-100">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  <Settings className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}/> {t('settings')}
            </button>
         </div>
      </aside>
      */}

      {/* Main Content */}
      <div className={`flex-1 ${dir === 'rtl' ? 'lg:mr-0' : 'lg:ml-0'} p-4 lg:p-8`}>
        <div className="max-w-5xl mx-auto space-y-8">
           {/* Welcome & Quick Action Header */}
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-[#1E1B4B] to-primary rounded-3xl p-8 text-white shadow-xl">
              <div>
                 <h1 className="text-3xl font-bold mb-2">{t('welcomeBack')}, {user?.name.split(' ')[0]} 👋</h1>
                 <p className="text-white/80">{t('activeShipments')}: {activeParcels.length}</p>
              </div>
              <Button className="bg-pink-500 hover:bg-gray-100 shadow-lg border-0" onClick={() => window.location.hash = '#create-parcel'}>
                 <Plus className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} /> 
                 <span className="font-bold text-lg text-white" >{t('sendParcel')}</span>
              </Button>
           </div>

           {/* Quick Quote Widget (Mock) 
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
               <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('quickEstimate')}</label>
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                     <MapPin className={`w-4 h-4 text-gray-400 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}/>
                     <input placeholder={t('departure')} className="bg-transparent text-sm w-full outline-none"/>
                  </div>
               </div>
               <Arrow className="text-gray-300 hidden md:block mt-5"/>
               <div className="flex-1 w-full md:mt-5">
                   <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                     <MapPin className={`w-4 h-4 text-gray-400 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}/>
                     <input placeholder={t('arrival')} className="bg-transparent text-sm w-full outline-none"/>
                  </div>
               </div>
               <div className="md:mt-5">
                  <Button variant="outline">{t('getQuote')}</Button>
               </div>
           </div>*/}

           <div className="grid lg:grid-cols-4 gap-8 pt-6">
              {/* Active Shipments List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold text-gray-900">{t('recentActivity')}</h2>
                   <div className="flex gap-2 text-sm">
                      <button onClick={() => setFilterStatus('all')} className={`px-3 py-1 rounded-full ${filterStatus === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>{t('all')}</button>
                      <button onClick={() => setFilterStatus('pending')} className={`px-3 py-1 rounded-full ${filterStatus === 'pending' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>{t('pending')}</button>
                      <button onClick={() => setFilterStatus('delivered')} className={`px-3 py-1 rounded-full ${filterStatus === 'delivered' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>{t('delivered')}</button>
                   </div>
                </div>

                <div className="space-y-4">
                   {filteredParcels.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                         <Package className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
                         <h3 className="text-lg font-medium text-gray-900">{t('noShipments')}</h3>
                         <p className="text-gray-500 mb-6">{t('createRequest')}</p>
                         <Button variant="outline" onClick={() => window.location.hash = '#create-parcel'}>{t('createRequest')}</Button>
                      </div>
                   ) : (
                      filteredParcels.map(parcel => (
                        <div 
                           key={parcel.id} 
                           onClick={() => setSelectedParcel(parcel)}
                           className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                        >
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 rounded-xl bg-indigo-50 overflow-hidden flex items-center justify-center">
                                    <img className="w-full h-full object-cover" src={parcel?.images?.[0]} alt="parcel" />
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-gray-900">{parcel?.title}</h3>
                                    <p className="text-sm text-gray-500">{parcel?.tracking_code}</p>
                                 </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                 ${parcel?.status === ParcelStatus.PENDING ? 'bg-amber-100 text-amber-700' : ''}
                                 ${parcel?.status === ParcelStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-700' : ''}
                              `}>
                                 {t(parcel.status.toLowerCase())}
                              </span>
                           </div>
                           
                           <div className="flex items-center gap-2 mb-4">
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{width: parcel?.status === ParcelStatus.IN_TRANSIT ? '60%' : '10%'}}></div>
                              </div>
                           </div>

                           <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-6">
                                 <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase font-bold">{t('from')}</span>
                                    <span className="font-medium">{parcel?.origin.label}</span>
                                 </div>
                                 <Arrow className="w-4 h-4 text-gray-300"/>
                                 <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase font-bold">{t('to')}</span>
                                    <span className="font-medium">{parcel?.destination.label}</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <span className="block font-bold text-gray-900">DZD{parcel?.price}</span>
                              </div>
                           </div>
                        </div>
                      ))
                   )}
                </div>
              </div>
              
              {/* Sidebar Widgets */}
              <div className="lg:col-span-2  space-y-6">
                  {/* Tracking Widget */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hidden lg:block">
                     <h3 className="font-bold text-gray-900 mb-4">{t('liveMap')}</h3>
                     <div className="rounded-xl overflow-hidden h-96 relative">
                        <RealMap
                          initialViewState={{
                            latitude: 36,
                            longitude: 3,
                            zoom: 4
                          }}
                          markers={filteredParcels.map(p => {
                            const inTransit = p.status === ParcelStatus.IN_TRANSIT;
                            const lat = inTransit ? (p.origin.lat + p.destination.lat) / 2 : p.origin.lat;
                            const lng = inTransit ? (p.origin.lng + p.destination.lng) / 2 : p.origin.lng;
                            return {
                              lat,
                              lng,
                              color: inTransit ? 'green' : 'blue',
                              label: p.title
                            };
                          })}
                        />
                         <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium shadow-sm">
                            {filteredParcels.length} {t('activeOnMap')}
                         </div>
                     </div>
                  </div>

                  
              </div>
           </div>
        </div>
      </div>

      {/* Parcel Details Modal */}
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

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-500 uppercase">{t('pickup')}</p>
                     <p className="font-medium">{selectedParcel.origin.label}</p>
                     {/*<p className="text-xs text-gray-400">Before {new Date(selectedParcel.deliveryDate).toLocaleDateString()}</p>*/}
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-xs font-bold text-gray-500 uppercase">{t('dropoff')}</p>
                     <p className="font-medium">{selectedParcel.destination.label}</p>
                  </div>
               </div>

               <div className="h-48 rounded-xl overflow-hidden border border-gray-200">
                  <RealMap
                    initialViewState={{
                      latitude: (selectedParcel.origin.lat + selectedParcel.destination.lat) / 2,
                      longitude: (selectedParcel.origin.lng + selectedParcel.destination.lng) / 2,
                      zoom: 5
                    }}
                    markers={[
                      { ...selectedParcel.origin, color: 'blue' },
                      { ...selectedParcel.destination, color: 'red' }
                    ]}
                    route={route}
                  />
               </div>

               <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-bold text-gray-900 mb-2">{t('itemInfo')}</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                     <span className="bg-gray-100 px-2 py-1 rounded">{t('size')}: {selectedParcel.size}</span>
                     <span className="bg-gray-100 px-2 py-1 rounded">{t('weight')}: {selectedParcel.weight_kg}kg</span>
                     <span className="bg-gray-100 px-2 py-1 rounded">{t('value')}: DZD{selectedParcel.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{t('description')}: {selectedParcel.description}</p>
               </div>

               <div className="flex gap-3 pt-2">
                  <Button className="flex-1" variant="secondary">{t('trackLive')}</Button>
                  {/*<Button className="flex-1" variant="outline">Contact Support</Button>*/}
               </div>
            </div>
         )}
      </Modal>
    </div>
  );
};
