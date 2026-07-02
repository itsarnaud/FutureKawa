import { test, expect } from "@playwright/test";

test.describe("FutureKawa Vue Siège Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard page
    await page.goto("/dashboard");
  });

  test("should render the main dashboard layout and KPIs", async ({ page }) => {
    // Check main title
    await expect(page.locator("h1")).toContainText("FutureKawa — Vue Siège");

    // Check country context switcher presence
    await expect(page.getByText("CONTEXTE PAYS ACTIF")).toBeVisible();

    // Check KPI Cards titles
    await expect(page.getByText("Température Actuelle")).toBeVisible();
    await expect(page.getByText("Humidité Actuelle")).toBeVisible();
    await expect(page.getByText("Lots de Café stockés")).toBeVisible();
    await expect(page.getByText("Qualité & Anomalies")).toBeVisible();
  });

  test("should allow switching country context and updates data", async ({ page }) => {
    // Default context is Brésil. Let's check that some Brazilian lot is visible in cells
    await expect(page.getByRole("cell", { name: "Exploitation Minas Gerais" }).first()).toBeVisible();

    // Now switch context to Colombie
    const colombiaBtn = page.getByRole("button", { name: "Colombie" });
    await expect(colombiaBtn).toBeVisible();
    await colombiaBtn.click();

    // Verify Colombia site is now displayed in the table
    await expect(page.getByRole("cell", { name: "Finca Medellín" }).first()).toBeVisible();
    // Minas Gerais should not be visible anymore
    await expect(page.getByRole("cell", { name: "Exploitation Minas Gerais" }).first()).toBeHidden();
  });

  test("should default to FIFO sorting (oldest first) and toggle sorting on date click", async ({ page }) => {
    // By default, the FIFO active alert/indicator is visible
    await expect(page.getByText("Règle FIFO Active")).toBeVisible();

    // In Brazil data, let's verify oldest lot is first
    // Minas Gerais (2026-05-10) vs Santos Port (2025-03-15) -> 2025-03-15 is oldest, so Santos Port must be at the top of the table rows.
    const tableRows = page.locator("tbody tr");
    await expect(tableRows.first()).toContainText("Santos Port");

    // Click on "Date d'entrée" header to toggle sort order
    const dateHeader = page.getByRole("columnheader", { name: /Date d'entrée/ });
    await dateHeader.click();

    // Now sort order should be DESC (newest first).
    // Minas Gerais (2026-05-20) should be first now.
    await expect(tableRows.first()).toContainText("Minas Gerais");
  });
});
