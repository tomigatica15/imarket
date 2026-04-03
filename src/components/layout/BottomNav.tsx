"use client";

import Link from "next/link";
import { Home, Search, Heart, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/buscar", icon: Search, label: "Buscar" },
  { href: "/favoritos", icon: Heart, label: "Favoritos" },
  { href: "/carrito", icon: ShoppingCart, label: "Bolsa" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 ios-glass rounded-t-xl px-4 pb-4 pt-4 flex justify-around items-center shadow-[0_-8px_48px_rgba(26,28,31,0.06)]">
      {items.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center justify-center px-6 py-2 active:scale-90 transition-all",
              isActive
                ? "bg-primary/10 text-primary rounded-full"
                : "text-on-surface-variant hover:bg-background rounded-full",
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-headline text-[10px] font-bold uppercase tracking-tight mt-1">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
