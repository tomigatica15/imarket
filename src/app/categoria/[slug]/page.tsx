import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts, getCategoryBySlug } from "@/lib/graphql/server";
import { Navbar, BottomNav, Footer } from "@/components/layout";
import { ProductCard } from "@/components/product/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  const name = category?.name ?? slug;
  return {
    title: `${name} - iMarket`,
    description:
      category?.description ??
      `Explorá todos los productos de ${name} en iMarket.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug).catch(() => null),
    getProducts({ categorySlug: slug, limit: 40 }).catch(() => ({
      items: [],
      meta: { total: 0, page: 1, limit: 40, totalPages: 0 },
    })),
  ]);

  const name = category?.name ?? slug;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/categorias"
            className="hover:text-primary transition-colors"
          >
            Categorías
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-on-surface font-medium">{name}</span>
        </nav>

        <div className="mb-10">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">
            {name}
          </h1>
          {category?.description && (
            <p className="text-on-surface-variant max-w-xl">
              {category.description}
            </p>
          )}
          <p className="text-on-surface-variant text-sm mt-2">
            {products.meta.total}{" "}
            {products.meta.total === 1 ? "producto" : "productos"}
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
            <p className="text-on-surface-variant text-lg mb-4">
              No hay productos en esta categoría por el momento.
            </p>
            <Link
              href="/categorias"
              className="text-primary font-semibold hover:underline"
            >
              Ver todas las categorías
            </Link>
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
