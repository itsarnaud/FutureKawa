"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { APP_NAME } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/stores/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await auth.register(email, password, name);
      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>

          <div className="text-center text-xs text-muted-foreground mt-2">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
