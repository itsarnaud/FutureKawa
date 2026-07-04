import type { ApiError } from "@/types";

export function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  ) {
    return (error as ApiError).message;
  }
  return "Une erreur inattendue est survenue.";
}
