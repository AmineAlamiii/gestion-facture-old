import { useApi } from './useApi';
import { dashboardService } from '../services/api';

export function useDashboardStats() {
  return useApi(() => dashboardService.getStats());
}

export function useDashboardCharts(period?: number) {
  return useApi(() => dashboardService.getCharts(period), [period]);
}

export function useDashboardHealth() {
  return useApi(() => dashboardService.getHealth());
}
