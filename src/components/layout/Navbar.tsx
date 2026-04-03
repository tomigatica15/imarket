"use client";

import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";
import { useCart, useAuth } from "@/hooks";

export function Navbar() {
  const { itemCount } = useCart();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 ios-glass h-16 flex items-center justify-between px-8 shadow-[0_4px_24px_rgba(26,28,31,0.04)]">
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tighter text-on-surface font-headline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 814 1000"
            className="w-5 h-5 fill-current"
            aria-hidden="true"
          >
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.6-150.3-109.2c-52.9-77.7-96.7-198.8-96.7-314.5 0-208.8 136.3-319.1 270.8-319.1 67.2 0 123.1 44.3 164.7 44.3 39.5 0 101.1-47 176.3-47 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
          </svg>
          iMarket
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-primary font-headline"
          >
            Explorar
          </Link>
          <Link
            href="/categorias"
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-all font-headline"
          >
            Categorías
          </Link>
          <Link
            href="/productos"
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-all font-headline"
          >
            Novedades
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/buscar"
          className="p-1 hover:opacity-70 transition-opacity active:scale-95"
        >
          <Search className="w-5 h-5 text-on-surface" />
        </Link>
        <Link
          href="/carrito"
          className="p-1 hover:opacity-70 transition-opacity active:scale-95 relative"
        >
          <ShoppingBag className="w-5 h-5 text-on-surface" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
        <Link
          href={user ? "/perfil" : "/login"}
          className="p-1 hover:opacity-70 transition-opacity active:scale-95"
        >
          <User className="w-5 h-5 text-on-surface" />
        </Link>
      </div>
    </nav>
  );
}
