import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const features = [
  {
    icon: BarChart3,
    title: "Tableau de bord",
    description: "Visualisez vos performances en temps réel.",
  },
  {
    icon: ShoppingBag,
    title: "Gestion des commandes",
    description: "Suivez et gérez toutes vos commandes depuis un seul endroit.",
  },
  {
    icon: Users,
    title: "Gestion des clients",
    description: "Centralisez les informations de vos clients.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <Badge variant="outline" className="mb-6">
            Gestion simplifiée ✦
          </Badge>

          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt={`${APP_NAME} logo`}
              width={96}
              height={96}
            />
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Bienvenue sur{" "}
            <span style={{ color: "#532a0e" }}>{APP_NAME}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
            Gérez votre activité depuis un seul endroit. Commandes, clients,
            stocks — tout en un.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" style={{ backgroundColor: "#532a0e" }}>
              <Link href="/dashboard" className="gap-2">
                Accéder au dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/a-propos">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-3 text-muted-foreground">
            Une plateforme complète pour gérer votre activité au quotidien.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <div
                  className="mb-4 inline-flex size-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#532a0e1a" }}
                >
                  <Icon className="size-5" style={{ color: "#532a0e" }} />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
