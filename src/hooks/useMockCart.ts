"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getMockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/graphql/server";

export const MOCK_CART_KEY = "imarket_mock_cart";
export const MOCK_MODE_KEY = "imarket_cart_mode";

export interface MockCartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
  };
  quantity: number;
  variant?: string;
  maxQuantity: number;
}

function readFromStorage(): MockCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(MOCK_CART_KEY);
    return stored ? (JSON.parse(stored) as MockCartItem[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: MockCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_MODE_KEY, "mock");
    localStorage.setItem(MOCK_CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function clearMockCartStorage() {
  if (typeof window === "undefined") return;
  try {
    const mode = localStorage.getItem(MOCK_MODE_KEY);
    if (mode === "mock") {
      localStorage.removeItem(MOCK_CART_KEY);
      localStorage.removeItem(MOCK_MODE_KEY);
    }
  } catch {
    // ignore
  }
}

export function useMockCart() {
  const [items, setItems] = useState<MockCartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(readFromStorage());
    setInitialized(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (initialized) {
      writeToStorage(items);
    }
  }, [items, initialized]);

  const addItem = useCallback(
    async (product: Product, quantity: number = 1, variantId?: string) => {
      const effectiveVariantId = variantId || product.variants?.[0]?.id;
      const variant = product.variants?.find(
        (v) => v.id === effectiveVariantId,
      );
      const itemId = `${product.id}_${effectiveVariantId ?? product.id}`;
      const price = variant?.price ?? product.basePrice;
      const image =
        product.images?.find((img) => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        "";
      const variantLabel = variant?.color || variant?.size;

      setItems((prev) => {
        const existing = prev.find((i) => i.id === itemId);
        if (existing) {
          return prev.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [
          ...prev,
          {
            id: itemId,
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image,
              price,
            },
            quantity,
            variant: variantLabel,
            maxQuantity: variant?.stock ?? 99,
          },
        ];
      });
    },
    [],
  );

  const addItemByVariant = useCallback(
    async (variantId: string, quantity: number = 1) => {
      const allProducts = getMockProducts().items;
      const product = allProducts.find((p) =>
        p.variants.some((v) => v.id === variantId),
      );
      if (product) await addItem(product, quantity, variantId);
    },
    [addItem],
  );

  const removeItem = useCallback(async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) => {
        const item = prev.find((i) => i.id === itemId);
        const max = item?.maxQuantity ?? 99;
        const valid = Math.min(quantity, max);
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: valid } : i,
        );
      });
    },
    [],
  );

  const incrementQuantity = useCallback(async (itemId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item || item.quantity >= item.maxQuantity) return prev;
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
      );
    });
  }, []);

  const decrementQuantity = useCallback(async (itemId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item || item.quantity <= 1) return prev;
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const clearCart = useCallback(async () => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items],
  );

  const total = subtotal;

  return {
    cart: { items, subtotal, shipping: 0, discount: 0, total },
    items,
    itemCount,
    subtotal,
    shipping: 0,
    discount: 0,
    total,
    couponCode: undefined as string | undefined,
    loading: !initialized,
    error: undefined,
    addItem,
    addItemByVariant,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    applyCoupon: async (_code: string) => {},
    removeCoupon: async () => {},
    couponLoading: false,
    refetch: async () => {},
  };
}
