import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";

const stats = [
  { label: "Commandes", value: "—", icon: ShoppingBag, delta: null },
  { label: "Clients", value: "—", icon: Users, delta: null },
  { label: "Stocks", value: "—", icon: Package, delta: null },
  { label: "Revenu", value: "—", icon: TrendingUp, delta: null },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d&apos;ensemble de votre activité.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "#532a0e" }}
          />
          En ligne
        </Badge>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                À connecter via l&apos;API
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Les données s&apos;afficheront ici une fois l&apos;API connectée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
