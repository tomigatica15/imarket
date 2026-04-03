import { Navbar, BottomNav, Footer } from "@/components/layout";
import {
  HeroSection,
  CategoryScroller,
  ProductGrid,
  BenefitsSection,
} from "@/components/home";
import {
  getProducts,
  getCategories,
  getHeroBanners,
} from "@/lib/graphql/server";

import type {
  Product,
  Category,
  Banner,
  PaginationMeta,
} from "@/lib/graphql/server";

export default async function HomePage() {
  let products: { items: Product[]; meta: PaginationMeta } = {
    items: [],
    meta: { total: 0, page: 1, limit: 8, totalPages: 0 },
  };
  let categories: Category[] = [];
  let banners: Banner[] = [];

  try {
    [products, categories, banners] = await Promise.all([
      getProducts({ limit: 8 }),
      getCategories(),
      getHeroBanners(),
    ]);
  } catch {
    // keep defaults
  }

  const featuredProducts = products.items.filter((p) => p.isFeatured);
  const newProducts = products.items.filter((p) => p.isNew);

  return (
    <>
      <Navbar />
      <main className="pt-16 pb-32 bg-white">
        <HeroSection banners={banners} />
        <CategoryScroller categories={categories} />

        {featuredProducts.length > 0 && (
          <ProductGrid
            title="Más vendidos"
            subtitle="Lo más top"
            products={featuredProducts.slice(0, 4)}
          />
        )}

        {newProducts.length > 0 && (
          <ProductGrid
            title="Últimas novedades"
            subtitle="Recién llegados"
            products={newProducts.slice(0, 4)}
          />
        )}

        {products.items.length > 0 && featuredProducts.length === 0 && (
          <ProductGrid
            title="Nuestros productos"
            subtitle="Tecnología"
            products={products.items.slice(0, 8)}
          />
        )}

        <BenefitsSection />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
