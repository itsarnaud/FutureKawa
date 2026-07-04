"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { CountryCode } from "@/types/domain";
import { COUNTRY_META } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error";
import { useWarehouses } from "@/hooks/use-warehouses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warehouse as WarehouseIcon, MapPin, Mail, Cpu, ArrowRight } from "lucide-react";

const COUNTRY_CODES: CountryCode[] = ["BR", "EC", "CO"];

export default function EntrepotsPage() {
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");
  const { data: warehouses, loading, error, refetch } = useWarehouses(
    countryFilter === "ALL" ? undefined : countryFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#532a0e] text-[#fdfaf7]">
              <WarehouseIcon className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Entrepôts
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Hubs logistiques par pays et leurs conditions de stockage.
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

      {loading && !warehouses ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-muted/10 animate-pulse" />
          ))}
        </div>
      ) : warehouses && warehouses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => (
            <Link
              key={warehouse.id}
              href={`/dashboard/entrepots/${warehouse.id}?country=${warehouse.country.code}`}
            >
              <Card className="border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{warehouse.name}</CardTitle>
                    <span className="text-lg">{COUNTRY_META[warehouse.country.code]?.flag}</span>
                  </div>
                  <CardDescription>{COUNTRY_META[warehouse.country.code]?.short}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {warehouse.address ?? "Adresse non renseignée"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {warehouse.managerEmail}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="size-3.5" />
                    {warehouse.devices ? `${warehouse.devices.length} capteur(s)` : "—"}
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-primary font-medium">
                    Voir le détail <ArrowRight className="size-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="text-center text-sm text-muted-foreground py-10">
            Aucun entrepôt trouvé pour ce contexte.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
