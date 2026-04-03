"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BottomNav, Navbar, Footer } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { useProductSearch } from "@/hooks";
import { Search, ArrowLeft, X, TrendingUp, Clock } from "lucide-react";

const searchTrends = [
  { id: "1", term: "iPhone 16" },
  { id: "2", term: "MacBook" },
  { id: "3", term: "AirPods" },
  { id: "4", term: "iPad" },
  { id: "5", term: "Apple Watch" },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const { products: searchResults, loading } = useProductSearch(query);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.length >= 2) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isSearching = query.length >= 2;

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
        <h2 className="text-lg font-bold flex-1 text-center pr-6 font-headline">
          Explorar
        </h2>
      </div>

      <main className="max-w-7xl mx-auto">
        <h1 className="hidden md:block text-3xl font-extrabold px-4 pt-8 pb-4 font-headline">
          Buscar Productos
        </h1>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center w-full h-12 md:h-14 bg-background rounded-xl px-4 gap-3 border-2 border-transparent focus-within:border-primary/30 transition-all md:max-w-2xl">
            <Search className="w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar productos Apple..."
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant"
              autoFocus
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  router.push("/buscar");
                }}
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div className="px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-on-surface-variant text-sm">Buscando...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <p className="text-sm text-on-surface-variant mb-4">
                  {searchResults.length} resultados para &quot;{query}&quot;
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-16 h-16 text-outline/30 mb-4" />
                <h3 className="text-lg font-bold mb-2">Sin resultados</h3>
                <p className="text-on-surface-variant">
                  No encontramos productos para &quot;{query}&quot;
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search Trends */}
            <div className="mt-4">
              <h3 className="text-lg font-bold px-4 pb-3 font-headline flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Tendencias de Búsqueda
              </h3>
              <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-2">
                {searchTrends.map((trend) => (
                  <button
                    key={trend.id}
                    onClick={() => handleSearch(trend.term)}
                    className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border-2 border-primary bg-primary/5 px-5 active:scale-95 transition-transform"
                  >
                    <p className="text-primary text-sm font-semibold">
                      {trend.term}
                    </p>
                  </button>
                ))}
              </div>
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

export default function BuscarPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant">
            Cargando...
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
