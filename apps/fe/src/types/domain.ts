// Mirrors the shapes returned by the gateway (apps/gateway), itself proxying
// apps/country-api, which serializes Prisma models (see prisma/schema.prisma).

export type CountryCode = "BR" | "EC" | "CO";

export type LotStatus = "conforme" | "alerte" | "perime";

export type QualityGrade = "specialty" | "premium" | "standard" | "non_conforme";

export type AlertType =
  | "temperature_haute"
  | "temperature_basse"
  | "humidite_haute"
  | "humidite_basse"
  | "lot_perime";

export type DeviceStatus = "actif" | "inactif" | "maintenance";

export interface Country {
  id: string;
  code: CountryCode;
  name: string;
  tempIdeal: number;
  tempTolerance: number;
  humidityIdeal: number;
  humidityTolerance: number;
}

export interface WarehouseRef {
  id: string;
  name: string;
}

export interface ExploitationRef {
  id: string;
  name: string;
}

export interface IotDevice {
  id: string;
  warehouseId: string;
  mqttTopic: string;
  firmwareVersion: string | null;
  status: DeviceStatus;
}

export interface Warehouse {
  id: string;
  countryId: string;
  name: string;
  address: string | null;
  managerEmail: string;
  country: Country;
  devices?: IotDevice[];
}

export interface Lot {
  id: string;
  warehouseId: string;
  exploitationId: string;
  storedAt: string;
  status: LotStatus;
  qualityGrade: QualityGrade;
  weightKg: number;
  warehouse: WarehouseRef;
  exploitation: ExploitationRef;
}

export interface SensorReading {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  recordedAt: string;
  device?: { id: string; mqttTopic: string };
}

export interface Alert {
  id: string;
  warehouseId: string;
  lotId: string | null;
  type: AlertType;
  message: string;
  sent: boolean;
  triggeredAt: string;
  warehouse: WarehouseRef;
  lot?: { id: string; storedAt: string } | null;
}
