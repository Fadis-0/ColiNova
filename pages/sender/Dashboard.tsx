import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft, Search, Truck, Package, DollarSign, Plus } from 'lucide-react';
import { BackButton } from '../../components/ui/BackButton';

export const SenderDashboard = () => {
  const { user } = useApp();
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8" dir={dir}>
      <div className="max-w-6xl mx-auto">
       
        <div className="mt-16 text-center mb-12">
          <p className="text-xl text-gray-600 mb-6">{t('welcomeLoginTitle')}, {user?.name.split(' ')[0]}!</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('senderDashboardSubtitle')}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <a href="#create-parcel" className="group block p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-6">
              <Plus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('sendParcel')}</h2>
            <p className="text-gray-600 mb-6">{t('sendParcelSubtitle')}</p>
            <div className="flex items-center text-blue-600 font-semibold">
              <span>{t('sendParcel')}</span>
              <Arrow className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
          
          <a href="#my-parcels" className="group block p-8  bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-16 w-16 bg-yellow-100 text-yellow-600 rounded-full mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('myParcels')}</h2>
            <p className="text-gray-600 mb-6">{t('myParcelsSubtitle')}</p>
            <div className="flex items-center text-yellow-600 font-semibold">
              <span>{t('myParcels')}</span>
              <Arrow className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          <a href="#available-trips" className="group block p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-600 rounded-full mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('availableTravelers')}</h2>
            <p className="text-gray-600 mb-6">{t('availableTripsSubtitle')}</p>
            <div className="flex items-center text-green-600 font-semibold">
              <span>{t('availableTravelers')}</span>
              <Arrow className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};