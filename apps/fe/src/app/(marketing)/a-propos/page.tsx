import { APP_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          À propos de{" "}
          <span style={{ color: "#532a0e" }}>{APP_NAME}</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {/* À compléter */}
          Contenu à venir.
        </p>
      </div>
    </div>
  );
}
