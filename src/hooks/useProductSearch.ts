"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { PRODUCTS_QUERY } from "@/lib/graphql/queries";
import { getMockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/graphql/server";

const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_PRODUCTS === "true";

interface ProductsQueryData {
  products: {
    items: Product[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

function searchMockProducts(query: string): Product[] {
  const { items } = getMockProducts();
  const lower = query.toLowerCase();
  return items.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.brand?.toLowerCase().includes(lower) ||
      p.shortDescription?.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.tags?.some((t) => t.toLowerCase().includes(lower)) ||
      p.category?.name.toLowerCase().includes(lower),
  );
}

export function useProductSearch(query: string) {
  const shouldSearch = query.length >= 2;

  // Mock data search
  const [mockProducts, setMockProducts] = useState<Product[]>([]);
  const [mockLoading, setMockLoading] = useState(false);

  useEffect(() => {
    if (!USE_MOCK || !shouldSearch) {
      setMockProducts([]);
      return;
    }
    setMockLoading(true);
    // Small delay to simulate loading for UX consistency
    const timer = setTimeout(() => {
      setMockProducts(searchMockProducts(query));
      setMockLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [query, shouldSearch]);

  // GraphQL search (skipped when mock mode)
  const { data, loading, error } = useQuery<ProductsQueryData>(PRODUCTS_QUERY, {
    variables: {
      filter: { search: query },
      pagination: { page: 1, limit: 20 },
    },
    skip: !shouldSearch || USE_MOCK,
    fetchPolicy: "cache-first",
  });

  if (USE_MOCK) {
    return {
      products: shouldSearch ? mockProducts : [],
      loading: mockLoading,
      error: undefined,
    };
  }

  return {
    products: shouldSearch ? data?.products?.items || [] : [],
    loading: shouldSearch ? loading : false,
    error,
  };
}
