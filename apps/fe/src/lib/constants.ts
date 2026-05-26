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
