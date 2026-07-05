import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="size-3.5" /> Retour à l&apos;accueil
        </Link>

        {children}
      </div>
    </div>
  );
}
