import React from 'react';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowLeft, Box, Truck, ShieldCheck, Leaf, Search, Star, DollarSign, Users, PiggyBank, Globe, Recycle } from 'lucide-react';
import RealMap from '../components/ui/RealMap';
import { Marker } from 'react-map-gl/maplibre';
import { ParcelMarker } from '../components/ui/ParcelMarker';

export const Landing = () => {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const fakeParcels = [
    { id: '1', origin: { lat: 36.7753, lng: 3.0603, label: 'Algiers' }, destination: { lat: 35.6975, lng: -0.6308, label: 'Oran' }, title: 'Parcel 1', price: 20 },
    { id: '2', origin: { lat: 36.7753, lng: 3.0603, label: 'Algiers' }, destination: { lat: 36.3573, lng: 6.6133, label: 'Constantine' }, title: 'Parcel 2', price: 30 },
    { id: '3', origin: { lat: 36.7753, lng: 3.0603, label: 'Algiers' }, destination: { lat: 36.8333, lng: 7.7667, label: 'Annaba' }, title: 'Parcel 3', price: 25 },
    { id: '4', origin: { lat: 35.6975, lng: -0.6308, label: 'Oran' }, destination: { lat: 36.3573, lng: 6.6133, label: 'Constantine' }, title: 'Parcel 4', price: 35 },
    { id: '5', origin: { lat: 35.6975, lng: -0.6308, label: 'Oran' }, destination: { lat: 36.8333, lng: 7.7667, label: 'Annaba' }, title: 'Parcel 5', price: 40 },
    { id: '6', origin: { lat: 36.3573, lng: 6.6133, label: 'Constantine' }, destination: { lat: 36.8333, lng: 7.7667, label: 'Annaba' }, title: 'Parcel 6', price: 15 },
    { id: '7', origin: { lat: 36.7753, lng: 3.0603, label: 'Algiers' }, destination: { lat: 35.2023, lng: -0.6312, label: 'Tlemcen' }, title: 'Parcel 7', price: 22 },
    { id: '8', origin: { lat: 36.7753, lng: 3.0603, label: 'Algiers' }, destination: { lat: 36.2667, lng: 5.2667, label: 'Bejaia' }, title: 'Parcel 8', price: 18 },
    { id: '9', origin: { lat: 35.6975, lng: -0.6308, label: 'Oran' }, destination: { lat: 35.2023, lng: -0.6312, label: 'Tlemcen' }, title: 'Parcel 9', price: 28 },
    { id: '10', origin: { lat: 36.3573, lng: 6.6133, label: 'Constantine' }, destination: { lat: 36.2667, lng: 5.2667, label: 'Bejaia' }, title: 'Parcel 10', price: 24 },
  ];

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      {/* Hero Section */}
      <section className="relative bg-[#1E1B4B] pt-12 pb-48 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className={`absolute top-0 ${dir === 'rtl' ? 'left-0 origin-top-left -skew-x-12' : 'right-0 origin-top-right skew-x-12'} w-2/3 h-full bg-gradient-to-b from-[#2e2a63] to-[#1E1B4B] opacity-50 pointer-events-none`}></div>
        <div className={`absolute -bottom-24 ${dir === 'rtl' ? '-right-24' : '-left-24'} w-96 h-96 bg-primary rounded-full blur-[100px] opacity-20 pointer-events-none`}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className={`flex-1 text-center ${dir === 'rtl' ? 'lg:text-right' : 'lg:text-left'} pt-10`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 shadow-lg">
                <span className={`w-2 h-2 rounded-full bg-green-400 animate-pulse ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}></span>
                <span className="">{t('heroBadge')}</span> 
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
                <div className="mb-6" >{t('heroTitle')}</div>
                <span className="text-pink-500 bg-clip-text bg-gradient-to-r from-primary-400 to-pink-500">{t('heroTitleHighlight')}</span>.
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {t('heroSubtitle')}
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                 <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.hash = '#create-parcel'}>
                   {t('sendParcel')} <Arrow className={`h-5 w-5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                 </Button>
                 <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => window.location.hash = '#dashboard'}>
                   {t('iamTraveler')} <Truck className={`h-5 w-5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                 </Button>
              </div>
            </div>

            {/* Hero Card / Search Box */}
            <div className="flex-1 w-full max-w-xl">
               <div className="bg-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">{t('joinCommunity')}</h3>
                  
                  <div className="space-y-4">
                     <p className="text-white/80">{t('joinCommunityDesc')}</p>
                     <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primaryDark shadow-lg shadow-primary/30 transition-all active:scale-[0.98]" onClick={() => window.location.hash = '#signup'}>
                       {t('signup')} <Arrow className={`h-5 w-5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                     </Button>
                  </div>
               </div>
            </div> 
          </div>
        </div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { icon: PiggyBank, label: t('economical'), desc: t('economicalDesc'), color: "text-amber-600", bg: "bg-amber-100" },
                  { icon: Globe, label: t('profitable'), desc: t('profitableDesc'), color: "text-blue-600", bg: "bg-blue-100" },
                  { icon: ShieldCheck, label: t('reliable'), desc: t('reliableDesc'), color: "text-slate-600", bg: "bg-gray-100" },
                  { icon: Recycle, label: t('sustainable'), desc: t('sustainableDesc'), color: "text-green-600", bg: "bg-green-100" }
               ].map((cat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group text-center">
                    <div className={`w-16 h-16 ${cat.bg} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <cat.icon className={`w-8 h-8 ${cat.color}`} />
                    </div>
                    <span className="font-bold text-lg text-gray-900 mb-1">{cat.label}</span>
                    <span className="text-xs text-gray-500">{cat.desc}</span>
                </div>
               ))}
            </div>
         </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-5xl font-black tracking-tight text-gray-900 ">
              <span className="font-inter ">ColiNova</span>
            </span> 
            <p className="text-lg text-gray-600 mt-4">{t('heroSubtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                 icon: DollarSign, 
                 title: t('priceTitle'), 
                 desc: t('priceDesc'),
                 color: "text-amber-500",
                 bg: "bg-amber-100"
              },
              { 
                 icon: Leaf, 
                 title: t('ecoTitle'), 
                 desc: t('ecoDesc'),
                 color: "text-green-500",
                 bg: "bg-green-100"
              },
              { 
                 icon: ShieldCheck, 
                 title: t('secureTitle'), 
                 desc: t('secureDesc'),
                 color: "text-blue-500",
                 bg: "bg-blue-100"
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`w-24 h-24 ${step.bg} rounded-[2rem] flex items-center justify-center ${step.color} mb-6 transform rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-sm`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Routes CTA */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{t('liveMap')}</h2>
              <p className="text-lg text-gray-600">{t('heroSubtitle')}</p>
            </div>
            <div className="flex-1 w-full relative">
                <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <RealMap>
                    {fakeParcels.map(p => (
                      <Marker key={p.id} longitude={p.origin.lng!} latitude={p.origin.lat!} anchor="bottom">
                        <ParcelMarker parcel={p} onClick={() => {}} />
                      </Marker>
                    ))}
                  </RealMap>
                </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};