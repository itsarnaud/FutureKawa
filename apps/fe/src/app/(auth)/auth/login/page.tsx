import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <Card className="border shadow-md">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt={`${APP_NAME} logo`} width={48} height={48} />
        </div>
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" type="email" placeholder="nom@exemple.com" required />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="#" className="text-xs text-muted-foreground hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>

        <Button className="w-full mt-2" asChild>
          <Link href="/dashboard" className="flex justify-center">
            Se connecter
          </Link>
        </Button>

        <div className="text-center text-xs text-muted-foreground mt-2">
          Vous n&apos;avez pas de compte ?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-semibold">
            Créer un compte
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
