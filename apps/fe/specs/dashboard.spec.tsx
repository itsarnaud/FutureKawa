import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LotsTable } from "../src/components/dashboard/lots-table";
import { AlertPanel } from "../src/components/dashboard/alert-panel";
import type { Lot, Alert } from "../src/types/domain";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock resize observer which is used by Recharts / ResponsiveContainer sometimes (though not directly rendering in these unit tests, good practice)
/* eslint-disable @typescript-eslint/no-empty-function */
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
/* eslint-enable @typescript-eslint/no-empty-function */
window.ResizeObserver = ResizeObserver;

const mockLots: Lot[] = [
  {
    id: "lot-1-conforme",
    warehouseId: "wh-1",
    exploitationId: "exp-1",
    storedAt: "2026-05-10",
    status: "conforme",
    qualityGrade: "specialty",
    weightKg: 500,
    warehouse: { id: "wh-1", name: "Minas Gerais Site A" },
    exploitation: { id: "exp-1", name: "Fazenda Minas Gerais" },
  },
  {
    id: "lot-2-perime",
    warehouseId: "wh-2",
    exploitationId: "exp-2",
    storedAt: "2025-03-15",
    status: "perime",
    qualityGrade: "standard",
    weightKg: 300,
    warehouse: { id: "wh-2", name: "Santos Port Depot" },
    exploitation: { id: "exp-2", name: "Fazenda Santos" },
  },
  {
    id: "lot-3-alerte",
    warehouseId: "wh-1",
    exploitationId: "exp-1",
    storedAt: "2026-05-20",
    status: "alerte",
    qualityGrade: "premium",
    weightKg: 420,
    warehouse: { id: "wh-1", name: "Minas Gerais Site B" },
    exploitation: { id: "exp-1", name: "Fazenda Minas Gerais" },
  },
];

const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    warehouseId: "wh-2",
    lotId: "lot-2-perime",
    type: "lot_perime",
    message: "Lot de café périmé (> 365 jours)",
    sent: false,
    triggeredAt: "2026-05-25T10:00:00.000Z",
    warehouse: { id: "wh-2", name: "Santos Port Depot" },
    lot: { id: "lot-2-perime", storedAt: "2025-03-15" },
  },
  {
    id: "alert-2",
    warehouseId: "wh-1",
    lotId: null,
    type: "temperature_haute",
    message: "Seuils environnementaux dépassés sur un lot",
    sent: true,
    triggeredAt: "2026-05-25T11:00:00.000Z",
    warehouse: { id: "wh-1", name: "Minas Gerais Site A" },
  },
];

describe("LotsTable Component", () => {
  it("should render list of lots in the table", () => {
    render(<LotsTable lots={mockLots} />);
    expect(screen.getByText("Minas Gerais Site A")).toBeTruthy();
    expect(screen.getByText("Minas Gerais Site B")).toBeTruthy();
    expect(screen.getByText("Santos Port Depot")).toBeTruthy();
  });

  it("should filter lots by status when filter buttons are clicked", () => {
    render(<LotsTable lots={mockLots} />);

    // Initially all 3 lots are visible
    expect(screen.queryByText("Santos Port Depot")).toBeTruthy();
    expect(screen.queryByText("Minas Gerais Site A")).toBeTruthy();
    expect(screen.queryByText("Minas Gerais Site B")).toBeTruthy();

    // Click on "Périmé" button
    const perimeFilterBtn = screen.getByRole("button", { name: /Périmé/ });
    fireEvent.click(perimeFilterBtn);

    // Only the "perime" lot should remain visible
    expect(screen.queryByText("Santos Port Depot")).toBeTruthy();
    expect(screen.queryByText("Minas Gerais Site A")).toBeNull();
    expect(screen.queryByText("Minas Gerais Site B")).toBeNull();
  });
});

describe("AlertPanel Component", () => {
  it("renders active alerts when there are some", () => {
    render(<AlertPanel alerts={mockAlerts} />);

    expect(screen.getByText("Lot de café périmé (> 365 jours)")).toBeTruthy();
    expect(
      screen.getByText("Seuils environnementaux dépassés sur un lot")
    ).toBeTruthy();
  });

  it("renders a success conforming message when no alerts exist", () => {
    render(<AlertPanel alerts={[]} contextLabel="Brésil" />);

    expect(screen.getByText("Tout est conforme")).toBeTruthy();
    expect(
      screen.getByText(
        "Les stocks et les valeurs IoT de Brésil respectent tous les seuils de qualité."
      )
    ).toBeTruthy();
  });
});
