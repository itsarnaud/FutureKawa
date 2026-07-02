import type { Locale } from "@/types";
import { DEFAULT_LOCALE } from "@/lib/constants";

// Type inferred from the FR dictionary (source of truth)
import type fr from "./dictionaries/fr.json";
export type Dictionary = typeof fr;

/**
 * Server-side only — import the dictionary for the given locale.
 * Falls back to the default locale if the requested one is not found.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    return (await import(`./dictionaries/${locale}.json`)).default as Dictionary;
  } catch {
    return (
      await import(`./dictionaries/${DEFAULT_LOCALE}.json`)
    ).default as Dictionary;
  }
}
