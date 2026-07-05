"use client";

import { gateway } from "@/lib/gateway";
import type { CountryCode, SensorReading } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useLotMeasures(
  id: string | undefined,
  country: CountryCode | undefined
): AsyncResource<SensorReading[]> {
  return useAsyncResource<SensorReading[]>(
    () => (id && country ? gateway.getLotMeasures(id, country) : null),
    [id, country],
    true
  );
}
