"use client";

import { Suspense, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { APP_NAME } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await auth.login(email, password);
      setUser(user);
      // Full navigation (not router.push): the target route may have been
      // prefetched by Next's client router cache while logged out (e.g. the
      // marketing navbar's "Dashboard" link), which would cache the
      // middleware's redirect-to-login response. router.push can silently
      // reuse that stale cache entry instead of re-checking the fresh cookie.
      window.location.href = searchParams.get("callbackUrl") ?? "/dashboard";
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
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace {APP_NAME}.
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="#" className="text-xs text-muted-foreground hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          <div className="text-center text-xs text-muted-foreground mt-2">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-semibold">
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
