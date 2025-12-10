import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Package, Truck, UserCheck } from 'lucide-react';
import WelcomeMessage from '../components/ui/WelcomeMessage';

export const Login = () => {
  const { login } = useApp();
  const { t, dir } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SENDER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const handleLogin = async () => {
    await login(email, password, selectedRole);
  };

  const handleFadeOut = () => {
    setShowWelcome(false);
    setShowForm(true);
  };

  return (
    <>
      {showWelcome && <WelcomeMessage onFadeOut={handleFadeOut} title="welcomeLoginTitle" subtitle="welcomeLoginSubtitle" />}
      {showForm && (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-purple-100 px-4" dir={dir}>
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{t('welcomeLoginTitle')}</h2>
              <p className="text-gray-500 mt-2">{t('chooseRole')}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { id: UserRole.SENDER, label: t('sender'), icon: Package },
                { id: UserRole.TRANSPORTER, label: t('transporter'), icon: Truck },
                { id: UserRole.RECEIVER, label: t('receiver'), icon: UserCheck },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <role.icon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  placeholder="example@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <input
                  type="password"
                  value={password}
                  placeholder="password1234"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {t('signInAs')} {t(selectedRole.toLowerCase() as any)}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {t('noAccount')} <a href="#signup" className="text-primary font-semibold hover:underline">{t('createAccount')}</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};