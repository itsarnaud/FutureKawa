import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-lg">
        <Card className="border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Contactez-nous</CardTitle>
            <CardDescription>
              Une question sur {APP_NAME} ? Notre équipe est là pour vous aider.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="Jean Dupont" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jean.dupont@example.com" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Votre message ici..."
              />
            </div>

            <Button className="w-full">
              Envoyer le message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
