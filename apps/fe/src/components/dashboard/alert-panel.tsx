"use client";

import React from "react";
import type { Alert, AlertType } from "@/types/domain";
import { ALERT_TYPE_LABELS } from "@/lib/constants";
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
  Mail,
  MailCheck,
} from "lucide-react";

interface AlertPanelProps {
  alerts: Alert[];
  contextLabel?: string;
  listHeightClassName?: string;
}

const HIGH_SEVERITY: AlertType[] = ["lot_perime", "temperature_haute", "temperature_basse"];

function severityOf(type: AlertType): "high" | "medium" {
  return HIGH_SEVERITY.includes(type) ? "high" : "medium";
}

function iconOf(type: AlertType) {
  switch (type) {
    case "temperature_haute":
    case "temperature_basse":
      return <Thermometer className="size-3 text-rose-500" />;
    case "humidite_haute":
    case "humidite_basse":
      return <Droplets className="size-3 text-blue-500" />;
    case "lot_perime":
      return <Clock className="size-3 text-zinc-500" />;
    default:
      return null;
  }
}

export function AlertPanel({ alerts, contextLabel, listHeightClassName = "h-[350px]" }: AlertPanelProps) {
  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#532a0e]/10 text-[#532a0e]">
            <Bell className="size-4" />
          </div>
          <CardTitle className="text-base font-semibold">
            Alertes actives ({alerts.length})
          </CardTitle>
        </div>
        {alerts.length > 0 && (
          <Badge
            variant="destructive"
            className="animate-pulse bg-rose-600 text-white font-medium border-0"
          >
            Anomalie détectée
          </Badge>
        )}
      </CardHeader>
      <CardContent className={`${listHeightClassName} overflow-y-auto space-y-4 pr-1`}>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-emerald-50/20 border border-dashed border-emerald-100 rounded-lg dark:bg-emerald-950/5 dark:border-emerald-900/20">
            <div className="p-3 rounded-full bg-emerald-100/50 text-emerald-600 dark:bg-emerald-950/40 mb-3">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
              Tout est conforme
            </h3>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 max-w-[240px] mt-1">
              {contextLabel
                ? `Les stocks et les valeurs IoT de ${contextLabel} respectent tous les seuils de qualité.`
                : "Aucune anomalie de stockage ou de conditions environnementales."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const severity = severityOf(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs flex gap-3 transition-colors ${
                    severity === "high"
                      ? "bg-rose-50/50 border-rose-200/60 dark:bg-rose-950/10 dark:border-rose-900/30"
                      : "bg-amber-50/50 border-amber-200/60 dark:bg-amber-950/10 dark:border-amber-900/30"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {severity === "high" ? (
                      <AlertOctagon className="size-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {ALERT_TYPE_LABELS[alert.type] ?? alert.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 font-mono">
                        {new Date(alert.triggeredAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{alert.message}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {iconOf(alert.type)}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {alert.warehouse.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] flex items-center gap-1 ${
                          alert.sent ? "text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {alert.sent ? (
                          <>
                            <MailCheck className="size-3" /> E-mail envoyé
                          </>
                        ) : (
                          <>
                            <Mail className="size-3" /> En attente d&apos;envoi
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
