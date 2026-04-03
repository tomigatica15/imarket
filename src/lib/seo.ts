import { Metadata } from "next";

export const siteConfig = {
  name: "iMarket",
  description:
    "Tu tienda online de tecnología y celulares. iPhones, MacBooks, AirPods, iPads, Apple Watch y accesorios con envío a todo Argentina.",
  url: "https://imarket.ar",
  ogImage: "https://imarket.ar/og-image.png",
  creator: "@imarket_ar",
  keywords: [
    "celulares",
    "iphone",
    "macbook",
    "airpods",
    "ipad",
    "apple watch",
    "apple",
    "tecnología",
    "smartphones",
    "accesorios",
    "gadgets",
    "tienda online",
    "argentina",
  ],
  authors: [{ name: "iMarket", url: "https://imarket.ar" }],
  locale: "es_AR",
  type: "website" as const,
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Tu tienda de tecnología y celulares`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: siteConfig.type,
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: {
      default: `${siteConfig.name} - Tu tienda de tecnología y celulares`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Tienda de tecnología y celulares`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: `${siteConfig.name} - Tu tienda de tecnología y celulares`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    creator: siteConfig.creator,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "es-AR": siteConfig.url,
    },
  },
  category: "ecommerce",
};

interface GenerateMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  type?: "website" | "article";
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  noIndex = false,
  canonical,
  type = "website",
}: GenerateMetadataOptions): Metadata {
  const url = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

interface ProductSchemaOptions {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock";
  brand?: string;
  category?: string;
  sku?: string;
  slug: string;
}

export function generateProductSchema({
  name,
  description,
  image,
  price,
  currency = "ARS",
  availability = "InStock",
  brand,
  category,
  sku,
  slug,
}: ProductSchemaOptions) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: `${siteConfig.url}/producto/${slug}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  if (brand) schema.brand = { "@type": "Brand", name: brand };
  if (category) schema.category = category;
  if (sku) schema.sku = sku;

  return schema;
}
