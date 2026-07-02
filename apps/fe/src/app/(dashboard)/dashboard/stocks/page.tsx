import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockInventory = [
  { sku: "CAFE-001", name: "Café Grain Arabica 1kg", stock: 45, unit: "sacs", status: "En stock", statusColor: "default" },
  { sku: "CAFE-002", name: "Café Grain Robusta 1kg", stock: 8, unit: "sacs", status: "Stock Bas", statusColor: "destructive" },
  { sku: "ACC-001", name: "Tasses en Céramique FutureKawa", stock: 120, unit: "unités", status: "En stock", statusColor: "default" },
  { sku: "ACC-002", name: "Filtres en papier (boîte de 100)", stock: 3, unit: "boîtes", status: "Rupture imminente", statusColor: "destructive" },
];

export default function StocksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stocks & Inventaire</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez les niveaux de stock en temps réel de vos produits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">État des stocks</CardTitle>
          <CardDescription>
            Aperçu des quantités de produits disponibles et alertes d&apos;approvisionnement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground font-medium">
                  <th className="pb-3 pr-4">SKU</th>
                  <th className="pb-3 pr-4">Produit</th>
                  <th className="pb-3 pr-4">Quantité</th>
                  <th className="pb-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockInventory.map((item) => (
                  <tr key={item.sku} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4 font-mono font-medium">{item.sku}</td>
                    <td className="py-3 pr-4">{item.name}</td>
                    <td className="py-3 pr-4">
                      <span className="font-semibold">{item.stock}</span> {item.unit}
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={item.statusColor as any}>
                        {item.status}
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
