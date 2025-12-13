import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Bell, Lock, User, CreditCard, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { BackButton } from '../components/ui/BackButton';
import { Footer } from '../components/layout/Footer';

export const Settings = () => {
  const { logout } = useApp();
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState('account');

  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const renderContent = () => {
    switch(activeTab) {
      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('notifications')}</h2>
            <div className="space-y-4">
              {['New messages', 'Delivery updates', 'Promotional emails', 'SMS Alerts'].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
            <Button className="mt-4">{t('saveChanges')}</Button>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-bold text-gray-900 mb-4">{t('security')}</h2>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                   <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                   <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                   <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <Button variant="outline">Update Password</Button>
             </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('accountInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName')}</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastName')}</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
              </div>
            </div>
            <div className={`flex justify-${dir === 'rtl' ? 'start' : 'end'}`}>
              <Button>{t('saveChanges')}</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings')}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
             <nav className="space-y-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
               {[
                 { id: 'account', label: t('profile'), icon: User },
                 { id: 'notifications', label: t('notifications'), icon: Bell },
                 { id: 'security', label: t('security'), icon: Lock },
                 
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                     activeTab === item.id 
                       ? 'bg-primary/10 text-primary' 
                       : 'text-gray-600 hover:bg-gray-50'
                   }`}
                 >
                   <item.icon className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                   {item.label}
                   {activeTab === item.id && <Chevron className="ml-auto w-4 h-4" />}
                 </button>
               ))}
               <div className="pt-4 mt-4 border-t border-gray-100">
                 <button onClick={logout} className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                   <LogOut className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                   {t('logout')}
                 </button>
               </div>
             </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
             {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};