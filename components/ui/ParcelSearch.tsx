import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './Button';
import { Search } from 'lucide-react';

export const ParcelSearch = ({ onSearch }) => {
  const { t, dir } = useLanguage();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchParams = {
      pickup: formData.get('pickup'),
      dropoff: formData.get('dropoff'),
      size: formData.get('size'),
      weight: formData.get('weight'),
      price: formData.get('price'),
    };
    onSearch(searchParams);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <form onSubmit={handleSearch}>
        <div className="relative ">
          <Search className={`absolute ${dir === 'rtl' ? 'left-8' : 'right-8'} top-5 h-6 w-6 text-gray-400`} />
          <input
            name="pickup"
            placeholder={t('pickupCity')}
            className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white border border-gray-300 rounded-full text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <input name="dropoff" placeholder={t('dropoffCity')} className="p-2 border rounded" />
          <input name="size" placeholder={t('size')} className="p-2 border rounded" />
          <input name="weight" type="number" placeholder={t('weight')} className="p-2 border rounded" />
          <input name="price" type="number" placeholder={t('price')} className="p-2 border rounded" />
        </div>
        <Button type="submit" className="w-full mt-4" size="lg">
          {t('search')}
        </Button>
      </form>
    </div>
  );
};