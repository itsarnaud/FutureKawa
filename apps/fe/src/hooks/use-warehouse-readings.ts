"use client";

import { gateway, type ReadingsFilter } from "@/lib/gateway";
import type { CountryCode, SensorReading } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useWarehouseReadings(
  id: string | undefined,
  country: CountryCode | undefined,
  filter: ReadingsFilter = {}
): AsyncResource<SensorReading[]> {
  return useAsyncResource<SensorReading[]>(
    () => (id && country ? gateway.getWarehouseReadings(id, country, filter) : null),
    [id, country, JSON.stringify(filter)],
    true
  );
}
