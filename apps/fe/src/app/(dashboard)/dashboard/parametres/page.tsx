import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez la configuration de votre espace {APP_NAME}.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations de l&apos;entreprise</CardTitle>
              <CardDescription>
                Configurez les détails publics associés à votre espace de gestion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                <Input id="companyName" defaultValue={APP_NAME} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyEmail">Email de contact</Label>
                <Input id="companyEmail" type="email" defaultValue="contact@futurekawa.fr" />
              </div>
              <Button>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Préférences de notifications</CardTitle>
              <CardDescription>
                Choisissez les alertes que vous souhaitez recevoir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Nouvelles commandes</p>
                  <p className="text-xs text-muted-foreground">Recevoir une alerte e-mail pour chaque vente</p>
                </div>
                <Badge variant="outline">Activé</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Rapports de ventes hebdomadaires</p>
                  <p className="text-xs text-muted-foreground">Un digest hebdomadaire de l&apos;activité</p>
                </div>
                <Badge variant="secondary">Mensuel</Badge>
              </div>
              <Button>Sauvegarder les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="securite" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sécurité du compte</CardTitle>
              <CardDescription>
                Mettez à jour vos identifiants d&apos;accès.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>
              <Button>Mettre à jour le mot de passe</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
