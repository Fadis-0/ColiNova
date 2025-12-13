import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { SenderDashboard } from './pages/sender/Dashboard';
import { CreateParcel } from './pages/sender/CreateParcel';
import { AvailableTrips } from './pages/sender/AvailableTrips';
import { History } from './pages/History';
import { TransporterDashboard } from './pages/transporter/Dashboard';
import { ReceiverDashboard } from './pages/receiver/Dashboard';
import { UserRole } from './types';
import { StaticPage } from './pages/StaticPage';
import { FindDelivery } from './pages/transporter/FindDelivery';
import { MyTrips } from './pages/transporter/MyTrips';
import { AcceptedParcels } from './pages/transporter/AcceptedParcels';

const MainRouter = () => {
  const { role, isLoading } = useApp();
  const { t } = useLanguage();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0); // Reset scroll on route change
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Redirect logic
    if (role !== UserRole.GUEST && ['#', '', '#login', '#signup'].includes(hash)) {
      window.location.hash = '#dashboard';
    }
  }, [role, hash]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
      );
    }
    // Static Pages - Accessible to everyone
    if (hash === '#how-it-works') return (
       <StaticPage title={t('howItWorks')} subtitle="Shipping made simple, social, and sustainable." pageId="howItWorks" />
    );
    if (hash === '#trust') return (
       <StaticPage title={t('trustSafety')} subtitle="Your peace of mind is our top priority." pageId="trustSafety" />
    );
    if (hash === '#help') return <StaticPage title={t('helpCenter')} subtitle="We're here to help you." pageId="helpCenter" />;

    // Auth Routes
    if (hash === '#login') return <Login />;
    if (hash === '#signup') return <Signup />;

    // Public Dashboard Access (Receiver Tracking)
    if (hash === '#receiver') return <ReceiverDashboard />;

    // Home
    if (hash === '' || hash === '#') return <Landing />;

    // Protected Routes Check
    if (role === UserRole.GUEST) {
      // If trying to access protected pages while logged out, redirect to login
      if (['#dashboard', '#profile', '#settings', '#create-parcel', '#find-delivery', '#my-trips'].includes(hash)) {
         window.location.hash = '#login';
         return <Login />;
      }
      return <Landing />;
    }

    // Authenticated Routes
    if (hash === '#profile') return <Profile />;
    if (hash === '#settings') return <Settings />;
    if (hash === '#history') return <History />;

    if (role === UserRole.SENDER) {
      if (hash === '#dashboard') return <SenderDashboard />;
      if (hash === '#create-parcel') return <CreateParcel />;
      if (hash === '#available-trips') return <AvailableTrips />;
    }

    if (role === UserRole.TRANSPORTER) {
      if (hash === '#dashboard') return <TransporterDashboard />;
      if (hash === '#find-delivery') return <FindDelivery />;
      if (hash === '#my-trips') return <MyTrips />;
      if (hash === '#accepted-parcels') return <AcceptedParcels />;
    }

    if (role === UserRole.RECEIVER) {
      if (hash === '#dashboard') return <ReceiverDashboard />;
    }

    // 404 Fallback
    return (
       <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Page not found.</p>
          <a href="#" className="text-primary font-bold hover:underline">Return Home</a>
       </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AppProvider>
          <Navbar />
          <MainRouter />
        </AppProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;