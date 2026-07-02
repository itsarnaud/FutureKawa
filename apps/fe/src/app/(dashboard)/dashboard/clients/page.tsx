import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockClients = [
  { id: "CL-001", name: "Marie Martin", email: "marie.martin@example.com", ordersCount: 12, spent: "1 240,50 €" },
  { id: "CL-002", name: "Thomas Dubois", email: "thomas.dubois@example.com", ordersCount: 4, spent: "245,00 €" },
  { id: "CL-003", name: "Sophie Lefevre", email: "sophie.lefevre@example.com", ordersCount: 8, spent: "689,90 €" },
  { id: "CL-004", name: "Nicolas Leroy", email: "nicolas.leroy@example.com", ordersCount: 1, spent: "210,00 €" },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez votre base de clients et consultez leur historique d&apos;achats.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des clients</CardTitle>
          <CardDescription>
            Informations de contact et volume d&apos;activité par client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground font-medium">
                  <th className="pb-3 pr-4">Nom</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Commandes</th>
                  <th className="pb-3 text-right">Total dépensé</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockClients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4 font-medium">{client.name}</td>
                    <td className="py-3 pr-4 font-mono text-muted-foreground text-xs">{client.email}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="secondary" className="font-semibold">
                        {client.ordersCount} cmd
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-semibold">{client.spent}</td>
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
