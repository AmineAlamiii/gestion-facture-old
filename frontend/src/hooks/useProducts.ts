import { useState, useCallback } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';
import { useApiList, useApi } from './useApi';

export function useProducts(search?: string, lowStock?: boolean, threshold?: number) {
  const { items, loading, error, refetch } = useApiList(
    () => productService.getAll(search, lowStock, threshold),
    [search, lowStock, threshold]
  );

  return {
    products: items,
    loading,
    error,
    refetch,
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await productService.getById(id);
      setProduct(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch };
}

export function useProductStats() {
  return useApi(() => productService.getStats());
}

export function useStockReport() {
  return useApi(() => productService.getStockReport());
}

export function useLowStockProducts(threshold: number = 10) {
  return useApiList(
    () => productService.getLowStock(threshold),
    [threshold]
  );
}
