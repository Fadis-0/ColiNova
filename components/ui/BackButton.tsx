import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const BackButton = () => {

  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowRight : ArrowLeft;
  


  const goBack = () => {
    window.history.back();
  };

  return (
    <Button variant="ghost" onClick={goBack} className="flex-row gap-1 mb-4 items-center">
      <Arrow className="h-5 w-5 mr-2 mt-0.5" />
      <p className="text-lg">{t('back')}</p>
    </Button>
  );
};
