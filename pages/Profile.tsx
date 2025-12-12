import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, Star, Package, CheckCircle, Clock } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { BackButton } from '../components/ui/BackButton';

export const Profile = () => {
  const { user } = useApp();
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <BackButton />
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <Avatar />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">{t('memberSince')} {new Date(user?.created_at).toLocaleDateString()}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <Star className="text-yellow-400 w-5 h-5 fill-current" />
              <span className="font-bold text-lg">4.9</span>
              <span className="text-gray-500">(23 reviews)</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Info & Contact */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t('contactInfo')}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{user?.phone}</span>
                </div>
              </div>
            </div>
             <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">{t('history')}</h2>
                <p className="text-gray-500 mb-4">{t('viewCompletedTrips')}</p>
                <Button onClick={() => window.location.hash = '#history'}>{t('viewHistory')}</Button>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">{t('statistics')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-900">12</p>
                    <p className="text-sm font-medium text-blue-700">{t('parcelsSent')}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-900">8</p>
                    <p className="text-sm font-medium text-green-700">{t('parcelsDelivered')}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full">
                    <Star className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-indigo-900">4.9</p>
                    <p className="text-sm font-medium text-indigo-700">{t('averageRating')}</p>
                  </div>
                </div>
                <div className="bg-pink-50 p-6 rounded-2xl flex items-center gap-4">
                   <div className="p-3 bg-white rounded-full">
                     <Clock className="w-6 h-6 text-pink-500" />
                   </div>
                   <div>
                     <p className="text-3xl font-bold text-pink-900">3 {t('days')}</p>
                     <p className="text-sm font-medium text-pink-700">{t('avgDeliveryTime')}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
