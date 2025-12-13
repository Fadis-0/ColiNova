import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './Button';
import { Search, RotateCcw } from 'lucide-react';
import { CitySearch } from './CitySearch';

export const ParcelSearch = ({ onSearch }) => {
  const { t, dir } = useLanguage();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [size, setSize] = useState('');
  const [weight, setWeight] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = {
      pickup,
      dropoff,
      size,
      weight: Number(weight),
    };
    onSearch(searchParams);
  };

  const handleReset = () => {
    setPickup('');
    setDropoff('');
    setSize('');
    setWeight('');
    onSearch({}); // Call onSearch with empty object to show all parcels
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-8">
      <form onSubmit={handleSearch}>
        <div className="relative mb-4">
          <CitySearch onSelect={setPickup} placeholder={t('pickupCity')} value={pickup} />
        </div>
        <div className="relative mb-4">
          <CitySearch onSelect={setDropoff} placeholder={t('dropoffCity')} value={dropoff} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <select name="size" className="bg-white p-2 border rounded" value={size} onChange={e => setSize(e.target.value)}>
            <option value="">{t('size')}</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
          <input name="weight" type="number" placeholder={t('weight')} className="p-2 border rounded" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div className="flex gap-4 mt-4">
          <Button type="submit" className="flex-1" size="lg">
            <Search className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('search')}
          </Button>
          <Button type="button" variant="outline" className="flex-1" size="lg" onClick={handleReset}>
            <RotateCcw className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('resetFilters')}
          </Button>
        </div>
      </form>
    </div>
  );
};
