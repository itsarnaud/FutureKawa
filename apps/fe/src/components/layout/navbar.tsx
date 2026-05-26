import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt={`${APP_NAME} logo`}
            width={36}
            height={36}
            className="shrink-0"
          />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "#532a0e" }}
          >
            {APP_NAME}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.labelFr}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button asChild size="sm" style={{ backgroundColor: "#532a0e" }}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
