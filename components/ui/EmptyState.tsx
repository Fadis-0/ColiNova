import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, action }) => {
  return (
    <div className="text-center bg-white rounded-3xl shadow-lg p-12">
      <div className="flex justify-center items-center text-gray-300 mx-auto mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{subtitle}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
