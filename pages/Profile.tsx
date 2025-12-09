import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Star, ShieldCheck, Clock, MapPin, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';

export const Profile = () => {
  const { user, role } = useApp();
  const { t, dir } = useLanguage();

  return (
    <div className="bg-gray-50 min-h-screen py-10" dir={dir}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
           <div className="h-32 bg-gradient-to-r from-primary to-purple-800"></div>
           <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
                 <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} alt="Profile" className="w-full h-full object-cover"/>
                 </div>
                 <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                       {user?.name || 'Guest User'} 
                       <ShieldCheck className={`w-5 h-5 text-green-500 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                    </h1>
                    <p className="text-gray-500 font-medium">{role === 'GUEST' ? 'Not Logged In' : t(role.toLowerCase() as any)}</p>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">{t('settings')}</button>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-6 border-t border-gray-100 pt-6">
                 <div className="flex items-center text-gray-600">
                    <Star className={`w-5 h-5 text-yellow-400 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} fill="currentColor"/>
                    <span className={`font-bold text-gray-900 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`}>4.9</span>
                    <span className="text-gray-400">(24 reviews)</span>
                 </div>
                 <div className="flex items-center text-gray-600">
                    <Clock className={`w-5 h-5 text-gray-400 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}/>
                    <span>{t('memberSince')} Oct 2023</span>
                 </div>
                 <div className="flex items-center text-gray-600">
                    <MapPin className={`w-5 h-5 text-gray-400 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}/>
                    <span>Paris, France</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Verifications & About */}
           <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                 <h3 className="font-bold text-gray-900 mb-4">{t('verifications')}</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center text-gray-600"><ShieldCheck className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} text-green-500`}/> {t('idVerified')}</div>
                       <CheckCircle className="w-5 h-5 text-green-500"/>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center text-gray-600"><Phone className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} text-green-500`}/> {t('phoneVerified')}</div>
                       <CheckCircle className="w-5 h-5 text-green-500"/>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center text-gray-600"><Mail className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} text-green-500`}/> {t('emailVerified')}</div>
                       <CheckCircle className="w-5 h-5 text-green-500"/>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                 <h3 className="font-bold text-gray-900 mb-4">{t('aboutMe')}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                    Hi! I travel frequently between Paris and Lyon for work. I have a large trunk and I'm happy to help transport parcels to reduce my carbon footprint. Reliable and punctual.
                 </p>
              </div>
           </div>

           {/* Right Column: Reviews & Activity */}
           <div className="lg:col-span-2 space-y-8">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-6">{t('reviews')}</h3>
                  <div className="space-y-6">
                     {[1, 2, 3].map((r) => (
                        <div key={r} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                 <div>
                                    <p className="font-bold text-sm text-gray-900">Sophie M.</p>
                                    <p className="text-xs text-gray-400">Oct 24, 2023</p>
                                 </div>
                              </div>
                              <div className="flex text-yellow-400">
                                 {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill="currentColor"/>)}
                              </div>
                           </div>
                           <p className="text-gray-600 text-sm">Perfect delivery! Everything went smoothly, very communicative and the item arrived in perfect condition. Highly recommend!</p>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-6 py-2 text-primary font-bold text-sm hover:bg-gray-50 rounded-lg">Show all reviews</button>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};