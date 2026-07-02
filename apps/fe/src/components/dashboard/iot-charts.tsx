"use client";

import React, { useState, useEffect } from "react";
import { CountryConfig, IoTReading } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { Thermometer, Droplets } from "lucide-react";

interface IoTChartsProps {
  country: CountryConfig;
  data: IoTReading[];
}

export function IoTCharts({ country, data }: IoTChartsProps) {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch with Recharts in Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  const tempMin = country.tempTarget - country.tempTolerance;
  const tempMax = country.tempTarget + country.tempTolerance;
  const humMin = country.humidityTarget - country.humidityTolerance;
  const humMax = country.humidityTarget + country.humidityTolerance;

  if (!mounted) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="size-4 text-[#532a0e]" />
              Température Historique
            </CardTitle>
            <CardDescription>Chargement du graphique...</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center bg-muted/10 rounded-lg animate-pulse" />
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="size-4 text-blue-500" />
              Humidité Historique
            </CardTitle>
            <CardDescription>Chargement du graphique...</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center bg-muted/10 rounded-lg animate-pulse" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Temperature Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="p-1 rounded bg-[#532a0e]/10 text-[#532a0e]">
                <Thermometer className="size-4" />
              </span>
              Température Historique
            </CardTitle>
            <div className="text-xs text-right">
              <span className="font-semibold text-[#532a0e]">
                Cible: {country.tempTarget}°C
              </span>
              <span className="text-muted-foreground ml-1.5">
                (±{country.tempTolerance}°C)
              </span>
            </div>
          </div>
          <CardDescription>
            Évolution sur les dernières heures ({country.name})
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a66738" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a66738" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebebeb" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis
                  domain={[
                    Math.floor(tempMin - 3),
                    Math.ceil(tempMax + 3),
                  ]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickMargin={8}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      const isOutOfRange = val < tempMin || val > tempMax;
                      return (
                        <div className="bg-white p-2.5 border border-border rounded-lg shadow-sm text-xs space-y-1 dark:bg-zinc-900">
                          <p className="font-semibold text-muted-foreground">{label}</p>
                          <p className="font-bold flex items-center gap-1.5">
                            <span className={`size-1.5 rounded-full ${isOutOfRange ? "bg-rose-500" : "bg-emerald-500"}`} />
                            Temp: {val.toFixed(1)}°C
                          </p>
                          {isOutOfRange && (
                            <p className="text-[10px] text-rose-500 font-medium">
                              {`Hors tolérance (${tempMin}-${tempMax}°C)`}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Tolerance Zone */}
                <ReferenceArea
                  y1={tempMin}
                  y2={tempMax}
                  fill="#532a0e"
                  fillOpacity={0.05}
                />
                {/* Target Line */}
                <ReferenceLine
                  y={country.tempTarget}
                  stroke="#532a0e"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                {/* Main Curve */}
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#532a0e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Humidity Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="p-1 rounded bg-blue-500/10 text-blue-600">
                <Droplets className="size-4" />
              </span>
              Humidité Historique
            </CardTitle>
            <div className="text-xs text-right">
              <span className="font-semibold text-blue-600">
                Cible: {country.humidityTarget}%
              </span>
              <span className="text-muted-foreground ml-1.5">
                (±{country.humidityTolerance}%)
              </span>
            </div>
          </div>
          <CardDescription>
            Évolution sur les dernières heures ({country.name})
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebebeb" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis
                  domain={[
                    Math.floor(humMin - 3),
                    Math.ceil(humMax + 3),
                  ]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickMargin={8}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      const isOutOfRange = val < humMin || val > humMax;
                      return (
                        <div className="bg-white p-2.5 border border-border rounded-lg shadow-sm text-xs space-y-1 dark:bg-zinc-900">
                          <p className="font-semibold text-muted-foreground">{label}</p>
                          <p className="font-bold flex items-center gap-1.5">
                            <span className={`size-1.5 rounded-full ${isOutOfRange ? "bg-rose-500" : "bg-emerald-500"}`} />
                            Humidité: {val.toFixed(1)}%
                          </p>
                          {isOutOfRange && (
                            <p className="text-[10px] text-rose-500 font-medium">
                              {`Hors tolérance (${humMin}-${humMax}%)`}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Tolerance Zone */}
                <ReferenceArea
                  y1={humMin}
                  y2={humMax}
                  fill="#3b82f6"
                  fillOpacity={0.05}
                />
                {/* Target Line */}
                <ReferenceLine
                  y={country.humidityTarget}
                  stroke="#3b82f6"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                {/* Main Curve */}
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#humGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
