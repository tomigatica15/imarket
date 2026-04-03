import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/graphql/server";
import { Navbar, BottomNav, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Categorías - iMarket",
  description:
    "Explorá nuestras categorías de tecnología, celulares y accesorios.",
};

export default async function CategoriasPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  const activeCategories = categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-10">
          Categorías
        </h1>

        {activeCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {activeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="group"
              >
                <div className="aspect-square rounded-2xl bg-background overflow-hidden mb-4 transition-transform group-hover:scale-[0.98]">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-on-surface-variant">
                        category
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-headline font-bold text-lg group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-on-surface-variant mt-1">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">
              No hay categorías disponibles.
            </p>
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
