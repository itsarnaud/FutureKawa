"use client";

import React, { useMemo } from "react";
import { CoffeeLot, CountryConfig, IoTReading } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  Thermometer,
  Droplets,
  CheckCircle2,
  Bell,
  ArrowRight,
} from "lucide-react";

interface AlertPanelProps {
  country: CountryConfig;
  lots: CoffeeLot[];
  iotHistory: IoTReading[];
}

export function AlertPanel({ country, lots, iotHistory }: AlertPanelProps) {
  // Compute anomalies
  const anomalies = useMemo(() => {
    const list: {
      id: string;
      type: "perime" | "lot_alerte" | "sensor_temp" | "sensor_hum";
      title: string;
      description: string;
      severity: "high" | "medium";
      timestamp: string;
      valueInfo?: string;
    }[] = [];

    // 1. Expired lots
    lots.forEach((lot) => {
      if (lot.status === "perime") {
        list.push({
          id: `perime-${lot.uuid}`,
          type: "perime",
          title: "Lot de café périmé (> 365 jours)",
          description: `Le lot ${lot.uuid.substring(0, 8)}... stocké à "${
            lot.siteName
          }" a dépassé la durée maximale de stockage FIFO.`,
          severity: "high",
          timestamp: lot.entryDate,
          valueInfo: `Entré le ${new Date(lot.entryDate).toLocaleDateString(
            "fr-FR"
          )}`,
        });
      }
    });

    // 2. Lot anomaly (individual sensor alert on active lot)
    lots.forEach((lot) => {
      if (lot.status === "alerte") {
        const tempDiff = Math.abs(lot.temperature - country.tempTarget);
        const humDiff = Math.abs(lot.humidity - country.humidityTarget);

        let details = [];
        if (tempDiff > country.tempTolerance) {
          details.push(`Temp: ${lot.temperature.toFixed(1)}°C (cible: ${country.tempTarget}°C ±${country.tempTolerance})`);
        }
        if (humDiff > country.humidityTolerance) {
          details.push(`Hum: ${lot.humidity.toFixed(1)}% (cible: ${country.humidityTarget}% ±${country.humidityTolerance})`);
        }

        list.push({
          id: `lot-alerte-${lot.uuid}`,
          type: "lot_alerte",
          title: "Seuils environnementaux dépassés sur un lot",
          description: `Dérive détectée à "${lot.siteName}" pour le lot ${lot.uuid.substring(0, 8)}... : ${details.join(" | ")}`,
          severity: "medium",
          timestamp: "Actuel",
          valueInfo: `${lot.temperature}°C / ${lot.humidity}%`,
        });
      }
    });

    // 3. IoT Sensor drift in history (recent hours check)
    // We check recent readings to see if the warehouse itself is drifting
    const tempMin = country.tempTarget - country.tempTolerance;
    const tempMax = country.tempTarget + country.tempTolerance;
    const humMin = country.humidityTarget - country.humidityTolerance;
    const humMax = country.humidityTarget + country.humidityTolerance;

    // Get the latest reading
    if (iotHistory.length > 0) {
      const latest = iotHistory[iotHistory.length - 1];
      const isTempOut = latest.temperature < tempMin || latest.temperature > tempMax;
      const isHumOut = latest.humidity < humMin || latest.humidity > humMax;

      if (isTempOut) {
        list.push({
          id: `sensor-temp-${country.id}-${latest.time}`,
          type: "sensor_temp",
          title: "Dérive globale de température sur le site",
          description: `Le capteur IoT signale ${latest.temperature.toFixed(
            1
          )}°C à ${latest.time}, hors tolérance (${tempMin}°C - ${tempMax}°C).`,
          severity: "high",
          timestamp: latest.time,
          valueInfo: `Actuel: ${latest.temperature}°C`,
        });
      }

      if (isHumOut) {
        list.push({
          id: `sensor-hum-${country.id}-${latest.time}`,
          type: "sensor_hum",
          title: "Dérive globale d'humidité sur le site",
          description: `Le capteur IoT signale ${latest.humidity.toFixed(
            1
          )}% d'humidité à ${latest.time}, hors tolérance (${humMin}% - ${humMax}%).`,
          severity: "high",
          timestamp: latest.time,
          valueInfo: `Actuel: ${latest.humidity}%`,
        });
      }

      // Check also previous 2 readings for context if not resolved
      for (let i = iotHistory.length - 2; i >= Math.max(0, iotHistory.length - 3); i--) {
        const reading = iotHistory[i];
        const prevTempOut = reading.temperature < tempMin || reading.temperature > tempMax;
        const prevHumOut = reading.humidity < humMin || reading.humidity > humMax;
        
        if ((prevTempOut || prevHumOut) && list.length < 5) {
          list.push({
            id: `sensor-hist-${country.id}-${reading.time}`,
            type: prevTempOut ? "sensor_temp" : "sensor_hum",
            title: `Historique : Anomalie constatée à ${reading.time}`,
            description: `Seuils hors tolérance à ${reading.time} (${reading.temperature.toFixed(1)}°C, ${reading.humidity.toFixed(1)}%).`,
            severity: "medium",
            timestamp: reading.time,
          });
        }
      }
    }

    return list;
  }, [lots, country, iotHistory]);

  const highSeverityAlerts = anomalies.filter((a) => a.severity === "high");
  const mediumSeverityAlerts = anomalies.filter((a) => a.severity === "medium");

  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#532a0e]/10 text-[#532a0e]">
            <Bell className="size-4" />
          </div>
          <CardTitle className="text-base font-semibold">
            Alertes Actives ({anomalies.length})
          </CardTitle>
        </div>
        {anomalies.length > 0 && (
          <Badge
            variant="destructive"
            className="animate-pulse bg-rose-600 text-white font-medium border-0"
          >
            Anomalie détectée
          </Badge>
        )}
      </CardHeader>
      <CardContent className="h-[350px] overflow-y-auto space-y-4 pr-1">
        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-emerald-50/20 border border-dashed border-emerald-100 rounded-lg dark:bg-emerald-950/5 dark:border-emerald-900/20">
            <div className="p-3 rounded-full bg-emerald-100/50 text-emerald-600 dark:bg-emerald-950/40 mb-3">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
              Tout est conforme
            </h3>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 max-w-[240px] mt-1">
              Les stocks et les valeurs IoT du site {country.name} respectent tous les seuils de qualité.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-xs flex gap-3 transition-colors ${
                  alert.severity === "high"
                    ? "bg-rose-50/50 border-rose-200/60 dark:bg-rose-950/10 dark:border-rose-900/30"
                    : "bg-amber-50/50 border-amber-200/60 dark:bg-amber-950/10 dark:border-amber-900/30"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {alert.severity === "high" ? (
                    <AlertOctagon className="size-4 text-rose-600" />
                  ) : (
                    <AlertTriangle className="size-4 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 font-mono">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {alert.description}
                  </p>
                  {alert.valueInfo && (
                    <div className="pt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {alert.type === "sensor_temp" && (
                          <Thermometer className="size-3 text-rose-500" />
                        )}
                        {alert.type === "sensor_hum" && (
                          <Droplets className="size-3 text-blue-500" />
                        )}
                        {alert.type === "perime" && (
                          <Clock className="size-3 text-zinc-500" />
                        )}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {alert.valueInfo}
                        </span>
                      </div>
                      <span className="text-[10px] text-primary flex items-center hover:underline cursor-pointer">
                        Traiter
                        <ArrowRight className="size-2.5 ml-0.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
