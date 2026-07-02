"use client";

import React, { useState, useMemo } from "react";
import { CoffeeLot } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  Search,
  ArrowUp,
  ArrowDown,
  Calendar,
  MapPin,
  Tag,
  Hash,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface StockTableProps {
  lots: CoffeeLot[];
}

type SortField = "entryDate" | "temperature" | "humidity" | "siteName";
type SortOrder = "asc" | "desc";

export function StockTable({ lots }: StockTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("entryDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc"); // Default asc for FIFO (oldest first)

  // Filtering
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesSearch =
        lot.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.siteName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || lot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lots, searchTerm, statusFilter]);

  // Sorting
  const sortedLots = useMemo(() => {
    const sorted = [...filteredLots];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Numbers
        const numA = valA as number;
        const numB = valB as number;
        return sortOrder === "asc" ? numA - numB : numB - numA;
      }
    });
    return sorted;
  }, [filteredLots, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusBadge = (status: CoffeeLot["status"]) => {
    switch (status) {
      case "conforme":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 flex items-center gap-1 w-fit font-medium py-0.5 px-2.5"
          >
            <CheckCircle className="size-3.5 fill-emerald-500/10" />
            Conforme
          </Badge>
        );
      case "alerte":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 flex items-center gap-1 w-fit font-medium py-0.5 px-2.5"
          >
            <AlertTriangle className="size-3.5 fill-amber-500/10" />
            Alerte
          </Badge>
        );
      case "perime":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 flex items-center gap-1 w-fit font-medium py-0.5 px-2.5"
          >
            <Clock className="size-3.5 fill-rose-500/10" />
            {"Périmé (>365j)"}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 ml-1 text-muted-foreground/60" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 ml-1 text-primary" />
    ) : (
      <ArrowDown className="size-3 ml-1 text-primary" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par UUID ou Site..."
            className="pl-9 h-9 border-border bg-background focus-visible:ring-primary focus-visible:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/60 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-white text-[#532a0e] shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous ({lots.length})
          </button>
          <button
            onClick={() => setStatusFilter("conforme")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              statusFilter === "conforme"
                ? "bg-white text-emerald-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-emerald-600"
            }`}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Conforme ({lots.filter((l) => l.status === "conforme").length})
          </button>
          <button
            onClick={() => setStatusFilter("alerte")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              statusFilter === "alerte"
                ? "bg-white text-amber-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-amber-600"
            }`}
          >
            <span className="size-1.5 rounded-full bg-amber-500" />
            Alerte ({lots.filter((l) => l.status === "alerte").length})
          </button>
          <button
            onClick={() => setStatusFilter("perime")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              statusFilter === "perime"
                ? "bg-white text-rose-700 shadow-sm font-semibold border border-border/30 dark:bg-zinc-800"
                : "text-muted-foreground hover:text-rose-600"
            }`}
          >
            <span className="size-1.5 rounded-full bg-rose-500" />
            Périmé ({lots.filter((l) => l.status === "perime").length})
          </button>
        </div>
      </div>

      {/* FIFO Indicator Alert */}
      {sortField === "entryDate" && sortOrder === "asc" && (
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3 text-xs text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30 flex items-center gap-2">
          <Clock className="size-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Règle FIFO Active</strong> : Les lots les plus anciens (date d&apos;entrée minimale) sont affichés en premier pour prioriser leur traitement.
          </span>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto border border-border rounded-lg bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground select-none">
              <th className="p-3.5 pl-4 font-semibold">
                <div className="flex items-center">
                  <Hash className="size-3.5 mr-1" />
                  Lot (UUID)
                </div>
              </th>
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("siteName")}
              >
                <div className="flex items-center">
                  <MapPin className="size-3.5 mr-1" />
                  Localisation / Site {renderSortIcon("siteName")}
                </div>
              </th>
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("entryDate")}
              >
                <div className="flex items-center">
                  <Calendar className="size-3.5 mr-1" />
                  Date d&apos;entrée (FIFO) {renderSortIcon("entryDate")}
                </div>
              </th>
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("temperature")}
              >
                <div className="flex items-center">
                  Température {renderSortIcon("temperature")}
                </div>
              </th>
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("humidity")}
              >
                <div className="flex items-center">
                  Humidité {renderSortIcon("humidity")}
                </div>
              </th>
              <th className="p-3.5 pr-4 text-right font-semibold">
                <div className="flex items-center justify-end">
                  <Tag className="size-3.5 mr-1" />
                  Statut
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {sortedLots.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Aucun lot trouvé correspondant aux critères.
                </td>
              </tr>
            ) : (
              sortedLots.map((lot) => (
                <tr
                  key={lot.uuid}
                  className="hover:bg-muted/10 transition-colors group"
                >
                  <td className="p-3.5 pl-4 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {lot.uuid}
                  </td>
                  <td className="p-3.5 font-medium">{lot.siteName}</td>
                  <td className="p-3.5">
                    {new Date(lot.entryDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-[#532a0e] dark:text-[#a66738]">
                      {lot.temperature.toFixed(1)}°C
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {lot.humidity.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right flex justify-end">
                    {getStatusBadge(lot.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          Affichage de {sortedLots.length} lot(s) sur {lots.length} au total.
        </span>
      </div>
    </div>
  );
}
