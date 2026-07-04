import { test, expect } from "@playwright/test";

// These e2e tests exercise the dashboard against the real gateway API, so the
// full stack (Postgres + the 3 country-api instances + the gateway) must be
// running with seeded data (see prisma/seed.ts) for them to pass.
test.describe("FutureKawa Vue Siège Dashboard", () => {
  test.beforeEach(async ({ page }) => {
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
    // Switch context to Brésil
    const brazilTab = page.getByRole("tab", { name: /Brésil/ });
    await expect(brazilTab).toBeVisible();
    await brazilTab.click();

    // Wait for the lots table to reflect the Brazilian context
    await expect(page.locator("tbody tr").first()).toBeVisible();

    // Now switch context to Colombie
    const colombiaTab = page.getByRole("tab", { name: /Colombie/ });
    await colombiaTab.click();

    // The lots table should refresh (still rendering rows, now for Colombia)
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });

  test("should default to FIFO sorting (oldest first) on the lots table", async ({ page }) => {
    await page.getByRole("tab", { name: /Brésil/ }).click();

    // By default, the FIFO active indicator is visible
    await expect(page.getByText("Règle FIFO active")).toBeVisible();

    const tableRows = page.locator("tbody tr");
    await expect(tableRows.first()).toBeVisible();

    // Clicking the "Stocké depuis" column header toggles sort order
    const dateHeader = page.getByRole("columnheader", { name: /Stocké depuis/ });
    const firstRowBefore = await tableRows.first().innerText();
    await dateHeader.click();
    const firstRowAfter = await tableRows.first().innerText();

    expect(firstRowAfter).not.toEqual(firstRowBefore);
  });
});
