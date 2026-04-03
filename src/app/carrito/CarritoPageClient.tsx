"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar, Footer, BottomNav } from "@/components/layout";
import { useCart, useApplyCoupon, useRemoveCoupon } from "@/hooks";
import {
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  X,
  Minus,
  Plus,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CarritoPageClient() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    couponCode,
    incrementQuantity,
    decrementQuantity,
    removeItem,
  } = useCart();

  const { applyCoupon, loading: applyingCoupon } = useApplyCoupon();
  const { removeCoupon, loading: removingCoupon } = useRemoveCoupon();

  const [couponInput, setCouponInput] = useState("");
  const couponPattern = /^[A-Z0-9-]{3,20}$/;

  const handleApplyCoupon = async () => {
    const cleaned = couponInput.trim().toUpperCase();
    if (!cleaned) {
      toast.error("Ingresá un código de cupón");
      return;
    }
    if (!couponPattern.test(cleaned)) {
      toast.error("Código inválido (3-20 caracteres, solo letras y números)");
      return;
    }
    try {
      await applyCoupon(cleaned);
      toast.success("¡Cupón aplicado correctamente!");
      setCouponInput("");
    } catch {
      toast.error("Cupón inválido o expirado");
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      toast.success("Cupón removido");
    } catch {
      toast.error("Error al remover el cupón");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="md:hidden flex items-center px-4 pt-6 pb-2 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-6 font-headline">
            Carrito
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <ShoppingCart className="w-20 h-20 text-outline/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Tu carrito está vacío</h3>
          <p className="text-on-surface-variant mb-6">
            Agregá algunos productos para comenzar
          </p>
          <Link
            href="/"
            className="h-12 px-8 bg-primary text-white font-bold rounded-xl flex items-center justify-center hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Explorar productos
          </Link>
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pb-0">
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
          Carrito
        </h2>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-4 md:pt-8">
        <h1 className="hidden md:block text-3xl font-extrabold mb-8 font-headline">
          Carrito de Compras
        </h1>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          {/* Product List */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-outline/10 relative"
              >
                {/* Product Image */}
                <Link
                  href={`/producto/${item.product.slug}`}
                  className="rounded-lg size-20 shrink-0 overflow-hidden relative bg-background"
                >
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline/30">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex flex-col flex-1">
                  <Link
                    href={`/producto/${item.product.slug}`}
                    className="font-bold text-base leading-tight line-clamp-1 hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-on-surface-variant text-sm mb-2">
                      {item.variant}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-primary font-bold text-lg">
                      {formatPrice(item.product.price)}
                    </p>
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-background flex items-center justify-center hover:bg-outline/10 transition-colors disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-8 h-8 rounded-lg bg-background flex items-center justify-center hover:bg-outline/10 transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 text-on-surface-variant hover:text-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="mb-6 bg-white rounded-xl p-5 shadow-sm space-y-3 border border-outline/10">
              <div className="flex justify-between items-center">
                <p className="text-on-surface-variant font-medium">Subtotal</p>
                <p className="font-bold">{formatPrice(subtotal)}</p>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-emerald-600 font-medium flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Descuento
                  </p>
                  <p className="font-bold text-emerald-600">
                    -{formatPrice(discount)}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-on-surface-variant font-medium">Envío</p>
                <p
                  className={`font-bold ${shipping === 0 ? "text-emerald-600" : ""}`}
                >
                  {shipping === 0 ? "A calcular" : formatPrice(shipping)}
                </p>
              </div>

              <div className="h-px bg-outline/10 my-2" />

              <div className="flex justify-between items-center">
                <p className="text-lg font-extrabold">Total</p>
                <p className="text-2xl font-black text-primary">
                  {formatPrice(total)}
                </p>
              </div>

              {/* Desktop Checkout Button */}
              <div className="hidden md:block pt-4">
                <Link
                  href="/checkout"
                  className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all text-lg"
                >
                  Continuar al Pago
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="flex flex-col w-full">
              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-2 px-1">
                Cupón de descuento
              </p>

              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-700">
                      {couponCode}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    disabled={removingCoupon}
                    className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
                  >
                    {removingCoupon ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex w-full items-stretch shadow-sm">
                  <input
                    className="flex-1 rounded-l-xl border border-outline/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary h-14 placeholder:text-on-surface-variant p-4 text-base font-medium uppercase"
                    placeholder="Ingresá tu código"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
                      )
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    disabled={applyingCoupon}
                    maxLength={20}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="bg-on-surface text-white px-6 rounded-r-xl font-bold text-sm uppercase hover:bg-on-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
                  >
                    {applyingCoupon ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mx-auto" />
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block mt-12">
        <Footer />
      </div>

      {/* Fixed Bottom Button - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-outline/10 md:hidden z-10">
        <Link
          href="/checkout"
          className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg active:scale-[0.98] transition-all"
        >
          Continuar al pago
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="h-4" />
      </div>

      {/* Mobile Bottom Nav (hidden when cart has items - using fixed button instead) */}
    </div>
  );
}
