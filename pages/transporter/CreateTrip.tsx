import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { createTrip } from '../../services/data';
import { BackButton } from '../../components/ui/BackButton';
import { CitySearch } from '../../components/ui/CitySearch';
import { useNotification } from '../../context/NotificationContext';

export const CreateTrip = ({ onClose, onTripCreated }) => {
  const { user, refreshData, role } = useApp();
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [capacity, setCapacity] = useState('M');
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await createTrip({
        transporter_id: user.id,
        origin: { label: origin },
        destination: { label: destination },
        departure_date: departureDate,
        arrival_date: arrivalDate,
        capacity,
        price,
      });
      await onTripCreated();
      addNotification(t('tripCreated'), 'success');
      onClose();
    } catch (error) {
      console.error('Failed to create trip:', error);
      addNotification(t('errorCreatingTrip'), 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  
      
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('originTrip')}</label>
        <CitySearch onSelect={setOrigin} placeholder={t('originTrip')} value={origin} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('destinationTrip')}</label>
        <CitySearch onSelect={setDestination} placeholder={t('destinationTrip')} value={destination} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('departureDate')}</label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('arrivalDate')}</label>
        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('capacity')}</label>
        <select
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        >
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
          <option value="XL">Extra Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('price')}</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        {t('publishTrip')}
      </Button>
    </form>
  );
};
