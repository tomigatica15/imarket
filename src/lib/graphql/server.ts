import { cache } from "react";
import {
  getMockProducts,
  getMockProductBySlug,
  getMockCategories,
  getMockCategoryBySlug,
  getMockBanners,
} from "../mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_PRODUCTS === "true";

const getGraphQLUrl = () => {
  return (
    process.env.INTERNAL_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "http://localhost:3001/api/graphql"
  );
};

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function serverQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const url = getGraphQLUrl();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(TENANT_ID && { "x-tenant-id": TENANT_ID }),
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`,
    );
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

// ============================================================================
// Products
// ============================================================================

export const getProducts = cache(
  async (options?: {
    limit?: number;
    featured?: boolean;
    categorySlug?: string;
  }) => {
    if (USE_MOCK) return getMockProducts(options);

    const query = `
      query Products($filter: ProductFilterInput, $pagination: PaginationInput) {
        products(filter: $filter, pagination: $pagination) {
          items {
            id
            name
            slug
            description
            shortDescription
            brand
            basePrice
            compareAtPrice
            isNew
            isFeatured
            tags
            images {
              id
              url
              alt
              isPrimary
              sortOrder
            }
            variants {
              id
              name
              sku
              size
              color
              colorHex
              stock
              price
              isActive
              attributes
            }
            category {
              id
              name
              slug
            }
          }
          meta {
            total
            page
            limit
            totalPages
          }
        }
      }
    `;

    const variables: Record<string, unknown> = {
      pagination: { page: 1, limit: options?.limit || 20 },
    };

    if (options?.featured) {
      variables.filter = { isFeatured: true };
    }

    if (options?.categorySlug) {
      variables.filter = {
        ...((variables.filter as object) || {}),
        categorySlug: options.categorySlug,
      };
    }

    const data = await serverQuery<{
      products: { items: Product[]; meta: PaginationMeta };
    }>(query, variables);
    return data.products;
  },
);

export const getProductBySlug = cache(async (slug: string) => {
  if (USE_MOCK) return getMockProductBySlug(slug);

  const query = `
    query ProductBySlug($slug: String!) {
      productBySlug(slug: $slug) {
        id
        name
        slug
        description
        shortDescription
        brand
        basePrice
        compareAtPrice
        isNew
        isFeatured
        status
        tags
        images {
          id
          url
          alt
          isPrimary
          sortOrder
        }
        variants {
          id
          name
          sku
          size
          color
          colorHex
          stock
          price
          isActive
          attributes
        }
        category {
          id
          name
          slug
        }
      }
    }
  `;

  const data = await serverQuery<{ productBySlug: Product }>(query, { slug });
  return data.productBySlug;
});

// ============================================================================
// Categories
// ============================================================================

export const getCategories = cache(async () => {
  if (USE_MOCK) return getMockCategories();

  const query = `
    query Categories {
      categories {
        id
        name
        slug
        description
        imageUrl
        isActive
        sortOrder
        parentId
      }
    }
  `;

  const data = await serverQuery<{ categories: Category[] }>(query);
  return data.categories;
});

export const getCategoryBySlug = cache(async (slug: string) => {
  if (USE_MOCK) return getMockCategoryBySlug(slug);

  // Fallback: fetch all categories and find by slug
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
});

// ============================================================================
// Banners
// ============================================================================

export const getHeroBanners = cache(async () => {
  if (USE_MOCK) return getMockBanners();

  const query = `
    query Banners($filter: BannerFilterInput) {
      banners(filter: $filter) {
        id
        title
        subtitle
        imageUrl
        mobileImageUrl
        linkUrl
        linkText
        position
        isActive
      }
    }
  `;

  const data = await serverQuery<{ banners: Banner[] }>(query, {
    filter: { position: "HERO", isActive: true },
  });
  return data.banners;
});

// ============================================================================
// Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brand?: string;
  basePrice: number;
  compareAtPrice?: number;
  isNew: boolean;
  isFeatured: boolean;
  status?: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name?: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  price?: number;
  isActive: boolean;
  attributes?: Record<string, unknown>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  parentId?: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  position: string;
  isActive: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
