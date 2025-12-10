
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AuthWrapperProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ title, subtitle, children }) => {
  const { t } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      {showWelcome ? (
        <div className="text-center animate-in fade-in zoom-in-105">
          <h1 className="text-5xl font-bold text-gray-900">{t(title as any)}</h1>
          <p className="text-xl text-gray-500 mt-2">{t(subtitle as any)}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
