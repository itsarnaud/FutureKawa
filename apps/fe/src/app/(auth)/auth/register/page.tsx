import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <Card className="border shadow-md">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt={`${APP_NAME} logo`} width={48} height={48} />
        </div>
        <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
        <CardDescription>
          Créez votre espace et commencez à gérer {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" placeholder="Jean Dupont" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" type="email" placeholder="nom@exemple.com" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" required />
        </div>

        <Button className="w-full mt-2" asChild>
          <Link href="/dashboard" className="flex justify-center">
            Créer mon compte
          </Link>
        </Button>

        <div className="text-center text-xs text-muted-foreground mt-2">
          Vous avez déjà un compte ?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
