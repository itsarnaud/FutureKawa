"use client";

import { gateway, type AlertsFilter } from "@/lib/gateway";
import type { Alert } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useAlerts(filter: AlertsFilter = {}): AsyncResource<Alert[]> {
  return useAsyncResource<Alert[]>(
    () => gateway.getAlerts(filter),
    [JSON.stringify(filter)],
    true
  );
}
