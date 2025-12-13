import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';

interface StaticPageProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  pageId: string;
}

export const StaticPage: React.FC<StaticPageProps> = ({ title, subtitle, children, pageId }) => {
  const { t, dir } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-white" dir={dir}>
      {/* Header */}
      <div className="bg-[#1E1B4B] text-white py-20">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t(title)}</h1>
            <p className="text-xl text-primary-200">Coming Soon</p>
         </div>
      </div>

    </div>
  );
};