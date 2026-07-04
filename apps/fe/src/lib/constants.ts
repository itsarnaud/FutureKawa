export const APP_NAME = "FutureKawa";
export const APP_DESCRIPTION = "Gestion de votre espace FutureKawa";

export const BRAND_COLOR = "#532a0e";

export const DEFAULT_LOCALE = "fr" as const;
export const SUPPORTED_LOCALES = ["fr", "en"] as const;

// The frontend only ever talks to the central gateway (apps/gateway), which
// aggregates the per-country backends. Its global prefix is "/api".
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010/api";

// Polling interval for "real-time" IoT views (no websocket/MQTT bridge to the browser yet).
export const POLLING_INTERVAL_MS = 30_000;

export const AUTH_COOKIE_NAME = "fk_access_token";
export const AUTH_REFRESH_COOKIE_NAME = "fk_refresh_token";

// Routes that require authentication
export const PROTECTED_ROUTES = ["/dashboard"];

// Routes that should redirect to dashboard if already authenticated
export const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export const NAV_LINKS = [
  { href: "/", labelFr: "Accueil", labelEn: "Home" },
  { href: "/a-propos", labelFr: "À propos", labelEn: "About" },
  { href: "/contact", labelFr: "Contact", labelEn: "Contact" },
] as const;

export const SIDEBAR_LINKS = [
  { href: "/dashboard", labelFr: "Tableau de bord", labelEn: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/lots", labelFr: "Lots", labelEn: "Lots", icon: "Package" },
  { href: "/dashboard/entrepots", labelFr: "Entrepôts", labelEn: "Warehouses", icon: "Warehouse" },
  { href: "/dashboard/alertes", labelFr: "Alertes", labelEn: "Alerts", icon: "Bell" },
  { href: "/dashboard/parametres", labelFr: "Paramètres", labelEn: "Settings", icon: "Settings" },
] as const;

// Flag emoji + short label per country code — purely cosmetic, thresholds
// always come from the API (Country.tempIdeal/humidityIdeal, etc.).
export const COUNTRY_META: Record<string, { flag: string; short: string }> = {
  BR: { flag: "🇧🇷", short: "Brésil" },
  EC: { flag: "🇪🇨", short: "Équateur" },
  CO: { flag: "🇨🇴", short: "Colombie" },
};

export const LOT_STATUS_LABELS: Record<string, string> = {
  conforme: "Conforme",
  alerte: "Alerte",
  perime: "Périmé (>365j)",
};

export const QUALITY_GRADE_LABELS: Record<string, string> = {
  specialty: "Specialty",
  premium: "Premium",
  standard: "Standard",
  non_conforme: "Non conforme",
};

export const ALERT_TYPE_LABELS: Record<string, string> = {
  temperature_haute: "Température trop haute",
  temperature_basse: "Température trop basse",
  humidite_haute: "Humidité trop haute",
  humidite_basse: "Humidité trop basse",
  lot_perime: "Lot périmé",
};
