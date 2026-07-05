"use client";

import { gateway } from "@/lib/gateway";
import type { CountryCode, LotDetail } from "@/types/domain";
import { useAsyncResource, type AsyncResource } from "./internal/use-async-resource";

export function useLot(
  id: string | undefined,
  country: CountryCode | undefined
): AsyncResource<LotDetail> {
  return useAsyncResource<LotDetail>(
    () => (id && country ? gateway.getLot(id, country) : null),
    [id, country],
    false
  );
}
