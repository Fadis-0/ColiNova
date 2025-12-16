
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import RealMap from '../../components/ui/RealMap';
import { uploadParcelImage, fetchTrips } from '../../services/data';
import { Coordinates, Trip } from '../../types';
import { MapboxglGeocodingEvent } from '@maplibre/maplibre-gl-geocoder/dist/types';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ArrowRight, X, Loader2, Camera, Check, Search } from 'lucide-react';
import { BackButton } from '../../components/ui/BackButton';
import { useNotification } from '../../context/NotificationContext';
import { TripCard } from '../../components/ui/TripCard';
import { EmptyState } from '../../components/ui/EmptyState';

export const CreateParcel = () => {
  const { addParcel } = useApp();
  const { t, dir } = useLanguage();
  const { addNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [route, setRoute] = useState(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parcel_content: '',
    weight_kg: '',
    receiver_name: 'receiverName',
    origin: { lat: null, lng: null, label: null } as Coordinates,
    destination: { lat: null, lng: null, label: null } as Coordinates,
    images: [] as string[],
    instructions: '',
    receiver_phone_number: '',
    size: 'M',
    delivery_date: '',
    transporter_id: null,
    selected_trip_id: null
  });

  const [minRating, setMinRating] = useState(0);
  const [minSuccessRate, setMinSuccessRate] = useState(0);

  useEffect(() => {
    fetchTrips().then(setTrips);
  }, []);

  const ArrowNext = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const ArrowBack = dir === 'rtl' ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const fetchRoute = async () => {
      const origin = `${formData.origin.lng},${formData.origin.lat}`;
      const destination = `${formData.destination.lng},${formData.destination.lat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry);
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    if (formData.origin.lat && formData.origin.lng && formData.destination.lat && formData.destination.lng) {
      fetchRoute();
    } else {
      setRoute(null); // Clear route if coordinates are not set
    }
  }, [formData.origin, formData.destination]);


  const handleNext = () => {
    if (step === 4 && formData.images.length === 0) {
      addNotification(t('uploadProofOfCondition'), 'warning');
      return;
    }
    setStep(s => s + 1)
  };
  const handleBack = () => setStep(s => s - 1);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      try {
        const files = Array.from(e.target.files);
        const newImageUrls = await Promise.all(
          files.map(file => uploadParcelImage(file))
        );
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
      } catch (error) {
        console.error("Failed to upload images", error);
        addNotification(t('errorUploadingImage'), 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    // Note: This doesn't delete the image from Supabase Storage. 
    // A more robust implementation would require a backend function to do so.
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const [locationSelectionMode, setLocationSelectionMode] = useState<'origin' | 'destination' | null>(null);

  const handleModeToggle = (mode: 'origin' | 'destination') => {
    setLocationSelectionMode(prev => prev === mode ? null : mode);
  };

  const handleLocationSelect = async (coords: { lat: number; lng: number }) => {
    // Optimistically update the pin location
    setFormData(prev => ({
      ...prev,
      [locationSelectionMode!]: { ...coords, label: 'Loading...' }
    }));

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    const url = `https://api.maptiler.com/geocoding/${coords.lng},${coords.lat}.json?key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const placeName = data.features[0].place_name;
        setFormData(prev => ({
          ...prev,
          [locationSelectionMode!]: { ...coords, label: placeName }
        }));
      }
    } catch (error) {
      console.error("Failed to fetch reverse geocoding:", error);
      // Revert label if fetch fails
      setFormData(prev => ({
        ...prev,
        [locationSelectionMode!]: { ...coords, label: 'Unknown Location' }
      }));
    }
  };

  const handleGeocodeResult = (e: MapboxglGeocodingEvent) => {
    const { result } = e;
    const location = {
      lat: result.center[1],
      lng: result.center[0],
      label: result.text,
    };
    setFormData(prev => ({
      ...prev,
      [locationSelectionMode]: location
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // --- Form Validation ---
    if (!formData.title || !formData.weight_kg || !formData.delivery_date || !formData.size || !formData.parcel_content) {
      addNotification(t('errorFillAllDetails'), 'warning');
      return;
    }
    if (!formData.origin.lat || !formData.destination.lat) {
      addNotification(t('errorSetOriginDestination'), 'warning');
      return;
    }
    // --- End Validation ---

    setIsSubmitting(true);
    try {
      await addParcel({
        ...formData,
        weight_kg: Number(formData.weight_kg),
        origin: { ...formData.origin, label: formData.origin.label || 'Custom Origin' },
        destination: { ...formData.destination, label: formData.destination.label || 'Custom Dest' },
      });
      addNotification(t('parcelCreatedSuccess'), 'success');
      window.location.hash = '#dashboard';
    } catch (error: any) {
      addNotification(t('errorCreatingParcelWithMessage', { message: error.message }), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12" dir={dir}>
      <BackButton />
      <div className="mb-8">
         <div className="flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
           
           <span>{t('stepDetails')}</span>
           <span>{t('stepRoute')}</span>
           <span>{t('stepAssignTrip')}</span>
           <span>{t('parcelPhotos')}</span>
           <span>{t('stepReview')}</span>
         </div>
         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
           <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {step === 1 && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('whatSending')}</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('itemTitle')}</label>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="e.g. Box of clothes"
                  required
                />
              </div>
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('parcelContent')}</label>
              <textarea 
                value={formData.parcel_content}
                onChange={e => setFormData({...formData, parcel_content: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('receiverPhoneNumber')}</label>
                    <input 
                    type="tel"
                    value={formData.receiver_phone_number}
                    onChange={e => setFormData({...formData, receiver_phone_number: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('deliveryDate')}</label>
                    <input 
                    type="date"
                    value={formData.delivery_date}
                    onChange={e => setFormData({...formData, delivery_date: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('specialInstructions')}</label>
                <textarea 
                    value={formData.instructions}
                    onChange={e => setFormData({...formData, instructions: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('weight')} (kg)</label>
                <input 
                  type="number"
                  value={formData.weight_kg}
                  onChange={e => setFormData({...formData, weight_kg: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('size')}</label>
                <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map(size => (
                        <Button
                            key={size}
                            variant={formData.size === size ? 'primary' : 'outline'}
                            onClick={() => setFormData({...formData, size})}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 space-y-6">
             <h2 className="text-2xl font-bold text-gray-900">{t('whereGoing')}</h2>
             <p className="text-gray-600">{t('searchOrigin')}</p>
             <div className="flex justify-center gap-4 my-2">
                <Button variant={locationSelectionMode === 'origin' ? 'primary' : 'outline'} onClick={() => handleModeToggle('origin')}>{t('setOrigin')}</Button>
                <Button variant={locationSelectionMode === 'destination' ? 'primary' : 'outline'} onClick={() => handleModeToggle('destination')}>{t('setDestination')}</Button>
             </div>
             <div className="h-96 bg-gray-100 rounded-lg relative">
               <RealMap
                 markers={[
                   { ...formData.origin, color: 'blue' },
                   { ...formData.destination, color: 'red' }
                 ]}
                 onLocationSelect={handleLocationSelect}
                 onGeocodeResult={handleGeocodeResult}
                 route={route}
                 locationSelectionMode={locationSelectionMode}
               />
               {locationSelectionMode && (
                <p className="text-xs text-gray-500 mt-2 text-center">Now setting {locationSelectionMode} location</p>
               )}
             </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('origin')}</label>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-default" 
                    value={formData.origin.label || t('notSet')}
                    placeholder={t('origin')}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('destination')}</label>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-default" 
                    value={formData.destination.label || t('notSet')}
                    placeholder={t('destination')}
                    readOnly
                  />
                </div>
              </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('stepAssignTrip')}</h2>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{t('minRating')}: {minRating}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{t('minSuccessRate')}: {minSuccessRate}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={minSuccessRate}
                  onChange={(e) => setMinSuccessRate(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {trips.filter(trip => {
                const rating = trip.rating || 0;
                const successRate = trip.success_rate || 0;
                return rating >= minRating && successRate >= minSuccessRate;
              }).length > 0 ? (
                trips
                  .filter(trip => {
                    const rating = trip.rating || 0;
                    const successRate = trip.success_rate || 0;
                    return rating >= minRating && successRate >= minSuccessRate;
                  })
                  .map(trip => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onSelect={(tripId, transporterId) => setFormData(prev => ({ ...prev, selected_trip_id: tripId, transporter_id: transporterId }))}
                      isSelected={formData.selected_trip_id === trip.id}
                      rating={trip.rating}
                      successRate={trip.success_rate}
                    />
                  ))
              ) : (
                <EmptyState
                  icon={<Search className="w-16 h-16" />}
                  title={t('noAvailableTrips')}
                  subtitle={t('noAvailableTripsSubtitle')}
                />
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('parcelPhotos')}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('parcelPhotos')}</label>
              <div className="flex flex-wrap gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                    <img src={img} alt="Parcel preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all ${isUploading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-primary hover:bg-primary/5 text-gray-400 hover:text-primary'}`}>
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase">{t('addPhoto')}</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('reviewRequest')}</h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              
              {/* Image Preview in Review */}
              {formData.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {formData.images.map((img, i) => (
                    <img key={i} src={img} alt="Parcel" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  ))}
                </div>
              )}

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">{t('item')}</span>
                <span className="font-medium">{formData.title}</span>
              </div>
               <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">{t('route')}</span>
                <span className="font-medium">{formData.origin.label || 'A'} → {formData.destination.label || 'B'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200">
           {step > 1 ? (
             <Button variant="ghost" onClick={handleBack}><ArrowBack className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}/> {t('back')}</Button>
           ) : <div />}
           
           {step === 3 && (
              <Button variant="ghost" onClick={handleNext}>{t('skip')}</Button>
           )}

           {step < 5 ? (
             <Button onClick={handleNext}>{t('next')} <ArrowNext className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}/></Button>
           ) : (
             <Button onClick={handleSubmit} loading={isSubmitting} className="bg-green-600 hover:bg-green-700">{t('postRequest')} <Check className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}/></Button>
           )}
        </div>
      </div>
    </div>
  );
};
