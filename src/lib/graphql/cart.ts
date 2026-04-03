"use client";

import { gql } from "@apollo/client/core";
import { useQuery, useMutation } from "@apollo/client/react";
import { useCallback } from "react";

// ============================================================================
// Fragments
// ============================================================================

const CART_ITEM_FRAGMENT = gql`
  fragment CartItemFields on CartItemType {
    id
    variantId
    quantity
    unitPrice
    totalPrice
    product {
      id
      name
      slug
      image {
        id
        url
        alt
        sortOrder
        isPrimary
      }
    }
    variant {
      id
      sku
      size
      color
      stock
      stockMultiplier
      productId
    }
  }
`;

const CART_FRAGMENT = gql`
  ${CART_ITEM_FRAGMENT}
  fragment CartFields on CartType {
    id
    items {
      ...CartItemFields
    }
    itemCount
    subtotal
    discount
    shipping
    total
    couponCode
  }
`;

// ============================================================================
// Queries
// ============================================================================

const CART_QUERY = gql`
  ${CART_FRAGMENT}
  query Cart {
    cart {
      ...CartFields
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

const ADD_TO_CART_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      ...CartFields
    }
  }
`;

const UPDATE_CART_ITEM_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      ...CartFields
    }
  }
`;

const REMOVE_CART_ITEM_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation RemoveCartItem($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      ...CartFields
    }
  }
`;

const CLEAR_CART_MUTATION = gql`
  mutation ClearCart {
    clearCart
  }
`;

const APPLY_COUPON_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation ApplyCoupon($code: String!) {
    applyCoupon(code: $code) {
      ...CartFields
    }
  }
`;

const REMOVE_COUPON_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation RemoveCoupon {
    removeCoupon {
      ...CartFields
    }
  }
`;

// ============================================================================
// Types
// ============================================================================

export interface CartItemVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  stockMultiplier: number;
  productId: string;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant: CartItemVariant;
  product?: {
    id: string;
    name: string;
    slug: string;
    image?: {
      id: string;
      url: string;
      alt?: string;
      sortOrder?: number;
      isPrimary?: boolean;
    };
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  shippingCost?: number;
  total: number;
  couponCode?: string;
  promotionCode?: string;
}

interface CartQueryData {
  cart: Cart | null;
}

interface AddToCartMutationData {
  addToCart: Cart;
}

interface AddToCartMutationVars {
  input: { variantId: string; quantity: number };
}

interface UpdateCartItemMutationData {
  updateCartItem: Cart | null;
}

interface UpdateCartItemMutationVars {
  input: { itemId: string; quantity: number };
}

interface RemoveCartItemMutationData {
  removeFromCart: Cart | null;
}

interface RemoveCartItemMutationVars {
  itemId: string;
}

interface ApplyCouponMutationData {
  applyCoupon: Cart;
}

interface ApplyCouponMutationVars {
  code: string;
}

// ============================================================================
// Hooks
// ============================================================================

export function useCartQuery(options?: { skip?: boolean }) {
  const { data, loading, error, refetch } = useQuery<CartQueryData>(
    CART_QUERY,
    {
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
      skip: options?.skip ?? false,
    },
  );

  return { cart: data?.cart, loading, error, refetch };
}

export function useAddToCart() {
  const [mutate, { loading, error }] = useMutation<
    AddToCartMutationData,
    AddToCartMutationVars
  >(ADD_TO_CART_MUTATION, {
    update: (cache, { data }) => {
      if (data?.addToCart) {
        cache.writeQuery({
          query: CART_QUERY,
          data: { cart: data.addToCart },
        });
      }
    },
  });

  const addToCart = async (variantId: string, quantity: number = 1) => {
    return mutate({ variables: { input: { variantId, quantity } } });
  };

  return { addToCart, loading, error };
}

export function useUpdateCartItem() {
  const [mutate, { loading, error }] = useMutation<
    UpdateCartItemMutationData,
    UpdateCartItemMutationVars
  >(UPDATE_CART_ITEM_MUTATION, {
    update: (cache, { data }) => {
      if (data?.updateCartItem) {
        cache.writeQuery({
          query: CART_QUERY,
          data: { cart: data.updateCartItem },
        });
      }
    },
  });

  const updateCartItem = async (itemId: string, quantity: number) => {
    return mutate({ variables: { input: { itemId, quantity } } });
  };

  return { updateCartItem, loading, error };
}

export function useRemoveCartItem() {
  const [mutate, { loading, error }] = useMutation<
    RemoveCartItemMutationData,
    RemoveCartItemMutationVars
  >(REMOVE_CART_ITEM_MUTATION, {
    update: (cache, { data }) => {
      if (data?.removeFromCart) {
        cache.writeQuery({
          query: CART_QUERY,
          data: { cart: data.removeFromCart },
        });
      }
    },
  });

  const removeCartItem = async (itemId: string) => {
    return mutate({ variables: { itemId } });
  };

  return { removeCartItem, loading, error };
}

export function useClearCart() {
  const [mutate, { loading, error }] = useMutation(CLEAR_CART_MUTATION, {
    update: (cache) => {
      cache.writeQuery({
        query: CART_QUERY,
        data: {
          cart: {
            __typename: "CartType",
            id: "empty-cart",
            items: [],
            itemCount: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            total: 0,
            couponCode: null,
          },
        },
      });
    },
  });

  const clearCart = async () => mutate();

  return { clearCart, loading, error };
}

export function useApplyCoupon() {
  const [mutate, { loading, error }] = useMutation<
    ApplyCouponMutationData,
    ApplyCouponMutationVars
  >(APPLY_COUPON_MUTATION);

  const applyCoupon = async (code: string) => mutate({ variables: { code } });

  return { applyCoupon, loading, error };
}

export function useRemoveCoupon() {
  const [mutate, { loading, error }] = useMutation(REMOVE_COUPON_MUTATION);

  const removeCoupon = async () => mutate();

  return { removeCoupon, loading, error };
}
