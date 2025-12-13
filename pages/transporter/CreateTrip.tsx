import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { createTrip } from '../../services/data';
import { BackButton } from '../../components/ui/BackButton';
import { CitySearch } from '../../components/ui/CitySearch';

export const CreateTrip = ({ onClose, onTripCreated }) => {
  const { user, refreshData, role } = useApp();
  const { t } = useLanguage();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [capacity, setCapacity] = useState('M');
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting trip with the following data:');
    console.log({
      transporter_id: user.id,
      origin: { label: origin },
      destination: { label: destination },
      departure_date: departureDate,
      arrival_date: arrivalDate,
      capacity,
      price,
    });
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
      onClose();
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('Error: Could not create trip.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BackButton />
      <h2 className="text-2xl font-bold">{t('publishTrip')}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('origin')}</label>
        <CitySearch onSelect={setOrigin} placeholder={t('origin')} value={origin} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('destination')}</label>
        <CitySearch onSelect={setDestination} placeholder={t('destination')} value={destination} />
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
