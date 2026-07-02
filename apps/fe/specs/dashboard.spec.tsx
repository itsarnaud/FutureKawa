import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StockTable } from "../src/components/dashboard/stock-table";
import { AlertPanel } from "../src/components/dashboard/alert-panel";
import { CoffeeLot, CountryConfig } from "../src/lib/constants";

// Mock resize observer which is used by Recharts / ResponsiveContainer sometimes (though not directly rendering in these unit tests, good practice)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

const mockLots: CoffeeLot[] = [
  {
    uuid: "lot-1-conforme",
    countryId: "br",
    siteName: "Minas Gerais Site A",
    entryDate: "2026-05-10",
    temperature: 29.5,
    humidity: 55.2,
    status: "conforme",
  },
  {
    uuid: "lot-2-perime",
    countryId: "br",
    siteName: "Santos Port Depot",
    entryDate: "2025-03-15",
    temperature: 32.5,
    humidity: 54.1,
    status: "perime",
  },
  {
    uuid: "lot-3-alerte",
    countryId: "br",
    siteName: "Minas Gerais Site B",
    entryDate: "2026-05-20",
    temperature: 33.2,
    humidity: 58.5,
    status: "alerte",
  },
];

const mockCountry: CountryConfig = {
  id: "br",
  name: "Brésil",
  tempTarget: 29,
  tempTolerance: 3,
  humidityTarget: 55,
  humidityTolerance: 2,
};

describe("StockTable Component", () => {
  it("should render list of lots in the table", () => {
    render(<StockTable lots={mockLots} />);
    expect(screen.getByText("Minas Gerais Site A")).toBeTruthy();
    expect(screen.getByText("Minas Gerais Site B")).toBeTruthy();
    expect(screen.getByText("Santos Port Depot")).toBeTruthy();
  });

  it("should filter lots by status when filter buttons are clicked", () => {
    render(<StockTable lots={mockLots} />);

    // Initially all 3 lots are visible
    expect(screen.queryByText("lot-1-conforme")).toBeTruthy();
    expect(screen.queryByText("lot-2-perime")).toBeTruthy();
    expect(screen.queryByText("lot-3-alerte")).toBeTruthy();

    // Click on "Périmé" button
    const perimeFilterBtn = screen.getByRole("button", { name: /Périmé/ });
    fireEvent.click(perimeFilterBtn);

    // Only lot-2-perime should be visible
    expect(screen.queryByText("lot-2-perime")).toBeTruthy();
    expect(screen.queryByText("lot-1-conforme")).toBeNull();
    expect(screen.queryByText("lot-3-alerte")).toBeNull();
  });
});

describe("AlertPanel Component", () => {
  it("renders active alerts when anomalies exist", () => {
    render(
      <AlertPanel
        country={mockCountry}
        lots={mockLots}
        iotHistory={[{ time: "16:00", temperature: 29.5, humidity: 55.2 }]}
      />
    );

    // Displays expired lot alert
    expect(screen.getByText("Lot de café périmé (> 365 jours)")).toBeTruthy();
    // Displays environmental drift alert
    expect(
      screen.getByText("Seuils environnementaux dépassés sur un lot")
    ).toBeTruthy();
  });

  it("renders a success conforming message when no anomalies exist", () => {
    const conformingLots = [mockLots[0]];
    render(
      <AlertPanel
        country={mockCountry}
        lots={conformingLots}
        iotHistory={[{ time: "16:00", temperature: 29.5, humidity: 55.2 }]}
      />
    );

    expect(screen.getByText("Tout est conforme")).toBeTruthy();
    expect(
      screen.getByText(
        `Les stocks et les valeurs IoT du site ${mockCountry.name} respectent tous les seuils de qualité.`
      )
    ).toBeTruthy();
  });
});
