import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Package, Truck, ArrowRight, ArrowLeft, Home } from 'lucide-react';

export const Signup = () => {
  const { register } = useApp();
  const { t, dir } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SENDER);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const handleRegister = async () => {
    await register(`${formData.firstName} ${formData.lastName}`, formData.email, formData.password, selectedRole);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-black text-gray-900">{t('createAccount')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('joinCommunity')}</p>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
            <p className="text-center font-medium text-gray-900">{t('howUse')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedRole(UserRole.SENDER)}
                className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                  selectedRole === UserRole.SENDER 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selectedRole === UserRole.SENDER ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Package className="w-5 h-5"/>
                </div>
                <h3 className={`font-bold ${selectedRole === UserRole.SENDER ? 'text-primary' : 'text-gray-900'}`}>{t('sender')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('wantShip')}</p>
              </button>

              <button
                onClick={() => setSelectedRole(UserRole.TRANSPORTER)}
                className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                  selectedRole === UserRole.TRANSPORTER 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selectedRole === UserRole.TRANSPORTER ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Truck className="w-5 h-5"/>
                </div>
                <h3 className={`font-bold ${selectedRole === UserRole.TRANSPORTER ? 'text-primary' : 'text-gray-900'}`}>{t('transporter')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('wantEarn')}</p>
              </button>

              <button
                onClick={() => setSelectedRole(UserRole.RECEIVER)}
                className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                  selectedRole === UserRole.RECEIVER 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selectedRole === UserRole.RECEIVER ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Home className="w-5 h-5"/>
                </div>
                <h3 className={`font-bold ${selectedRole === UserRole.RECEIVER ? 'text-primary' : 'text-gray-900'}`}>{t('receiver')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('trackShipment')}</p>
              </button>
            </div>
            
            <Button size="lg" className="w-full" onClick={() => setStep(2)}>
              {t('next')} <Arrow className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}/>
            </Button>
          </div>
        ) : (
          <form className="space-y-5 animate-in fade-in slide-in-from-right-8" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName')}</label>
                <input 
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastName')}</label>
                <input 
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
              <input 
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start">
              <input id="terms" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1" required/>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                {t('agreeTerms')} <a href="#" className="text-primary hover:underline">{t('terms')}</a>.
              </label>
            </div>

            <div className="pt-2 flex gap-3">
               <Button type="button" variant="ghost" onClick={() => setStep(1)}>{t('back')}</Button>
               <Button type="submit" size="lg" className="flex-1">{t('createAccount')}</Button>
            </div>
          </form>
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {t('yesAccount')} <a href="#login" className="font-medium text-primary hover:text-primaryDark">{t('login')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};