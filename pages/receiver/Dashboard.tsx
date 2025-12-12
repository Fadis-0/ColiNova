import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import RealMap from '../../components/ui/RealMap';
import { useLanguage } from '../../context/LanguageContext';
import { fetchParcelByTrackingCode } from '../../services/data';
import { Parcel, ParcelStatus } from '../../types';
import { BackButton } from '../../components/ui/BackButton';

export const ReceiverDashboard = () => {
  const { t, dir } = useLanguage();
  const [trackCode, setTrackCode] = useState('');
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!parcel || !parcel.origin.lat || !parcel.origin.lng || !parcel.destination.lat || !parcel.destination.lng) {
        setRoute(null);
        return;
      }
      const origin = `${parcel.origin.lng},${parcel.origin.lat}`;
      const destination = `${parcel.destination.lng},${parcel.destination.lat}`;
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
  }, [parcel]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCode) return;
    setIsLoading(true);
    setError(null);
    setParcel(null);
    try {
      const foundParcel = await fetchParcelByTrackingCode(trackCode);
      setParcel(foundParcel);
      if (!foundParcel) {
        setError(t('noParcelFound'));
      }
    } catch (err) {
      setError(t('errorFetchingParcel'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusIcon = (status: ParcelStatus) => {
    switch (status) {
      case ParcelStatus.DELIVERED: return <CheckCircle className="w-5 h-5"/>;
      case ParcelStatus.IN_TRANSIT:
      case ParcelStatus.PICKED_UP:
      case ParcelStatus.MATCHED:
        return <Clock className="w-5 h-5"/>;
      case ParcelStatus.PENDING:
      default:
        return <Package className="w-5 h-5"/>;
    }
  }
  
  const getStatusColor = (status: ParcelStatus) => {
     switch (status) {
      case ParcelStatus.DELIVERED: return 'bg-green-500';
      case ParcelStatus.IN_TRANSIT:
      case ParcelStatus.PICKED_UP: return 'bg-blue-500';
      case ParcelStatus.MATCHED: return 'bg-yellow-500';
      case ParcelStatus.PENDING:
      default:
        return 'bg-gray-300';
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" dir={dir}>
      <BackButton />
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">{t('trackDelivery')}</h1>
        <p className="text-gray-500 mt-2">{t('trackInstruction')}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="relative flex-1">
            <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-3.5 h-5 w-5 text-gray-400`} />
            <input 
              value={trackCode}
              onChange={e => setTrackCode(e.target.value)}
              placeholder="e.g. TRK-8821" 
              className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary outline-none text-lg`}
            />
          </div>
          <Button size="lg" type="submit" disabled={isLoading}>
            {isLoading ? t('tracking') : t('track')}
          </Button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl animate-in fade-in">
           <AlertCircle className="w-6 h-6"/>
           <p className="font-medium">{error}</p>
        </div>
      )}

      {parcel && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">{parcel.title}</h2>
                 <p className="text-sm text-gray-500">{t('from')} {parcel.origin.label} {t('to')} {parcel.destination.label}</p>
               </div>
               <span className={`px-3 py-1 ${getStatusColor(parcel.status)}/20 text-blue-800 rounded-full text-sm font-medium`}>{parcel.status}</span>
             </div>
             
             <div className="relative">
                <div className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-0 bottom-0 w-0.5 bg-gray-200`}></div>
                <div className="space-y-8 relative">
                   <div className={`flex gap-4 ${parcel.status !== ParcelStatus.PENDING ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-full ${getStatusColor(ParcelStatus.MATCHED)} flex items-center justify-center text-white z-10`}>{getStatusIcon(ParcelStatus.MATCHED)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{t('booked')}</p>
                      </div>
                   </div>
                   <div className={`flex gap-4 ${[ParcelStatus.PICKED_UP, ParcelStatus.IN_TRANSIT, ParcelStatus.DELIVERED].includes(parcel.status) ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-full ${getStatusColor(ParcelStatus.PICKED_UP)} flex items-center justify-center text-white z-10`}>{getStatusIcon(ParcelStatus.PICKED_UP)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{t('pickedUp')}</p>
                      </div>
                   </div>
                   <div className={`flex gap-4 ${[ParcelStatus.IN_TRANSIT, ParcelStatus.DELIVERED].includes(parcel.status) ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-full ${getStatusColor(ParcelStatus.IN_TRANSIT)} flex items-center justify-center text-white z-10`}>{getStatusIcon(ParcelStatus.IN_TRANSIT)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{t('onTheWay')}</p>
                      </div>
                   </div>
                   <div className={`flex gap-4 ${parcel.status === ParcelStatus.DELIVERED ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-full ${getStatusColor(ParcelStatus.DELIVERED)} flex items-center justify-center text-white z-10`}>{getStatusIcon(ParcelStatus.DELIVERED)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{t('delivered')}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold mb-4">{t('itemInfo')}</h3>
            <div className="flex gap-4 mb-4">
              {parcel.images?.map((img, index) => (
                <img key={index} src={img} alt="Parcel" className="w-24 h-24 rounded-lg object-cover" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">{t('size')}</p>
                <p className="font-medium">{parcel.size}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('weight')}</p>
                <p className="font-medium">{parcel.weight_kg} kg</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">{parcel.description}</p>
          </div>

          <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
             <RealMap
                markers={[
                  { ...parcel.origin, color: 'blue' },
                  { ...parcel.destination, color: 'red' }
                ]}
                route={route}
             />
          </div>
        </div>
      )}
    </div>
  );
};