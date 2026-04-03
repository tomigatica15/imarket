"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Star,
  CheckCircle,
  Minus,
  Plus,
  Zap,
  ChevronRight,
} from "lucide-react";
import type {
  Product,
  ProductImage,
  ProductVariant,
} from "@/lib/graphql/server";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart } from "@/hooks";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getPrimaryImage(product: Product): ProductImage | undefined {
  return product.images.find((img) => img.isPrimary) || product.images[0];
}

function getUniqueColors(variants: ProductVariant[]) {
  const colors = new Map<string, string>();
  variants.forEach((v) => {
    if (v.color && v.colorHex) {
      colors.set(v.color, v.colorHex);
    }
    if (v.attributes && typeof v.attributes === "object") {
      const attrs = v.attributes as Record<string, string>;
      if (attrs.color) {
        colors.set(attrs.color, attrs.colorHex || "#000000");
      }
    }
  });
  return Array.from(colors.entries());
}

function getStorageOptions(variants: ProductVariant[]) {
  const storages = new Set<string>();
  variants.forEach((v) => {
    if (v.attributes && typeof v.attributes === "object") {
      const attrs = v.attributes as Record<string, string>;
      if (attrs.storage) storages.add(attrs.storage);
    }
    if (v.size) storages.add(v.size);
  });
  return Array.from(storages);
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const router = useRouter();
  const { addItem, addItemByVariant } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const sortedImages = [...product.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const currentImage =
    sortedImages[selectedImageIndex] || getPrimaryImage(product);
  const colors = getUniqueColors(product.variants);
  const storages = getStorageOptions(product.variants);
  const activeVariant =
    product.variants.find((v) => v.isActive) || product.variants[0];
  const price = activeVariant?.price ?? product.basePrice;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const getSelectedVariant = () => {
    const color = selectedColor || (colors.length > 0 ? colors[0][0] : null);
    const storage =
      selectedStorage || (storages.length > 0 ? storages[0] : null);

    if (color || storage) {
      const match = product.variants.find((v) => {
        const attrs = v.attributes as Record<string, string> | null;
        const matchColor =
          !color || v.color === color || attrs?.color === color;
        const matchStorage =
          !storage || v.size === storage || attrs?.storage === storage;
        return matchColor && matchStorage && v.isActive;
      });
      if (match) return match;
    }
    return activeVariant;
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const variant = getSelectedVariant();
      if (variant) {
        await addItemByVariant(variant.id, quantity);
      } else {
        await addItem(product, quantity);
      }
      toast.success(`${product.name} agregado al carrito`);
    } catch {
      toast.error("No se pudo agregar al carrito");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      const variant = getSelectedVariant();
      if (variant) {
        await addItemByVariant(variant.id, quantity);
      } else {
        await addItem(product, quantity);
      }
      router.push("/checkout");
    } catch {
      toast.error("No se pudo procesar la compra");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-10 text-[11px] font-headline font-semibold uppercase tracking-widest text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-3 h-3" />
        {product.category && (
          <>
            <Link
              href={`/categoria/${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-on-surface">{product.name}</span>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-6">
          <div className="flex-1 aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-background group">
            {currentImage && (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                width={800}
                height={1000}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
            )}
          </div>
          {sortedImages.length > 1 && (
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-20 shrink-0 hide-scrollbar">
              {sortedImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-background shrink-0 transition-all ${
                    selectedImageIndex === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          {product.isNew && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-background text-on-surface text-[11px] font-bold uppercase tracking-widest rounded-full">
                Nuevo
              </span>
            </div>
          )}

          <h1 className="font-headline text-4xl lg:text-[40px] font-extrabold tracking-tight leading-tight mb-3 text-on-surface">
            {product.name}
          </h1>

          {product.brand && (
            <p className="text-sm text-on-surface-variant mb-2">
              Marca: <span className="font-semibold">{product.brand}</span>
            </p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center text-primary">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4"
                  fill={star <= 4 ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              4.8 (128 reseñas)
            </span>
          </div>

          <div className="mb-8 flex items-baseline gap-3">
            <span className="text-3xl font-headline font-bold text-on-surface">
              {formatPrice(price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > price && (
              <span className="text-lg text-on-surface-variant line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.description && (
            <div className="space-y-4 mb-10 text-on-surface-variant leading-relaxed text-sm">
              <p className="font-semibold text-on-surface mb-2">
                Características principales:
              </p>
              <ul className="space-y-3">
                {product.description
                  .split("\n")
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="space-y-8 mb-10">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-widest mb-4 text-on-surface-variant">
                  Color: {selectedColor || colors[0][0]}
                </span>
                <div className="flex gap-4">
                  {colors.map(([name, hex]) => (
                    <button
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                        (selectedColor || colors[0][0]) === name
                          ? "ring-2 ring-primary ring-offset-4"
                          : ""
                      }`}
                      style={{ backgroundColor: hex }}
                      title={name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Storage selector (for electronics) */}
          {storages.length > 0 && (
            <div className="mb-10">
              <span className="block text-[11px] font-bold uppercase tracking-widest mb-4 text-on-surface-variant">
                Almacenamiento
              </span>
              <div className="flex flex-wrap gap-3">
                {storages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      (selectedStorage || storages[0]) === storage
                        ? "bg-primary text-white"
                        : "bg-background text-on-surface hover:bg-outline/30"
                    }`}
                  >
                    {storage} GB
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-10">
            <span className="block text-[11px] font-bold uppercase tracking-widest mb-4 text-on-surface-variant">
              Cantidad
            </span>
            <div className="flex items-center bg-background w-fit rounded-full p-1.5 border border-outline/30">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface hover:text-primary transition-all active:scale-90"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface hover:text-primary transition-all active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stock urgency */}
          {totalStock > 0 && totalStock <= 10 && (
            <div className="mb-8 flex items-center gap-2 text-primary font-semibold text-sm">
              <Zap className="w-5 h-5" />
              <span>Últimas {totalStock} unidades disponibles en stock</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={handleBuyNow}
              disabled={isAdding || totalStock === 0}
              className="flex-1 rounded-full bg-primary text-white font-bold py-4 px-8 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {totalStock === 0 ? "Sin stock" : "Comprar ahora"}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || totalStock === 0}
              className="flex-1 rounded-full bg-background text-on-surface font-bold py-4 px-8 hover:bg-outline/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar al carrito
            </button>
          </div>

          {/* Payment info */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-outline/30">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant w-full mb-1">
              Pago seguro garantizado
            </span>
            <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold px-3 py-1 bg-background rounded-full">
                VISA
              </span>
              <span className="text-[10px] font-bold px-3 py-1 bg-background rounded-full">
                MASTERCARD
              </span>
              <span className="text-[10px] font-bold px-3 py-1 bg-background rounded-full">
                MERCADO PAGO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-16">
            También te podría gustar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
