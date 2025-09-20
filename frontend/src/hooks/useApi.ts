import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../services/api';

// Hook générique pour les opérations API
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// Hook pour les opérations de mutation (create, update, delete)
export function useApiMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(params);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { mutate, loading, error };
}

// Hook pour les listes avec pagination
export function useApiList<T>(
  apiCall: () => Promise<T[]>,
  dependencies: any[] = []
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setItems(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const refetch = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, updatedItem: T) => {
    setItems(prev => prev.map(item => 
      (item as any).id === id ? updatedItem : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => (item as any).id !== id));
  }, []);

  return { 
    items, 
    loading, 
    error, 
    refetch, 
    addItem, 
    updateItem, 
    removeItem 
  };
}
