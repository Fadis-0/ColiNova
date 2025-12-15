import React from 'react';
import { Package, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t, dir } = useLanguage();

  return (
    <footer className="bg-[#1E1B4B] text-white pt-20 pb-10 border-t border-white/10" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center mb-6">
                <div className={`bg-white/10 p-2 rounded-xl ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}>
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">Coli<span className="text-primary-400">Nova</span></span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed mb-8">
               {t('heroSubtitle')}
             </p>
             <div className="flex space-x-4">
                <a href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
             </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white text-lg mb-6">{t('howItWorks')}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('howItWorks')}</a></li>
              <li><a href="#login" className="hover:text-white transition-colors">{t('iamTraveler')}</a></li>
              <li><a href="#trust" className="hover:text-white transition-colors">{t('trustSafety')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-6">{t('help')}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#help" className="hover:text-white transition-colors">{t('helpCenter')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('security')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-6">Popular Routes</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex justify-between"><span>Guelma ➝ Annaba</span> <span className="text-primary-400">DZD350</span></a></li>
              <li><a href="#" className="hover:text-white transition-colors flex justify-between"><span>Skikda ➝ Setif</span> <span className="text-primary-400">DZD520</span></a></li>
              <li><a href="#" className="hover:text-white transition-colors flex justify-between"><span>Algiers ➝ Belida</span> <span className="text-primary-400">DZD280</span></a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
           <p>© 2025 ColiNova. {t('rights')}</p>
           <div className="flex items-center mt-4 md:mt-0 space-x-8">
              <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('terms')}</a>
           </div>
        </div>
        
      </div>
    </footer>
  );
};