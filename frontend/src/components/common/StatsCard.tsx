import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/invoiceUtils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: {
    value: number;
    positive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, change }) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return formatCurrency(val);
    }
    return val;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatValue(value)}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                {change.positive ? '+' : ''}{change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs mois précédent</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;