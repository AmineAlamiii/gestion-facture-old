import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductStock from './ProductStock';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const ProductStockContainer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    products, 
    loading, 
    error 
  } = useProducts();

  const handlePrint = () => {
    // TODO: Implémenter l'impression
    console.log('Imprimer le stock');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <LoadingSpinner size="lg" text="Chargement du stock..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <ErrorMessage 
            error={error}
            className="mb-4"
          />
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductStock
      products={products}
      onClose={onClose}
      onPrint={handlePrint}
    />
  );
};

export default ProductStockContainer;
