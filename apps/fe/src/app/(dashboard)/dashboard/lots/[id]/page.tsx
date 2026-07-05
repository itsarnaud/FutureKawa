"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { CountryCode } from "@/types/domain";
import { COUNTRY_META, LOT_STATUS_LABELS, QUALITY_GRADE_LABELS, ALERT_TYPE_LABELS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error";
import { useLot } from "@/hooks/use-lot";
import { useLotMeasures } from "@/hooks/use-lot-measures";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IoTCharts } from "@/components/dashboard/iot-charts";
import { ArrowLeft, MapPin, Mail, Calendar, Package, Warehouse as WarehouseIcon } from "lucide-react";

function isCountryCode(value: string | null): value is CountryCode {
  return value === "BR" || value === "EC" || value === "CO";
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  conforme: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  alerte: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  perime: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
};

export default function LotDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const country = isCountryCode(countryParam) ? countryParam : undefined;

  const { data: lot, loading: lotLoading, error: lotError } = useLot(params.id, country);
  const { data: measures } = useLotMeasures(params.id, country);

  if (!country) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Contexte pays manquant</AlertTitle>
          <AlertDescription>
            Cette page doit être ouverte depuis la liste des lots pour connaître le pays associé.
            <div className="mt-3">
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/lots">Retour aux lots</Link>
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
          href="/dashboard/lots"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="size-3.5" /> Retour aux lots
        </Link>

        {lotError ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>{getErrorMessage(lotError)}</AlertDescription>
          </Alert>
        ) : lotLoading && !lot ? (
          <div className="h-16 rounded-lg bg-muted/10 animate-pulse" />
        ) : lot ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg">{COUNTRY_META[country]?.flag}</span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
              Lot {lot.id.slice(0, 8)}
            </h1>
            <Badge variant="outline" className={`font-medium ${STATUS_BADGE_CLASS[lot.status] ?? ""}`}>
              {LOT_STATUS_LABELS[lot.status] ?? lot.status}
            </Badge>
          </div>
        ) : null}

        {lot && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <WarehouseIcon className="size-3.5" /> {lot.warehouse.name}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {lot.exploitation.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Stocké depuis le{" "}
              {new Date(lot.storedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="size-3.5" /> {lot.weightKg.toFixed(0)} kg — {QUALITY_GRADE_LABELS[lot.qualityGrade] ?? lot.qualityGrade}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> {lot.warehouse.managerEmail}
            </span>
          </div>
        )}
      </div>

      {lot && (
        <>
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Conditions de stockage depuis l&apos;entrée du lot
            </h2>
            <IoTCharts country={lot.warehouse.country} readings={measures ?? []} />
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Historique des alertes</CardTitle>
              <CardDescription>Alertes déclenchées pour ce lot (10 dernières).</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {lot.alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Aucune alerte pour ce lot.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {lot.alerts.map((a) => (
                    <li key={a.id} className="py-3 flex items-start justify-between gap-4 text-sm">
                      <div>
                        <p className="font-medium">{ALERT_TYPE_LABELS[a.type] ?? a.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(a.triggeredAt).toLocaleString("fr-FR")}
                        </p>
                        <Badge variant={a.sent ? "secondary" : "outline"} className="mt-1">
                          {a.sent ? "Email envoyé" : "En attente d'envoi"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
