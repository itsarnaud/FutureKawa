import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  { id: "CMD-001", client: "Marie Martin", date: "2026-05-25", total: "124,50 €", status: "Livrée", statusColor: "default" },
  { id: "CMD-002", client: "Thomas Dubois", date: "2026-05-25", total: "45,00 €", status: "En cours", statusColor: "secondary" },
  { id: "CMD-003", client: "Sophie Lefevre", date: "2026-05-24", total: "89,90 €", status: "Payée", statusColor: "outline" },
  { id: "CMD-004", client: "Nicolas Leroy", date: "2026-05-23", total: "210,00 €", status: "Annulée", statusColor: "destructive" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commandes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez et suivez les commandes de vos clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des commandes</CardTitle>
          <CardDescription>
            Liste récente des transactions effectuées sur votre boutique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground font-medium">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4 font-mono font-medium">{order.id}</td>
                    <td className="py-3 pr-4">{order.client}</td>
                    <td className="py-3 pr-4">{order.date}</td>
                    <td className="py-3 pr-4 font-semibold">{order.total}</td>
                    <td className="py-3 text-right">
                      <Badge variant={order.statusColor as any}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
