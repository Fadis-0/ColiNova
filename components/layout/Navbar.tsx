import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import { Package, LogOut, Bell, Menu, X, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, role, logout } = useApp();
  const { t, setLanguage, language, dir } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLangChange = (lang: 'en' | 'fr' | 'ar') => {
     setLanguage(lang);
     setIsLangMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => { window.location.hash = '#'; setIsMobileMenuOpen(false); }}>
            <div className={`bg-primary/10 p-2 rounded-xl ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}>
               <Package className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              <span className="font-inter ">ColiNova</span>
            </span> 
            {role !== UserRole.GUEST && (
              <span className={`mx-3 px-2.5 py-0.5 rounded-full bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide border border-gray-200 hidden sm:inline-block`}>
                {t(role.toLowerCase() as any)}
              </span>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 md:gap-6">
            
            {/* Language Switcher */}
            <div className="relative">
               <button 
                 onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                 className="flex items-center text-gray-500 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
               >
                 <Globe className="w-5 h-5" />
                 <span className="mx-1 text-sm font-bold uppercase">{language}</span>
               </button>
               {isLangMenuOpen && (
                 <div className={`absolute top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                    <button onClick={() => handleLangChange('ar')} className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">العربية</button>
                    <button onClick={() => handleLangChange('en')} className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">English</button>
                    <button onClick={() => handleLangChange('fr')} className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">Français</button>
                 </div>
               )}
            </div>

            {role === UserRole.GUEST ? (
              <>
                 <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <a href="#how-it-works" className="hover:text-primary transition-colors">{t('howItWorks')}</a>
                    <a href="#trust" className="hover:text-primary transition-colors">{t('trustSafety')}</a>
                    <a href="#help" className="hover:text-primary transition-colors">{t('help')}</a>
                 </div>
                 <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                 <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => window.location.hash = '#login'}>{t('login')}</Button>
                  <Button onClick={() => window.location.hash = '#signup'} className="shadow-lg shadow-primary/20">{t('signup')}</Button>
                </div>
              </>
            ) : (
              <>
                <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <Button variant="ghost" size="sm" onClick={() => window.location.hash = '#settings'} className="text-gray-400 hover:text-gray-600">
                   {t('settings')}
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-red-500">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => handleLangChange(language === 'ar' ? 'en' : 'ar')} className="p-2 text-gray-600 font-bold">
               {language.toUpperCase()}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#1E1B4B] border-b border-gray-800 shadow-xl animate-in slide-in-from-top-2 z-40">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {role === UserRole.GUEST ? (
              <>
                <a href="#how-it-works" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">{t('howItWorks')}</a>
                <a href="#trust" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">{t('trustSafety')}</a>
                <a href="#help" onClick={toggleMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">{t('help')}</a>
                <div className="pt-4 border-t border-gray-700 mt-4 flex flex-col gap-3">
                  <Button variant="outline" className="w-full justify-center text-white border-gray-600 hover:bg-white/10 hover:text-white" onClick={() => { window.location.hash = '#login'; toggleMobileMenu(); }}>{t('login')}</Button>
                  <Button className="w-full justify-center bg-primary hover:bg-primaryDark border-0 text-white" onClick={() => { window.location.hash = '#signup'; toggleMobileMenu(); }}>{t('signup')}</Button>
                </div>
              </>
            ) : (
              <>
                 <div className="flex items-center px-3 py-3 mb-4 border-b border-gray-700" onClick={() => { window.location.hash = '#profile'; toggleMobileMenu(); }}>
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3 overflow-hidden">
                      {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover"/> : user?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-base font-medium text-white">{user?.name}</div>
                      <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                    </div>
                 </div>
                 <a href="#dashboard" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">{t('dashboard')}</a>
                 <a href="#profile" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">{t('profile')}</a>
                 <a href="#settings" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">{t('settings')}</a>
                 <button onClick={() => { logout(); toggleMobileMenu(); }} className="w-full text-right block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/10">
                    {t('logout')}
                 </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};