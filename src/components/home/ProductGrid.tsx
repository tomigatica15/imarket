import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/graphql/server";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function ProductGrid({ title, subtitle, products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-8 max-w-7xl mx-auto mb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          {subtitle && (
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="font-headline text-3xl font-extrabold tracking-tight">
            {title}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            badge={product.isFeatured ? "POPULAR" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
