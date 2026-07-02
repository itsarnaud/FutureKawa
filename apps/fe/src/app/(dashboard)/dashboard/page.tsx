"use client";

import React, { useState, useMemo } from "react";
import { COUNTRIES, MOCK_LOTS, MOCK_IOT_HISTORY, CountryConfig } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IoTCharts } from "@/components/dashboard/iot-charts";
import { StockTable } from "@/components/dashboard/stock-table";
import { AlertPanel } from "@/components/dashboard/alert-panel";
import {
  Thermometer,
  Droplets,
  Package,
  AlertTriangle,
  Globe,
  Coffee,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedCountryId, setSelectedCountryId] = useState<string>("br");

  // Selected country config
  const activeCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.id === selectedCountryId) || COUNTRIES[0];
  }, [selectedCountryId]);

  // Selected country lots
  const activeLots = useMemo(() => {
    return MOCK_LOTS.filter((lot) => lot.countryId === selectedCountryId);
  }, [selectedCountryId]);

  // Selected country IoT history
  const activeIoTHistory = useMemo(() => {
    return MOCK_IOT_HISTORY[selectedCountryId] || [];
  }, [selectedCountryId]);

  // Selected country latest reading
  const latestReading = useMemo(() => {
    if (activeIoTHistory.length === 0) return null;
    return activeIoTHistory[activeIoTHistory.length - 1];
  }, [activeIoTHistory]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = activeLots.length;
    const conforme = activeLots.filter((l) => l.status === "conforme").length;
    const alerte = activeLots.filter((l) => l.status === "alerte").length;
    const perime = activeLots.filter((l) => l.status === "perime").length;

    // Check if current IoT reading is drifting
    const tempDrift = latestReading
      ? latestReading.temperature < activeCountry.tempTarget - activeCountry.tempTolerance ||
        latestReading.temperature > activeCountry.tempTarget + activeCountry.tempTolerance
      : false;

    const humDrift = latestReading
      ? latestReading.humidity < activeCountry.humidityTarget - activeCountry.humidityTolerance ||
        latestReading.humidity > activeCountry.humidityTarget + activeCountry.humidityTolerance
      : false;

    return {
      total,
      conforme,
      alerte,
      perime,
      tempDrift,
      humDrift,
    };
  }, [activeLots, latestReading, activeCountry]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Upper Bar: Title & Global Context Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#532a0e] text-[#fdfaf7]">
              <Coffee className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
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
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/80">
            {COUNTRIES.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountryId(country.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  selectedCountryId === country.id
                    ? "bg-[#532a0e] text-[#fdfaf7] shadow-sm font-bold scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <span>
                  {country.id === "br" ? "🇧🇷" : country.id === "co" ? "🇨🇴" : "🇪🇨"}
                </span>
                {country.name}
              </button>
            ))}
          </div>
        </div>
      </div>

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
                stats.tempDrift
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
              }`}
            >
              <Thermometer className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">
                {latestReading ? `${latestReading.temperature.toFixed(1)}°C` : "—"}
              </span>
              {stats.tempDrift ? (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 text-[10px] py-0">
                  Dérive
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 text-[10px] py-0">
                  Cible
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
              <span>Seuil cible : {activeCountry.tempTarget}°C</span>
              <span>Tolérance : ±{activeCountry.tempTolerance}°C</span>
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
                stats.humDrift
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
              }`}
            >
              <Droplets className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">
                {latestReading ? `${latestReading.humidity.toFixed(1)}%` : "—"}
              </span>
              {stats.humDrift ? (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 text-[10px] py-0">
                  Dérive
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 text-[10px] py-0">
                  Cible
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
              <span>Seuil cible : {activeCountry.humidityTarget}%</span>
              <span>Tolérance : ±{activeCountry.humidityTolerance}%</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI Lots Count */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lots de Café stockés
            </CardTitle>
            <span className="p-1 rounded-full bg-zinc-50 text-zinc-600 dark:bg-zinc-800">
              <Package className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">{stats.total}</span>
              <span className="text-xs text-muted-foreground">unités</span>
            </div>
            <div className="text-[10px] flex items-center gap-1.5 mt-2">
              <span className="flex items-center gap-0.5 text-emerald-600">
                ● {stats.conforme} conforme
              </span>
              {stats.alerte > 0 && (
                <span className="flex items-center gap-0.5 text-amber-600">
                  ● {stats.alerte} alerte
                </span>
              )}
              {stats.perime > 0 && (
                <span className="flex items-center gap-0.5 text-rose-600 font-semibold">
                  ● {stats.perime} périmé
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
                stats.perime > 0 || stats.alerte > 0 || stats.tempDrift || stats.humDrift
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
              }`}
            >
              <AlertTriangle className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl font-bold tracking-tight ${
                  stats.perime > 0 ? "text-rose-600" : stats.alerte > 0 ? "text-amber-600" : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {stats.perime + stats.alerte + (stats.tempDrift ? 1 : 0) + (stats.humDrift ? 1 : 0)}
              </span>
              <span className="text-xs text-muted-foreground">actives</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {stats.perime > 0
                ? "Traitement FIFO urgent requis."
                : stats.alerte > 0
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
          <IoTCharts country={activeCountry} data={activeIoTHistory} />
        </div>

        {/* Alerts: Col 1 */}
        <div className="lg:col-span-1">
          <AlertPanel
            country={activeCountry}
            lots={activeLots}
            iotHistory={activeIoTHistory}
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
                Lots en transit / stockés au site {activeCountry.name}. Le stock le plus ancien doit être sorti en premier.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <StockTable lots={activeLots} />
        </CardContent>
      </Card>
    </div>
  );
}
