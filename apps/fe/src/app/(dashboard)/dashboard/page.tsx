"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { CountryCode } from "@/types/domain";
import { COUNTRY_META } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error";
import { useLots } from "@/hooks/use-lots";
import { useAlerts } from "@/hooks/use-alerts";
import { useWarehouses } from "@/hooks/use-warehouses";
import { useWarehouseReadings } from "@/hooks/use-warehouse-readings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoTCharts } from "@/components/dashboard/iot-charts";
import { LotsTable } from "@/components/dashboard/lots-table";
import { AlertPanel } from "@/components/dashboard/alert-panel";
import {
  Thermometer,
  Droplets,
  Package,
  AlertTriangle,
  Globe,
  Coffee,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const COUNTRY_CODES: CountryCode[] = ["BR", "EC", "CO"];

export default function DashboardPage() {
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);

  const activeCountry = countryFilter === "ALL" ? undefined : countryFilter;

  const { data: lots, loading: lotsLoading, error: lotsError, refetch: refetchLots } = useLots({
    country: activeCountry,
  });
  const { data: alerts, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useAlerts({
    country: activeCountry,
  });
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useWarehouses(
    activeCountry
  );

  // Reset the selected warehouse whenever the country context changes, and
  // default to the first warehouse available in that context.
  useEffect(() => {
    setSelectedWarehouseId(warehouses?.[0]?.id);
  }, [countryFilter, warehouses]);

  const selectedWarehouse = useMemo(
    () => warehouses?.find((w) => w.id === selectedWarehouseId),
    [warehouses, selectedWarehouseId]
  );

  const { data: readings } = useWarehouseReadings(
    selectedWarehouse?.id,
    selectedWarehouse?.country.code,
    { limit: 50 }
  );

  const kpis = useMemo(() => {
    const total = lots?.length ?? 0;
    const conforme = lots?.filter((l) => l.status === "conforme").length ?? 0;
    const alerte = lots?.filter((l) => l.status === "alerte").length ?? 0;
    const perime = lots?.filter((l) => l.status === "perime").length ?? 0;
    const activeAlerts = alerts?.length ?? 0;

    const latest = readings && readings.length > 0
      ? [...readings].sort(
          (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        )[0]
      : undefined;
    const country = selectedWarehouse?.country;

    const tempDrift =
      country && latest
        ? latest.temperature < country.tempIdeal - country.tempTolerance ||
          latest.temperature > country.tempIdeal + country.tempTolerance
        : false;
    const humDrift =
      country && latest
        ? latest.humidity < country.humidityIdeal - country.humidityTolerance ||
          latest.humidity > country.humidityIdeal + country.humidityTolerance
        : false;

    return { total, conforme, alerte, perime, activeAlerts, tempDrift, humDrift, latest, country };
  }, [lots, alerts, readings, selectedWarehouse]);

  const errors = [lotsError, alertsError, warehousesError].filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Upper Bar: Title & Global Context Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#532a0e] text-[#fdfaf7]">
              <Coffee className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              FutureKawa — Vue Siège
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Supervision multi-sites et contrôle de conformité environnementale (FIFO).
          </p>
        </div>

        {/* Global Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Globe className="size-3" />
            CONTEXTE PAYS ACTIF
          </label>
          <Tabs
            value={countryFilter}
            onValueChange={(v) => setCountryFilter(v as CountryCode | "ALL")}
          >
            <TabsList>
              <TabsTrigger value="ALL">Tous pays</TabsTrigger>
              {COUNTRY_CODES.map((code) => (
                <TabsTrigger key={code} value={code}>
                  {COUNTRY_META[code].flag} {COUNTRY_META[code].short}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{getErrorMessage(errors[0])}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                refetchLots();
                refetchAlerts();
              }}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI Temp */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Température Actuelle
            </CardTitle>
            <span
              className={`p-1 rounded-full ${
                kpis.tempDrift
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Thermometer className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">
                {kpis.latest ? `${kpis.latest.temperature.toFixed(1)}°C` : "—"}
              </span>
              {kpis.latest && (
                kpis.tempDrift ? (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] py-0">
                    Dérive
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                    Cible
                  </Badge>
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
              {kpis.country ? (
                <>
                  <span>Seuil cible : {kpis.country.tempIdeal}°C</span>
                  <span>Tolérance : ±{kpis.country.tempTolerance}°C</span>
                </>
              ) : (
                <span>Sélectionnez un pays pour voir les mesures en direct.</span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* KPI Humidity */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Humidité Actuelle
            </CardTitle>
            <span
              className={`p-1 rounded-full ${
                kpis.humDrift
                  ? "bg-rose-50 text-rose-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Droplets className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">
                {kpis.latest ? `${kpis.latest.humidity.toFixed(1)}%` : "—"}
              </span>
              {kpis.latest && (
                kpis.humDrift ? (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] py-0">
                    Dérive
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                    Cible
                  </Badge>
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
              {kpis.country ? (
                <>
                  <span>Seuil cible : {kpis.country.humidityIdeal}%</span>
                  <span>Tolérance : ±{kpis.country.humidityTolerance}%</span>
                </>
              ) : (
                <span>Sélectionnez un pays pour voir les mesures en direct.</span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* KPI Lots Count */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lots de Café stockés
            </CardTitle>
            <span className="p-1 rounded-full bg-zinc-50 text-zinc-600">
              <Package className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">
                {lotsLoading ? "…" : kpis.total}
              </span>
              <span className="text-xs text-muted-foreground">unités</span>
            </div>
            <div className="text-[10px] flex items-center gap-1.5 mt-2">
              <span className="flex items-center gap-0.5 text-emerald-700">
                ● {kpis.conforme} conforme
              </span>
              {kpis.alerte > 0 && (
                <span className="flex items-center gap-0.5 text-amber-700">
                  ● {kpis.alerte} alerte
                </span>
              )}
              {kpis.perime > 0 && (
                <span className="flex items-center gap-0.5 text-rose-700 font-semibold">
                  ● {kpis.perime} périmé
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI Alerts Summary */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Qualité & Anomalies
            </CardTitle>
            <span
              className={`p-1 rounded-full ${
                kpis.activeAlerts > 0
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <AlertTriangle className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl font-bold tracking-tight ${
                  kpis.perime > 0
                    ? "text-rose-700"
                    : kpis.activeAlerts > 0
                    ? "text-amber-700"
                    : "text-zinc-900"
                }`}
              >
                {alertsLoading ? "…" : kpis.activeAlerts}
              </span>
              <span className="text-xs text-muted-foreground">actives</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {kpis.perime > 0
                ? "Traitement FIFO urgent requis."
                : kpis.activeAlerts > 0
                ? "Contrôler les conditions du site."
                : "Qualité optimale du stockage."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Charts & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts: Cols 2 */}
        <div className="lg:col-span-2 space-y-6">
          {selectedWarehouse ? (
            <IoTCharts country={selectedWarehouse.country} readings={readings ?? []} />
          ) : (
            <Card className="border-border h-full flex items-center justify-center min-h-[240px]">
              <CardContent className="text-center text-sm text-muted-foreground pt-6">
                {warehousesLoading
                  ? "Chargement des entrepôts..."
                  : countryFilter === "ALL"
                  ? "Sélectionnez un pays pour afficher les courbes IoT d'un entrepôt."
                  : "Aucun entrepôt trouvé pour ce pays."}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Alerts: Col 1 */}
        <div className="lg:col-span-1">
          <AlertPanel
            alerts={alerts ?? []}
            contextLabel={countryFilter === "ALL" ? undefined : COUNTRY_META[countryFilter].short}
          />
        </div>
      </div>

      {/* Bottom: Stock FIFO Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle className="size-4 text-[#532a0e]" />
                Suivi FIFO des Stocks
              </CardTitle>
              <CardDescription>
                Lots en transit / stockés
                {countryFilter !== "ALL" ? ` au ${COUNTRY_META[countryFilter].short}` : " (tous pays)"}
                . Le stock le plus ancien doit être sorti en premier.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/lots" className="flex items-center gap-1 text-xs">
                Voir tous les lots <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <LotsTable lots={lots ?? []} showExploitation />
        </CardContent>
      </Card>
    </div>
  );
}
