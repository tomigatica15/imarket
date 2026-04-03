"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/graphql/server";
import { useCart } from "@/hooks";

function getPrimaryImage(product: Product) {
  const primary = product.images.find((img) => img.isPrimary);
  return primary || product.images[0];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

interface ProductCardProps {
  product: Product;
  badge?: string;
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { addItem } = useCart();
  const image = getPrimaryImage(product);
  const price = product.variants[0]?.price ?? product.basePrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product, 1);
      toast.success(`${product.name} agregado al carrito`);
    } catch {
      toast.error("No se pudo agregar al carrito");
    }
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative bg-background rounded-xl overflow-hidden mb-5 aspect-[4/5] shadow-sm">
        {image && (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="bg-error px-3 py-1 text-white text-[10px] font-bold rounded-full">
              {badge}
            </span>
          </div>
        )}
        {product.isNew && !badge && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary px-3 py-1 text-white text-[10px] font-bold rounded-full">
              NUEVO
            </span>
          </div>
        )}
      </div>
      <div className="px-1 flex flex-col flex-1">
        <h3 className="font-headline font-bold text-base mb-1">
          {product.name}
        </h3>
        <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
          {product.shortDescription || product.brand || ""}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-on-surface">
              {formatPrice(price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > price && (
              <span className="text-sm text-on-surface-variant line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
