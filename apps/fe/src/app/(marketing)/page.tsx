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
        <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6 text-left">
            <Badge variant="outline" className="text-primary border-primary/25">
              Gestion simplifiée
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Votre café mérite une <span className="text-primary">gestion d&apos;exception</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stocks de grains, fiches clients, commandes de la journée — administrez votre établissement en toute simplicité.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="w-full max-w-[320px] rounded-xl border border-transparent bg-primary text-primary-foreground p-6 shadow-md transition-all duration-300">
              <div className="flex justify-between items-start border-b border-current/20 pb-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest opacity-80">Mélange Maison</span>
                  <h3 className="text-lg font-bold">FutureKawa Espresso</h3>
                </div>
                <Image src="/logo.png" alt="logo" width={32} height={32} className="opacity-90" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-80">Torréfaction</span>
                  <span className="font-semibold">Moyenne (Medium)</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">État Stock</span>
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">8 sacs restants</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Provenance</span>
                  <span className="font-semibold">Colombie & Éthiopie</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-current/20 text-center text-xs opacity-75">
                ✦ Mis à jour il y a 5 min ✦
              </div>
            </div>
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
                  className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10"
                >
                  <Icon className="size-5 text-primary" />
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
