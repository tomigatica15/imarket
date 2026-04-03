"use client";

import { useEffect, useMemo, useCallback } from "react";
import {
  useCartQuery,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart as useClearCartGraphQL,
  useApplyCoupon as useApplyCouponGraphQL,
  useRemoveCoupon as useRemoveCouponGraphQL,
  type Cart as GraphQLCart,
  type CartItem as GraphQLCartItem,
} from "@/lib/graphql/cart";
import { useMockCart, clearMockCartStorage } from "./useMockCart";
import type { Product } from "@/lib/graphql/server";

const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_PRODUCTS === "true";

interface LocalCartItem {
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

interface LocalCart {
  items: LocalCartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
}

function transformCartItem(gqlItem: GraphQLCartItem): LocalCartItem {
  const variantStock = gqlItem.variant?.stock || 0;
  const stockMultiplier = gqlItem.variant?.stockMultiplier || 1;
  const maxQuantity = Math.floor(variantStock / stockMultiplier);

  return {
    id: gqlItem.id,
    product: {
      id: gqlItem.product?.id || "",
      name: gqlItem.product?.name || "",
      slug: gqlItem.product?.slug || "",
      image: gqlItem.product?.image?.url || "",
      price: gqlItem.unitPrice,
    },
    quantity: gqlItem.quantity,
    variant: gqlItem.variant?.color || gqlItem.variant?.size,
    maxQuantity,
  };
}

function transformCart(gqlCart: GraphQLCart | null): LocalCart {
  if (!gqlCart) {
    return { items: [], subtotal: 0, shipping: 0, discount: 0, total: 0 };
  }

  return {
    items: gqlCart.items?.map(transformCartItem) || [],
    subtotal: gqlCart.subtotal || 0,
    shipping: gqlCart.shipping || gqlCart.shippingCost || 0,
    discount: gqlCart.discount || 0,
    total: gqlCart.total || 0,
    couponCode: gqlCart.couponCode || gqlCart.promotionCode,
  };
}

// Internal hook: GraphQL-backed cart
function useGQLCart(skip: boolean) {
  const { cart: gqlCart, loading, error, refetch } = useCartQuery({ skip });
  const { addToCart: addToCartMutation, loading: addLoading } = useAddToCart();
  const { updateCartItem: updateCartItemMutation, loading: updateLoading } =
    useUpdateCartItem();
  const { removeCartItem: removeCartItemMutation, loading: removeLoading } =
    useRemoveCartItem();
  const { clearCart: clearCartMutation, loading: clearLoading } =
    useClearCartGraphQL();
  const { applyCoupon: applyCouponMutation, loading: couponLoading } =
    useApplyCouponGraphQL();
  const { removeCoupon: removeCouponMutation } = useRemoveCouponGraphQL();

  const cart = useMemo(() => transformCart(gqlCart || null), [gqlCart]);

  const addItem = useCallback(
    async (product: Product, quantity: number = 1, variantId?: string) => {
      const effectiveVariantId = variantId || product.variants?.[0]?.id;
      if (!effectiveVariantId) {
        console.warn("No variant available for product:", product.id);
        return;
      }
      await addToCartMutation(effectiveVariantId, quantity);
    },
    [addToCartMutation],
  );

  const addItemByVariant = useCallback(
    async (variantId: string, quantity: number = 1) => {
      await addToCartMutation(variantId, quantity);
    },
    [addToCartMutation],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await removeCartItemMutation(itemId);
    },
    [removeCartItemMutation],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      const item = cart.items.find((i) => i.id === itemId);
      const maxQuantity = item?.maxQuantity || 99;
      const validQuantity = Math.min(quantity, maxQuantity);
      await updateCartItemMutation(itemId, validQuantity);
    },
    [cart.items, updateCartItemMutation],
  );

  const incrementQuantity = useCallback(
    async (itemId: string) => {
      const item = cart.items.find((i) => i.id === itemId);
      if (!item) return;
      if (item.quantity >= item.maxQuantity) return;
      await updateQuantity(itemId, item.quantity + 1);
    },
    [cart.items, updateQuantity],
  );

  const decrementQuantity = useCallback(
    async (itemId: string) => {
      const item = cart.items.find((i) => i.id === itemId);
      if (!item || item.quantity <= 1) return;
      await updateQuantity(itemId, item.quantity - 1);
    },
    [cart.items, updateQuantity],
  );

  const clearCart = useCallback(async () => {
    await clearCartMutation();
  }, [clearCartMutation]);

  const applyCoupon = useCallback(
    async (code: string) => {
      await applyCouponMutation(code);
    },
    [applyCouponMutation],
  );

  const removeCoupon = useCallback(async () => {
    await removeCouponMutation();
  }, [removeCouponMutation]);

  const itemCount = useMemo(
    () => cart.items.reduce((acc, item) => acc + item.quantity, 0),
    [cart.items],
  );

  const isLoading =
    loading || addLoading || updateLoading || removeLoading || clearLoading;

  return {
    cart,
    items: cart.items,
    itemCount,
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    discount: cart.discount,
    total: cart.total,
    couponCode: cart.couponCode,
    loading: isLoading,
    error,
    addItem,
    addItemByVariant,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    couponLoading,
    refetch,
  };
}

// Public hook: delegates to mock (localStorage) or GraphQL based on build flag
export function useCart() {
  // Both hooks always called — required by rules of hooks
  // GQL query is skipped in mock mode; mock cart logic is a noop in real mode
  const mockCart = useMockCart();
  const gqlCart = useGQLCart(USE_MOCK);

  // When using real mode: clear any leftover mock cart from localStorage
  useEffect(() => {
    if (!USE_MOCK) {
      clearMockCartStorage();
    }
  }, []);

  return USE_MOCK ? mockCart : gqlCart;
}
