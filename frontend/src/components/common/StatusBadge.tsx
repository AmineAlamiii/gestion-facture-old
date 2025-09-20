import React from 'react';
import { InvoiceStatus } from '../../types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Payé' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' };
      case 'overdue':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'En retard' };
      case 'draft':
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon' };
      case 'sent':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Envoyé' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;