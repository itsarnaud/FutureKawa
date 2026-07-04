"use client";

import React, { useState, useMemo } from "react";
import type { Lot, LotStatus } from "@/types/domain";
import { LOT_STATUS_LABELS, QUALITY_GRADE_LABELS } from "@/lib/constants";
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

interface LotsTableProps {
  lots: Lot[];
  showExploitation?: boolean;
}

type SortField = "storedAt" | "weightKg" | "warehouse";
type SortOrder = "asc" | "desc";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / DAY_MS);
}

export function LotsTable({ lots, showExploitation = true }: LotsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LotStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("storedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc"); // Default asc for FIFO (oldest first)

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesSearch =
        lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.exploitation.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lots, searchTerm, statusFilter]);

  const sortedLots = useMemo(() => {
    const sorted = [...filteredLots];
    sorted.sort((a, b) => {
      let cmp: number;
      if (sortField === "storedAt") {
        cmp = new Date(a.storedAt).getTime() - new Date(b.storedAt).getTime();
      } else if (sortField === "weightKg") {
        cmp = a.weightKg - b.weightKg;
      } else {
        cmp = a.warehouse.name.localeCompare(b.warehouse.name);
      }
      return sortOrder === "asc" ? cmp : -cmp;
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

  const getStatusBadge = (status: LotStatus) => {
    switch (status) {
      case "conforme":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 flex items-center gap-1 w-fit font-medium py-0.5 px-2.5"
          >
            <CheckCircle className="size-3.5 fill-emerald-500/10" />
            {LOT_STATUS_LABELS.conforme}
          </Badge>
        );
      case "alerte":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 flex items-center gap-1 w-fit font-medium py-0.5 px-2.5"
          >
            <AlertTriangle className="size-3.5 fill-amber-500/10" />
            {LOT_STATUS_LABELS.alerte}
          </Badge>
        );
      case "perime":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 flex items-center gap-1 w-fit font-medium py-0.5 px-2.5"
          >
            <Clock className="size-3.5 fill-rose-500/10" />
            {LOT_STATUS_LABELS.perime}
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
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID, entrepôt ou exploitation..."
            className="pl-9 h-9 border-border bg-background focus-visible:ring-primary focus-visible:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

      {/* FIFO Indicator */}
      {sortField === "storedAt" && sortOrder === "asc" && (
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3 text-xs text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30 flex items-center gap-2">
          <Clock className="size-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Règle FIFO active</strong> : les lots les plus anciens (date de stockage minimale) sont affichés en premier pour prioriser leur expédition.
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground select-none">
              <th className="p-3.5 pl-4 font-semibold">
                <div className="flex items-center">
                  <Hash className="size-3.5 mr-1" />
                  Lot
                </div>
              </th>
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("warehouse")}
              >
                <div className="flex items-center">
                  <MapPin className="size-3.5 mr-1" />
                  Entrepôt {renderSortIcon("warehouse")}
                </div>
              </th>
              {showExploitation && <th className="p-3.5 font-semibold">Exploitation</th>}
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("storedAt")}
              >
                <div className="flex items-center">
                  <Calendar className="size-3.5 mr-1" />
                  Stocké depuis (FIFO) {renderSortIcon("storedAt")}
                </div>
              </th>
              <th
                className="p-3.5 cursor-pointer hover:bg-muted/40 hover:text-foreground transition-colors"
                onClick={() => handleSort("weightKg")}
              >
                <div className="flex items-center">
                  Poids {renderSortIcon("weightKg")}
                </div>
              </th>
              <th className="p-3.5 font-semibold">Qualité</th>
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
                <td colSpan={showExploitation ? 7 : 6} className="p-8 text-center text-muted-foreground">
                  Aucun lot trouvé correspondant aux critères.
                </td>
              </tr>
            ) : (
              sortedLots.map((lot) => {
                const age = daysSince(lot.storedAt);
                return (
                  <tr key={lot.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-3.5 pl-4 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {lot.id.slice(0, 8)}
                    </td>
                    <td className="p-3.5 font-medium">{lot.warehouse.name}</td>
                    {showExploitation && <td className="p-3.5">{lot.exploitation.name}</td>}
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span>
                          {new Date(lot.storedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span
                          className={`text-[10px] ${
                            age > 365 ? "text-rose-600 font-semibold" : age > 300 ? "text-amber-600" : "text-muted-foreground"
                          }`}
                        >
                          {age} jour{age > 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {lot.weightKg.toFixed(0)} kg
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="secondary" className="font-medium">
                        {QUALITY_GRADE_LABELS[lot.qualityGrade] ?? lot.qualityGrade}
                      </Badge>
                    </td>
                    <td className="p-3.5 pr-4 text-right flex justify-end">
                      {getStatusBadge(lot.status)}
                    </td>
                  </tr>
                );
              })
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
