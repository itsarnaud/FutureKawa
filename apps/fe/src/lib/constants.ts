export const APP_NAME = "FutureKawa";
export const APP_DESCRIPTION = "Gestion de votre espace FutureKawa";

export const BRAND_COLOR = "#532a0e";

export const DEFAULT_LOCALE = "fr" as const;
export const SUPPORTED_LOCALES = ["fr", "en"] as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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
  { href: "/dashboard/commandes", labelFr: "Commandes", labelEn: "Orders", icon: "ShoppingBag" },
  { href: "/dashboard/clients", labelFr: "Clients", labelEn: "Customers", icon: "Users" },
  { href: "/dashboard/stocks", labelFr: "Stocks", labelEn: "Inventory", icon: "Package" },
  { href: "/dashboard/parametres", labelFr: "Paramètres", labelEn: "Settings", icon: "Settings" },
] as const;

export interface CountryConfig {
  id: string;
  name: string;
  tempTarget: number;
  tempTolerance: number;
  humidityTarget: number;
  humidityTolerance: number;
}

export const COUNTRIES: CountryConfig[] = [
  { id: "br", name: "Brésil", tempTarget: 29, tempTolerance: 3, humidityTarget: 55, humidityTolerance: 2 },
  { id: "co", name: "Colombie", tempTarget: 27, tempTolerance: 3, humidityTarget: 60, humidityTolerance: 2 },
  { id: "ec", name: "Équateur", tempTarget: 28, tempTolerance: 3, humidityTarget: 58, humidityTolerance: 2 },
];

export interface CoffeeLot {
  uuid: string;
  countryId: string;
  siteName: string;
  entryDate: string;
  temperature: number;
  humidity: number;
  status: "conforme" | "alerte" | "perime";
}

export interface IoTReading {
  time: string;
  temperature: number;
  humidity: number;
}

export const MOCK_LOTS: CoffeeLot[] = [
  // Brésil (br)
  { uuid: "3a8d8e12-4211-4567-a89f-8e2b1e604f51", countryId: "br", siteName: "Exploitation Minas Gerais", entryDate: "2026-05-10", temperature: 29.5, humidity: 55.2, status: "conforme" },
  { uuid: "7f8b9c23-5312-48a1-b92c-9d3e2f715a62", countryId: "br", siteName: "Entrepôt Santos Port", entryDate: "2025-03-15", temperature: 32.5, humidity: 54.1, status: "perime" }, // > 365 jours
  { uuid: "b2d3e4f5-6423-49b2-c03d-ae4f5a826b73", countryId: "br", siteName: "Exploitation Minas Gerais", entryDate: "2026-05-20", temperature: 33.2, humidity: 58.5, status: "alerte" }, // Temp 33.2 > 29+3, Hum 58.5 > 55+2
  // Colombie (co)
  { uuid: "d4e5f6a7-7534-4ac3-d14e-bf5a6c937d84", countryId: "co", siteName: "Finca Medellín", entryDate: "2026-04-01", temperature: 26.8, humidity: 59.8, status: "conforme" },
  { uuid: "1a2b3c4d-8645-4bd4-e25f-c06a7d048e95", countryId: "co", siteName: "Entrepôt Bogota Central", entryDate: "2025-05-20", temperature: 27.2, humidity: 60.1, status: "perime" }, // > 365 jours
  { uuid: "5e6f7a8b-9756-4ce5-f36g-d17b8e159f06", countryId: "co", siteName: "Finca Medellín", entryDate: "2026-05-24", temperature: 22.1, humidity: 61.2, status: "alerte" }, // Temp 22.1 < 27-3
  // Équateur (ec)
  { uuid: "9a8b7c6d-0867-4df6-g47h-e28c9f260a17", countryId: "ec", siteName: "Exploitation Loja Altitudes", entryDate: "2026-02-15", temperature: 27.9, humidity: 57.8, status: "conforme" },
  { uuid: "e2f3g4h5-1978-4ef7-h58i-f39d0a371b28", countryId: "ec", siteName: "Entrepôt Guayaquil Coast", entryDate: "2026-05-22", temperature: 28.1, humidity: 61.5, status: "alerte" }, // Hum 61.5 > 58+2
];

export const MOCK_IOT_HISTORY: Record<string, IoTReading[]> = {
  br: [
    { time: "08:00", temperature: 28.5, humidity: 54.8 },
    { time: "09:00", temperature: 28.9, humidity: 55.1 },
    { time: "10:00", temperature: 29.2, humidity: 55.3 },
    { time: "11:00", temperature: 29.8, humidity: 55.7 },
    { time: "12:00", temperature: 30.5, humidity: 56.2 },
    { time: "13:00", temperature: 32.8, humidity: 57.8 },
    { time: "14:00", temperature: 33.2, humidity: 58.5 },
    { time: "15:00", temperature: 31.2, humidity: 56.4 },
    { time: "16:00", temperature: 29.5, humidity: 55.2 },
  ],
  co: [
    { time: "08:00", temperature: 26.5, humidity: 59.5 },
    { time: "09:00", temperature: 26.7, humidity: 59.8 },
    { time: "10:00", temperature: 26.9, humidity: 60.1 },
    { time: "11:00", temperature: 27.1, humidity: 60.3 },
    { time: "12:00", temperature: 25.4, humidity: 61.2 },
    { time: "13:00", temperature: 23.2, humidity: 61.8 },
    { time: "14:00", temperature: 22.1, humidity: 61.2 },
    { time: "15:00", temperature: 24.8, humidity: 60.5 },
    { time: "16:00", temperature: 26.8, humidity: 59.8 },
  ],
  ec: [
    { time: "08:00", temperature: 27.5, humidity: 57.5 },
    { time: "09:00", temperature: 27.8, humidity: 57.8 },
    { time: "10:00", temperature: 28.0, humidity: 58.1 },
    { time: "11:00", temperature: 28.2, humidity: 58.4 },
    { time: "12:00", temperature: 28.5, humidity: 59.8 },
    { time: "13:00", temperature: 28.4, humidity: 61.2 },
    { time: "14:00", temperature: 28.1, humidity: 61.5 },
    { time: "15:00", temperature: 28.0, humidity: 59.2 },
    { time: "16:00", temperature: 27.9, humidity: 57.8 },
  ],
};
