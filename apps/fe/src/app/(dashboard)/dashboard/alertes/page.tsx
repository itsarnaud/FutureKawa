"use client";

import React, { useState } from "react";
import type { Alert as DomainAlert, CountryCode } from "@/types/domain";
import { COUNTRY_META } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error";
import { gateway } from "@/lib/gateway";
import { useAlerts } from "@/hooks/use-alerts";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertPanel } from "@/components/dashboard/alert-panel";
import { Bell } from "lucide-react";

const COUNTRY_CODES: CountryCode[] = ["BR", "EC", "CO"];

type SentFilter = "all" | "sent" | "pending";
type TreatmentFilter = "all" | "resolved" | "pending";

export default function AlertesPage() {
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");
  const [sentFilter, setSentFilter] = useState<SentFilter>("all");
  const [treatmentFilter, setTreatmentFilter] = useState<TreatmentFilter>("all");

  const { data: alerts, loading, error, refetch } = useAlerts({
    country: countryFilter === "ALL" ? undefined : countryFilter,
    sent: sentFilter === "all" ? undefined : sentFilter === "sent",
    resolved: treatmentFilter === "all" ? undefined : treatmentFilter === "resolved",
  });

  const handleResolve = async (alert: DomainAlert) => {
    const country = alert.warehouse.country?.code;
    if (!country) return;
    await gateway.resolveAlert(alert.id, country);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#532a0e] text-[#fdfaf7]">
              <Bell className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Alertes
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dépassements de seuils environnementaux et lots périmés.
          </p>
        </div>

        <Tabs value={countryFilter} onValueChange={(v) => setCountryFilter(v as CountryCode | "ALL")}>
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

      <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/60 w-fit">
        <button
          onClick={() => setSentFilter("all")}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            sentFilter === "all"
              ? "bg-white text-[#532a0e] shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setSentFilter("sent")}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            sentFilter === "sent"
              ? "bg-white text-emerald-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
              : "text-muted-foreground hover:text-emerald-600"
          }`}
        >
          Envoyées
        </button>
        <button
          onClick={() => setSentFilter("pending")}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            sentFilter === "pending"
              ? "bg-white text-amber-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
              : "text-muted-foreground hover:text-amber-600"
          }`}
        >
          En attente
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Traitement :</span>
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/60 w-fit">
          <button
            onClick={() => setTreatmentFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              treatmentFilter === "all"
                ? "bg-white text-[#532a0e] shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setTreatmentFilter("pending")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              treatmentFilter === "pending"
                ? "bg-white text-rose-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-rose-600"
            }`}
          >
            Non traitées
          </button>
          <button
            onClick={() => setTreatmentFilter("resolved")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              treatmentFilter === "resolved"
                ? "bg-white text-emerald-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-emerald-600"
            }`}
          >
            Traitées
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{getErrorMessage(error)}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading && !alerts ? (
        <div className="h-64 rounded-lg bg-muted/10 animate-pulse" />
      ) : (
        <AlertPanel
          alerts={alerts ?? []}
          contextLabel={countryFilter === "ALL" ? undefined : COUNTRY_META[countryFilter].short}
          listHeightClassName="h-[65vh]"
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}
