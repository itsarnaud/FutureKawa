"use client";

import React, { useState } from "react";
import type { CountryCode } from "@/types/domain";
import { COUNTRY_META } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error";
import { useLots } from "@/hooks/use-lots";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LotsTable } from "@/components/dashboard/lots-table";
import { Package } from "lucide-react";

const COUNTRY_CODES: CountryCode[] = ["BR", "EC", "CO"];

export default function LotsPage() {
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");
  const { data: lots, loading, error, refetch } = useLots({
    country: countryFilter === "ALL" ? undefined : countryFilter,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#532a0e] text-[#fdfaf7]">
              <Package className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Lots
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Traçabilité complète des lots de café vert, tous entrepôts confondus.
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

      <Card className="border-border bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base font-semibold">Ensemble des lots</CardTitle>
          <CardDescription>
            Recherche, filtrage par statut et tri FIFO (date de stockage la plus ancienne en premier).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading && !lots ? (
            <div className="h-48 rounded-lg bg-muted/10 animate-pulse" />
          ) : (
            <LotsTable lots={lots ?? []} showExploitation />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
