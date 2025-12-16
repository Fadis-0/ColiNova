import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { ArrowRight, ArrowLeft, CreditCard, DollarSign, University } from 'lucide-react';
import { UserRole } from '../types';
import { Modal } from '../components/ui/Modal';
import { useNotification } from '../context/NotificationContext';

export const Wallet = () => {
  const { user } = useApp();
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const [isCcpModalOpen, setIsCcpModalOpen] = useState(false);
  const [isBaridiMobModalOpen, setIsBaridiMobModalOpen] = useState(false);
  const [isDebitCardModalOpen, setIsDebitCardModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const { addNotification } = useNotification();

  const handleFakeConfirmation = () => {
    addNotification(t('paymentSuccess'), 'success');
    setIsCcpModalOpen(false);
    setIsBaridiMobModalOpen(false);
    setIsDebitCardModalOpen(false);
  };

  const handleWithdraw = () => {
    addNotification(t('withdrawSuccess'), 'success');
    setIsWithdrawModalOpen(false);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8" dir={dir}>
      <div className="max-w-3xl mx-auto">
        <div className="mt-16 text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('wallet')}</h1>
          <p className="text-xl text-gray-600">{t('walletSubtitle')}</p>
        </div>
      <div className="grid grid-cols-1 gap-8">
        

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Refill Section */}
          {user?.role === UserRole.RECEIVER && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <p className="mx-auto text-center text-lg text-gray-500 mb-2">{t('currentBalance')}</p>
              <h2 className="mb-16 text-5xl text-center font-bold text-primary">
                {user?.wallet_balance || 0} {t('points')}
              </h2>
              <h3 className="text-2xl font-bold px-16 text-gray-900 mb-6">{t('refillWallet')}</h3>
              <div className="space-y-4 px-16 mb-8">
                <Button onClick={() => setIsDebitCardModalOpen(true)} className="w-full justify-between" size="lg">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-white" />
                    <span>{t('debitCard')}</span>
                  </div>
                  <Arrow className="w-5 h-5" />
                </Button>
                <Button onClick={() => setIsCcpModalOpen(true)} className="w-full justify-between" size="lg">
                  <div className="flex items-center gap-4">
                    <University className="w-6 h-6 text-white" />
                    <span>{t('ccp')}</span>
                  </div>
                  <Arrow className="w-5 h-5" />
                </Button>
                <Button onClick={() => setIsBaridiMobModalOpen(true)} className="w-full justify-between" size="lg">
                  <div className="flex items-center gap-4">
                    <DollarSign className="w-6 h-6 text-white" />
                    <span>{t('baridiMob')}</span>
                  </div>
                  <Arrow className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Withdrawal Section (for Transporters) */}
          {user?.role === UserRole.TRANSPORTER && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <p className="mx-auto text-center text-lg text-gray-500 mb-2">{t('currentBalance')}</p>
              <h2 className="mb-16 text-5xl text-center font-bold text-primary">
                {user?.wallet_balance || 0} {t('points')}
              </h2>
              <h3 className="text-2xl px-16 font-bold text-gray-900 mb-6">{t('withdrawPoints')}</h3>
              <div className="space-y-4 px-16">
                <p className="text-gray-600">{t('withdrawSubtitle')}</p>
                <Button onClick={() => setIsWithdrawModalOpen(true)} className="w-full" size="lg" variant="primary">
                  {t('withdraw')}
                </Button>
              </div>
              <div className="mt-16">
                <h3 className="text-2xl px-16 font-bold text-gray-900 mb-6">طرق الدفع</h3>

                <div className="space-y-4 px-16 mb-8">
                  <Button onClick={() => setIsDebitCardModalOpen(true)} className="w-full justify-between" size="lg">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-white" />
                      <span>{t('debitCard')}</span>
                    </div>
                    <Arrow className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => setIsCcpModalOpen(true)} className="w-full justify-between" size="lg">
                    <div className="flex items-center gap-4">
                      <University className="w-6 h-6 text-white" />
                      <span>{t('ccp')}</span>
                    </div>
                    <Arrow className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => setIsBaridiMobModalOpen(true)} className="w-full justify-between" size="lg">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-6 h-6 text-white" />
                      <span>{t('baridiMob')}</span>
                    </div>
                    <Arrow className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* CCP Modal */}
      <Modal isOpen={isCcpModalOpen} onClose={() => setIsCcpModalOpen(false)} title={t('ccpPayment')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="ccp-amount" className="block text-sm font-medium text-gray-700">{t('amount')} (DZD)</label>
            <input type="number" id="ccp-amount" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" onChange={(e) => setAmount(parseInt(e.target.value))} />
          </div>
          <div>
            <label htmlFor="ccp-name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
            <input type="text" id="ccp-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="ccp-number" className="block text-sm font-medium text-gray-700">{t('ccpNumber')}</label>
            <input type="text" id="ccp-number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <Button onClick={handleFakeConfirmation} className="w-full" size="lg">{t('confirmPayment')}</Button>
        </div>
      </Modal>

      {/* BaridiMob Modal */}
      <Modal isOpen={isBaridiMobModalOpen} onClose={() => setIsBaridiMobModalOpen(false)} title={t('baridiMobPayment')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="baridi-amount" className="block text-sm font-medium text-gray-700">{t('amount')} (DZD)</label>
            <input type="number" id="baridi-amount" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" onChange={(e) => setAmount(parseInt(e.target.value))} />
          </div>
          <div>
            <label htmlFor="baridi-phone" className="block text-sm font-medium text-gray-700">{t('phoneNumber')}</label>
            <input type="text" id="baridi-phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <Button onClick={handleFakeConfirmation} className="w-full" size="lg">{t('confirmPayment')}</Button>
        </div>
      </Modal>

      {/* Debit Card Modal */}
      <Modal isOpen={isDebitCardModalOpen} onClose={() => setIsDebitCardModalOpen(false)} title={t('debitCardPayment')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="card-amount" className="block text-sm font-medium text-gray-700">{t('amount')} (DZD)</label>
            <input type="number" id="card-amount" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" onChange={(e) => setAmount(parseInt(e.target.value))} />
          </div>
          <div>
            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">{t('cardNumber')}</label>
            <input type="text" id="card-number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">{t('expiryDate')}</label>
              <input type="text" id="expiry-date" placeholder="MM/YY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">{t('cvc')}</label>
              <input type="text" id="cvc" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>
          <Button onClick={handleFakeConfirmation} className="w-full" size="lg">{t('confirmPayment')}</Button>
        </div>
      </Modal>
      
      {/* Withdraw Modal */}
      <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} title={t('withdrawPoints')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700">{t('amount')} ({t('points')})</label>
            <input type="number" id="withdraw-amount" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" onChange={(e) => setWithdrawAmount(parseInt(e.target.value))} />
          </div>
          <div className="text-center text-gray-500">
            {t('equivalentTo')} {withdrawAmount * 10} DZD
          </div>
          <Button onClick={handleWithdraw} className="w-full" size="lg">{t('withdraw')}</Button>
        </div>
      </Modal>
    </div>
  );
};
