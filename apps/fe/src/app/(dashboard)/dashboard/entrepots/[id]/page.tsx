"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { CountryCode } from "@/types/domain";
import { COUNTRY_META } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error";
import { useWarehouse } from "@/hooks/use-warehouse";
import { useWarehouseReadings } from "@/hooks/use-warehouse-readings";
import { useLots } from "@/hooks/use-lots";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IoTCharts } from "@/components/dashboard/iot-charts";
import { LotsTable } from "@/components/dashboard/lots-table";
import { ArrowLeft, MapPin, Mail } from "lucide-react";

function isCountryCode(value: string | null): value is CountryCode {
  return value === "BR" || value === "EC" || value === "CO";
}

export default function WarehouseDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const country = isCountryCode(countryParam) ? countryParam : undefined;

  const { data: warehouse, loading: warehouseLoading, error: warehouseError } = useWarehouse(
    params.id,
    country
  );
  const { data: readings } = useWarehouseReadings(params.id, country, { limit: 100 });
  const { data: lots, loading: lotsLoading } = useLots({ warehouseId: params.id, country });

  if (!country) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Contexte pays manquant</AlertTitle>
          <AlertDescription>
            Cette page doit être ouverte depuis la liste des entrepôts pour connaître le pays associé.
            <div className="mt-3">
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/entrepots">Retour aux entrepôts</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-border pb-5">
        <Link
          href="/dashboard/entrepots"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="size-3.5" /> Retour aux entrepôts
        </Link>

        {warehouseError ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>{getErrorMessage(warehouseError)}</AlertDescription>
          </Alert>
        ) : warehouseLoading && !warehouse ? (
          <div className="h-16 rounded-lg bg-muted/10 animate-pulse" />
        ) : warehouse ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">{COUNTRY_META[warehouse.country.code]?.flag}</span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {warehouse.name}
            </h1>
          </div>
        ) : null}

        {warehouse && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {warehouse.address ?? "Adresse non renseignée"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> {warehouse.managerEmail}
            </span>
          </div>
        )}
      </div>

      {warehouse && <IoTCharts country={warehouse.country} readings={readings ?? []} />}

      <Card className="border-border bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base font-semibold">Lots stockés</CardTitle>
          <CardDescription>Lots présents dans cet entrepôt, triés en FIFO.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {lotsLoading && !lots ? (
            <div className="h-40 rounded-lg bg-muted/10 animate-pulse" />
          ) : (
            <LotsTable lots={lots ?? []} showExploitation />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
