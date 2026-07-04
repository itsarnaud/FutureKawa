"use client";

import { gateway, type LotsFilter } from "@/lib/gateway";
import type { Lot } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useLots(filter: LotsFilter = {}): AsyncResource<Lot[]> {
  return useAsyncResource<Lot[]>(
    () => gateway.getLots(filter),
    [JSON.stringify(filter)],
    true
  );
}
