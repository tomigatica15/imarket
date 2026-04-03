"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BottomNav, Navbar, Footer } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { useFavorites } from "@/hooks";
import { useQuery } from "@apollo/client/react";
import { PRODUCTS_QUERY } from "@/lib/graphql/queries";
import type { Product } from "@/lib/graphql/server";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";

interface ProductsQueryData {
  products: {
    items: Product[];
  };
}

export default function FavoritosPageClient() {
  const router = useRouter();
  const { favorites, clearFavorites, count } = useFavorites();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch products matching favorite IDs
  const { data, loading } = useQuery<ProductsQueryData>(PRODUCTS_QUERY, {
    variables: {
      filter: { ids: favorites },
      pagination: { page: 1, limit: 50 },
    },
    skip: !hasMounted || favorites.length === 0,
    fetchPolicy: "cache-first",
  });

  const products = data?.products?.items || [];

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-on-surface-variant">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center px-4 pt-6 pb-2 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center font-headline">
          Favoritos
        </h2>
        {count > 0 && (
          <button
            onClick={clearFavorites}
            className="text-on-surface-variant hover:text-error transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-4 md:pt-8">
        <div className="hidden md:flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold font-headline">
            Mis Favoritos
          </h1>
          {count > 0 && (
            <button
              onClick={clearFavorites}
              className="text-sm text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar todo
            </button>
          )}
        </div>

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-20 h-20 text-outline/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              No tenés favoritos todavía
            </h3>
            <p className="text-on-surface-variant mb-6">
              Explorá productos y tocá el corazón para guardarlos
            </p>
            <Link
              href="/"
              className="h-12 px-8 bg-primary text-white font-bold rounded-xl flex items-center justify-center hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Explorar productos
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-on-surface-variant text-sm">
              Cargando favoritos...
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-on-surface-variant mb-4">
              {products.length} producto{products.length !== 1 ? "s" : ""}{" "}
              guardado{products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block mt-12">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
