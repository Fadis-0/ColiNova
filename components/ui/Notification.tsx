import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  id: number;
  message: string;
  type: NotificationType;
  onDismiss: (id: number) => void;
}

const icons = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <AlertTriangle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export const Notification: React.FC<NotificationProps> = ({ id, message, type, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(id), 500);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 500);
  };

  return (
    <div
      className={`relative rounded-md shadow-lg p-4 text-white flex items-center gap-4 transition-all duration-500 ${colors[type]} ${
        exiting ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-grow font-medium">{message}</p>
      <button onClick={handleDismiss} className="flex-shrink-0">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
