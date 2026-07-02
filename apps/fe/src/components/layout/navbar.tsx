import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="sticky top-4 z-50 border border-primary/10 bg-background/95 backdrop-blur-md shadow-md mx-auto max-w-5xl rounded-full h-16 transition-all duration-300">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt={`${APP_NAME} logo`} width={30} height={30} className="shrink-0" />
          <span className="text-base font-bold tracking-tight text-primary">{APP_NAME}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {link.labelFr}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
