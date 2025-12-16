
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BackButton } from '../../components/ui/BackButton';
import { CheckCircle, Clock, DollarSign } from 'lucide-react';

export const Payments = () => {
  const { t } = useLanguage();

  const mockPayments = [
    { id: '1', amount: 50, status: 'paid', date: '2023-10-26' },
    { id: '2', amount: 75, status: 'pending', date: '2023-10-28' },
    { id: '3', amount: 120, status: 'paid', date: '2023-10-25' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="mt-8 mb-6">
        <h1 className="text-3xl font-bold">{t('payments')}</h1>
        <p className="text-lg text-gray-600 mt-4">{t('paymentsSubtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {mockPayments.map(payment => (
            <li key={payment.id} className="p-6 flex justify-between items-center">
              <div className="flex items-center">
                <div className={`mr-4 ${payment.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {payment.status === 'paid' ? <CheckCircle size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <p className="font-bold text-lg">${payment.amount}</p>
                  <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" size={20} />
                <span className={`text-sm font-bold uppercase ${payment.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {t(payment.status)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
