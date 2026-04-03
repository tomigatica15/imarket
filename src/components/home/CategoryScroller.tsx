import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/graphql/server";

interface CategoryScrollerProps {
  categories: Category[];
}

export function CategoryScroller({ categories }: CategoryScrollerProps) {
  const activeCategories = categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (activeCategories.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="px-8 max-w-7xl mx-auto flex items-end justify-between mb-8">
        <h2 className="font-headline text-2xl font-bold tracking-tight">
          Categorías
        </h2>
        <Link
          href="/categorias"
          className="text-primary font-bold text-sm hover:opacity-70 transition-opacity"
        >
          Ver todo
        </Link>
      </div>
      <div className="flex overflow-x-auto gap-10 px-8 max-w-7xl mx-auto hide-scrollbar snap-x">
        {activeCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categoria/${category.slug}`}
            className="flex-none snap-start group cursor-pointer text-center"
          >
            <div className="w-20 h-20 rounded-full bg-background mb-3 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-2xl text-on-surface-variant">
                  category
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-on-surface-variant group-hover:text-primary transition-colors uppercase">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
