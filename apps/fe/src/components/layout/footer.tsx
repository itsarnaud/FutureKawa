import Image from "next/image";
import Link from "next/link";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={`${APP_NAME} logo`}
              width={28}
              height={28}
            />
            <span className="font-semibold" style={{ color: "#532a0e" }}>
              {APP_NAME}
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.labelFr}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            &copy; {year} {APP_NAME}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
