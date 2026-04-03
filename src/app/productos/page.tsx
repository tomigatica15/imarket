import type { Metadata } from "next";
import { getProducts } from "@/lib/graphql/server";
import { Navbar, BottomNav, Footer } from "@/components/layout";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Productos - iMarket",
  description:
    "Explorá todos nuestros productos de tecnología, celulares y accesorios.",
};

export default async function ProductosPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = {
    items: [],
    meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
  };

  try {
    products = await getProducts({ limit: 20 });
  } catch {
    // keep default
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">
            Todos los productos
          </h1>
          <p className="text-on-surface-variant">
            {products.meta.total} productos disponibles
          </p>
        </div>

        {products.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
