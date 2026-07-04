"use client";

import { gateway } from "@/lib/gateway";
import type { CountryCode, Warehouse } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useWarehouse(
  id: string | undefined,
  country: CountryCode | undefined
): AsyncResource<Warehouse> {
  return useAsyncResource<Warehouse>(
    () => (id && country ? gateway.getWarehouse(id, country) : null),
    [id, country],
    false
  );
}
