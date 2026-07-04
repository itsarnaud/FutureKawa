"use client";

import { gateway } from "@/lib/gateway";
import type { CountryCode, Warehouse } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useWarehouses(country?: CountryCode): AsyncResource<Warehouse[]> {
  return useAsyncResource<Warehouse[]>(
    () => gateway.getWarehouses(country),
    [country],
    false
  );
}
