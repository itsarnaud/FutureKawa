import { api } from "./api";
import type {
  Alert,
  CountryCode,
  Lot,
  LotStatus,
  SensorReading,
  Warehouse,
} from "@/types/domain";

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export interface LotsFilter {
  country?: CountryCode;
  warehouseId?: string;
  status?: LotStatus;
}

export interface AlertsFilter {
  country?: CountryCode;
  warehouseId?: string;
  sent?: boolean;
}

export interface ReadingsFilter {
  limit?: number;
  since?: string;
}

export const gateway = {
  getWarehouses(country?: CountryCode) {
    return api.get<Warehouse[]>(`/warehouses${buildQuery({ country })}`);
  },

  getWarehouse(id: string, country: CountryCode) {
    return api.get<Warehouse>(`/warehouses/${id}${buildQuery({ country })}`);
  },

  getWarehouseReadings(id: string, country: CountryCode, filter: ReadingsFilter = {}) {
    return api.get<SensorReading[]>(
      `/warehouses/${id}/readings${buildQuery({ country, ...filter })}`
    );
  },

  getLots(filter: LotsFilter = {}) {
    return api.get<Lot[]>(`/lots${buildQuery({ ...filter })}`);
  },

  getAlerts(filter: AlertsFilter = {}) {
    return api.get<Alert[]>(
      `/alerts${buildQuery({ ...filter, sent: filter.sent === undefined ? undefined : String(filter.sent) })}`
    );
  },
};
