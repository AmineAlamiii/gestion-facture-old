import React from 'react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { usePurchaseInvoices } from '../../hooks/useInvoices';
import { useSaleInvoices } from '../../hooks/useInvoices';
import Dashboard from './Dashboard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const DashboardContainer: React.FC = () => {
  const { 
    data: dashboardStats, 
    loading: dashboardLoading, 
    error: dashboardError 
  } = useDashboardStats();

  const { 
    purchaseInvoices: purchases, 
    loading: purchasesLoading, 
    error: purchasesError 
  } = usePurchaseInvoices();

  const { 
    saleInvoices: sales, 
    loading: salesLoading, 
    error: salesError 
  } = useSaleInvoices();

  const loading = dashboardLoading || purchasesLoading || salesLoading;
  const error = dashboardError || purchasesError || salesError;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        error={error}
        className="mb-4"
      />
    );
  }

  return (
    <Dashboard
      purchases={purchases}
      sales={sales}
    />
  );
};

export default DashboardContainer;
