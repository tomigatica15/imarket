import { gql } from "@apollo/client/core";

// ============================================================================
// Fragments
// ============================================================================

export const PRODUCT_IMAGE_FRAGMENT = gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    sortOrder
    isPrimary
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariantFields on ProductVariantType {
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
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFields on CategoryType {
    id
    name
    slug
    description
    imageUrl
    isActive
    sortOrder
    parentId
  }
`;

export const PRODUCT_FRAGMENT = gql`
  ${PRODUCT_IMAGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  fragment ProductFields on ProductType {
    id
    name
    slug
    description
    shortDescription
    brand
    basePrice
    compareAtPrice
    isFeatured
    isNew
    status
    images {
      ...ProductImageFields
    }
    variants {
      ...ProductVariantFields
    }
    category {
      ...CategoryFields
    }
    tags
  }
`;

// ============================================================================
// Queries
// ============================================================================

export const PRODUCTS_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query Products(
    $filter: ProductFilterInput
    $pagination: PaginationInput
    $sort: ProductSortInput
  ) {
    products(filter: $filter, pagination: $pagination, sort: $sort) {
      items {
        ...ProductFields
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

export const PRODUCT_BY_SLUG_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query ProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFields
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  ${CATEGORY_FRAGMENT}
  query Categories {
    categories {
      ...CategoryFields
    }
  }
`;
