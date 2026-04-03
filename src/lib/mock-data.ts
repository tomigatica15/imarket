import type {
  Product,
  Category,
  Banner,
  PaginationMeta,
} from "./graphql/server";

// ============================================================================
// Mock Categories
// ============================================================================

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "iPhone",
    slug: "iphone",
    description: "Los últimos modelos de iPhone",
    imageUrl:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "cat-2",
    name: "Mac",
    slug: "mac",
    description: "MacBook Air, MacBook Pro y Mac Mini",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "cat-3",
    name: "AirPods",
    slug: "airpods",
    description: "Auriculares inalámbricos Apple",
    imageUrl:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "cat-4",
    name: "iPad",
    slug: "ipad",
    description: "iPad Pro, iPad Air e iPad mini",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "cat-5",
    name: "Apple Watch",
    slug: "apple-watch",
    description: "Series 10, Ultra 2 y SE",
    imageUrl:
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "cat-6",
    name: "Accesorios",
    slug: "accesorios",
    description: "Fundas, cables y más",
    imageUrl:
      "https://images.unsplash.com/photo-1608508644127-ba99d7732fee?w=400&q=80",
    isActive: true,
    sortOrder: 6,
  },
];

// ============================================================================
// Mock Banners
// ============================================================================

export const MOCK_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "iPhone 16 Pro",
    subtitle: "Titanio. Tan Pro. Tan Max.",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&q=90",
    mobileImageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    linkUrl: "/producto/iphone-16-pro-titanio-negro-256gb",
    linkText: "Conocer más",
    position: "HERO",
    isActive: true,
  },
  {
    id: "banner-2",
    title: "MacBook Air M3",
    subtitle: "Poderosa. Liviana. Increíble.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=90",
    mobileImageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    linkUrl: "/producto/macbook-air-m3-13-starlight-256gb",
    linkText: "Ver más",
    position: "HERO",
    isActive: true,
  },
];

// ============================================================================
// Mock Products
// ============================================================================

export const MOCK_PRODUCTS: Product[] = [
  // ── iPhones ─────────────────────────────────────────────────────────────
  {
    id: "prod-1",
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max-titanio-negro-256gb",
    description:
      "iPhone 16 Pro Max lleva la tecnología de Apple al siguiente nivel con el chip A18 Pro, la cámara más avanzada de la historia del iPhone y la pantalla Super Retina XDR de 6.9 pulgadas. La batería más larga jamás vista en un iPhone.",
    shortDescription: 'Chip A18 Pro · Cámara 48MP · 6.9" ProMotion',
    brand: "Apple",
    basePrice: 1599000,
    compareAtPrice: 1799000,
    isNew: true,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["iphone", "pro", "5g", "nuevo"],
    category: MOCK_CATEGORIES[0],
    images: [
      {
        id: "img-1-1",
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
        alt: "iPhone 16 Pro Max Titanio Negro",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        id: "img-1-2",
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
        alt: "iPhone 16 Pro Max lateral",
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "var-1-1",
        name: "256GB Titanio Negro",
        sku: "IPH16PM-256-TIN",
        color: "Titanio Negro",
        colorHex: "#1C1C1E",
        stock: 12,
        price: 1599000,
        isActive: true,
        attributes: { storage: "256GB" },
      },
      {
        id: "var-1-2",
        name: "512GB Titanio Negro",
        sku: "IPH16PM-512-TIN",
        color: "Titanio Negro",
        colorHex: "#1C1C1E",
        stock: 8,
        price: 1799000,
        isActive: true,
        attributes: { storage: "512GB" },
      },
      {
        id: "var-1-3",
        name: "256GB Titanio Blanco",
        sku: "IPH16PM-256-TIW",
        color: "Titanio Blanco",
        colorHex: "#F5F5F0",
        stock: 5,
        price: 1599000,
        isActive: true,
        attributes: { storage: "256GB" },
      },
      {
        id: "var-1-4",
        name: "256GB Titanio Desierto",
        sku: "IPH16PM-256-TID",
        color: "Titanio Desierto",
        colorHex: "#C4A882",
        stock: 3,
        price: 1599000,
        isActive: true,
        attributes: { storage: "256GB" },
      },
    ],
  },
  {
    id: "prod-2",
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro-titanio-negro-128gb",
    description:
      "iPhone 16 Pro con chip A18 Pro y pantalla Super Retina XDR de 6.3 pulgadas. Cámara Fusion de 48MP, zoom óptico 5x y grabación en 4K 120fps. El iPhone Pro más compacto y poderoso.",
    shortDescription: 'Chip A18 Pro · Cámara 48MP · 6.3" ProMotion',
    brand: "Apple",
    basePrice: 1399000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["iphone", "pro", "5g", "nuevo"],
    category: MOCK_CATEGORIES[0],
    images: [
      {
        id: "img-2-1",
        url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
        alt: "iPhone 16 Pro Titanio Negro",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-2-1",
        name: "128GB Titanio Negro",
        sku: "IPH16P-128-TIN",
        color: "Titanio Negro",
        colorHex: "#1C1C1E",
        stock: 15,
        price: 1399000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
      {
        id: "var-2-2",
        name: "256GB Titanio Negro",
        sku: "IPH16P-256-TIN",
        color: "Titanio Negro",
        colorHex: "#1C1C1E",
        stock: 10,
        price: 1499000,
        isActive: true,
        attributes: { storage: "256GB" },
      },
      {
        id: "var-2-3",
        name: "128GB Titanio Blanco",
        sku: "IPH16P-128-TIW",
        color: "Titanio Blanco",
        colorHex: "#F5F5F0",
        stock: 7,
        price: 1399000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
    ],
  },
  {
    id: "prod-3",
    name: "iPhone 16",
    slug: "iphone-16-negro-128gb",
    description:
      "iPhone 16 con chip A18 y pantalla Super Retina XDR de 6.1 pulgadas. Cámara principal de 48MP con modo fotografía nueva generación y grabación 4K Dolby Vision. El iPhone más popular.",
    shortDescription: 'Chip A18 · Cámara 48MP · 6.1" OLED',
    brand: "Apple",
    basePrice: 1099000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: false,
    status: "ACTIVE",
    tags: ["iphone", "5g", "nuevo"],
    category: MOCK_CATEGORIES[0],
    images: [
      {
        id: "img-3-1",
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        alt: "iPhone 16 Negro",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-3-1",
        name: "128GB Negro",
        sku: "IPH16-128-NEG",
        color: "Negro",
        colorHex: "#1C1C1E",
        stock: 20,
        price: 1099000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
      {
        id: "var-3-2",
        name: "256GB Negro",
        sku: "IPH16-256-NEG",
        color: "Negro",
        colorHex: "#1C1C1E",
        stock: 14,
        price: 1199000,
        isActive: true,
        attributes: { storage: "256GB" },
      },
      {
        id: "var-3-3",
        name: "128GB Celeste",
        sku: "IPH16-128-CEL",
        color: "Celeste",
        colorHex: "#C9E8F5",
        stock: 9,
        price: 1099000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
      {
        id: "var-3-4",
        name: "128GB Rosa",
        sku: "IPH16-128-ROS",
        color: "Rosa",
        colorHex: "#F7C5C0",
        stock: 6,
        price: 1099000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
    ],
  },
  {
    id: "prod-4",
    name: "iPhone 15",
    slug: "iphone-15-negro-128gb",
    description:
      "iPhone 15 con Dynamic Island, chip A16 Bionic y cámara principal de 48MP. USB-C de primera generación y diseño en aluminio con vidrio de color. Gran opción para quienes buscan lo mejor a un precio más accesible.",
    shortDescription: "Chip A16 · Dynamic Island · 48MP",
    brand: "Apple",
    basePrice: 899000,
    compareAtPrice: 999000,
    isNew: false,
    isFeatured: false,
    status: "ACTIVE",
    tags: ["iphone", "5g", "oferta"],
    category: MOCK_CATEGORIES[0],
    images: [
      {
        id: "img-4-1",
        url: "https://images.unsplash.com/photo-1695048092221-6b3dcd45cff6?w=800&q=80",
        alt: "iPhone 15 Negro",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-4-1",
        name: "128GB Negro",
        sku: "IPH15-128-NEG",
        color: "Negro",
        colorHex: "#2C2C2E",
        stock: 18,
        price: 899000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
      {
        id: "var-4-2",
        name: "128GB Rosa",
        sku: "IPH15-128-ROS",
        color: "Rosa",
        colorHex: "#F7C5C0",
        stock: 11,
        price: 899000,
        isActive: true,
        attributes: { storage: "128GB" },
      },
    ],
  },
  // ── MacBooks ─────────────────────────────────────────────────────────────
  {
    id: "prod-5",
    name: 'MacBook Air M3 13"',
    slug: "macbook-air-m3-13-starlight-256gb",
    description:
      "MacBook Air con chip M3, la laptop más vendida del mundo. Hasta 18 horas de batería, pantalla Liquid Retina de 13.6 pulgadas y cámara FaceTime 1080p. Delgada, liviana y extremadamente potente para todo lo que imaginás.",
    shortDescription: 'Chip M3 · 13.6" Liquid Retina · 18hs batería',
    brand: "Apple",
    basePrice: 1999000,
    compareAtPrice: undefined,
    isNew: false,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["mac", "laptop", "m3"],
    category: MOCK_CATEGORIES[1],
    images: [
      {
        id: "img-5-1",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        alt: "MacBook Air M3 Starlight",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-5-1",
        name: "8GB / 256GB Starlight",
        sku: "MBA-M3-8-256-STL",
        color: "Starlight",
        colorHex: "#E3D9CA",
        stock: 6,
        price: 1999000,
        isActive: true,
        attributes: { ram: "8GB", storage: "256GB" },
      },
      {
        id: "var-5-2",
        name: "16GB / 512GB Starlight",
        sku: "MBA-M3-16-512-STL",
        color: "Starlight",
        colorHex: "#E3D9CA",
        stock: 4,
        price: 2499000,
        isActive: true,
        attributes: { ram: "16GB", storage: "512GB" },
      },
      {
        id: "var-5-3",
        name: "8GB / 256GB Medianoche",
        sku: "MBA-M3-8-256-MED",
        color: "Medianoche",
        colorHex: "#1D1D1F",
        stock: 5,
        price: 1999000,
        isActive: true,
        attributes: { ram: "8GB", storage: "256GB" },
      },
    ],
  },
  {
    id: "prod-6",
    name: 'MacBook Pro M4 14"',
    slug: "macbook-pro-m4-14-gris-espacial-512gb",
    description:
      "MacBook Pro con chip M4 Pro, la mejor laptop para profesionales creativos. Pantalla Liquid Retina XDR de 14.2 pulgadas con ProMotion 120Hz, hasta 24 horas de batería y conectividad Thunderbolt 5.",
    shortDescription: 'Chip M4 Pro · 14.2" ProMotion XDR · 24hs',
    brand: "Apple",
    basePrice: 3499000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["mac", "laptop", "m4", "pro"],
    category: MOCK_CATEGORIES[1],
    images: [
      {
        id: "img-6-1",
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
        alt: "MacBook Pro M4 Gris Espacial",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-6-1",
        name: "24GB / 512GB Gris Espacial",
        sku: "MBP-M4-24-512-GRS",
        color: "Gris Espacial",
        colorHex: "#3A3A3C",
        stock: 4,
        price: 3499000,
        isActive: true,
        attributes: { ram: "24GB", storage: "512GB" },
      },
      {
        id: "var-6-2",
        name: "24GB / 1TB Negro Sideral",
        sku: "MBP-M4-24-1TB-NEG",
        color: "Negro Sideral",
        colorHex: "#1D1D1F",
        stock: 3,
        price: 3999000,
        isActive: true,
        attributes: { ram: "24GB", storage: "1TB" },
      },
    ],
  },
  // ── AirPods ──────────────────────────────────────────────────────────────
  {
    id: "prod-7",
    name: "AirPods Pro 2da gen",
    slug: "airpods-pro-2da-gen-usb-c",
    description:
      "AirPods Pro con cancelación activa de ruido hasta 2x más potente, modo Transparencia y audio en formato espacial personalizado. Chip H2 para audio de alta fidelidad y hasta 30 horas de escucha con el estuche.",
    shortDescription: "Cancelación de ruido · Audio Espacial · H2",
    brand: "Apple",
    basePrice: 649000,
    compareAtPrice: undefined,
    isNew: false,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["airpods", "audio", "anc"],
    category: MOCK_CATEGORIES[2],
    images: [
      {
        id: "img-7-1",
        url: "https://images.unsplash.com/photo-1588423771073-b8903fead714?w=800&q=80",
        alt: "AirPods Pro 2da generación",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-7-1",
        name: "USB-C Blanco",
        sku: "APP2-USBC-WHT",
        color: "Blanco",
        colorHex: "#FFFFFF",
        stock: 22,
        price: 649000,
        isActive: true,
        attributes: {},
      },
    ],
  },
  {
    id: "prod-8",
    name: "AirPods 4",
    slug: "airpods-4-blanco",
    description:
      "AirPods 4 con el nuevo diseño más cómodo y ergonómico. Chip H2, audio espacial personalizado y hasta 30 horas de escucha total. El auricular inalámbrico favorito de todos, ahora mejor que nunca.",
    shortDescription: "Chip H2 · Audio Espacial · 30hs",
    brand: "Apple",
    basePrice: 449000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: false,
    status: "ACTIVE",
    tags: ["airpods", "audio"],
    category: MOCK_CATEGORIES[2],
    images: [
      {
        id: "img-8-1",
        url: "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=800&q=80",
        alt: "AirPods 4 Blanco",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-8-1",
        name: "Blanco",
        sku: "AP4-WHT",
        color: "Blanco",
        colorHex: "#FFFFFF",
        stock: 30,
        price: 449000,
        isActive: true,
        attributes: {},
      },
    ],
  },
  // ── iPad ─────────────────────────────────────────────────────────────────
  {
    id: "prod-9",
    name: 'iPad Pro M4 11"',
    slug: "ipad-pro-m4-11-gris-espacial-256gb",
    description:
      "iPad Pro con chip M4 y pantalla Ultra Retina XDR OLED tandem de 11 pulgadas. El dispositivo más delgado de Apple jamás fabricado, con Apple Pencil Pro y Magic Keyboard compatibles.",
    shortDescription: 'Chip M4 · 11" OLED · 5.1mm delgado',
    brand: "Apple",
    basePrice: 2299000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["ipad", "pro", "m4"],
    category: MOCK_CATEGORIES[3],
    images: [
      {
        id: "img-9-1",
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        alt: "iPad Pro M4 11 Gris Espacial",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-9-1",
        name: "256GB Wi-Fi Gris Espacial",
        sku: "IPPM4-11-256-GRS",
        color: "Gris Espacial",
        colorHex: "#3A3A3C",
        stock: 7,
        price: 2299000,
        isActive: true,
        attributes: { connectivity: "Wi-Fi", storage: "256GB" },
      },
      {
        id: "var-9-2",
        name: "512GB Wi-Fi Gris Espacial",
        sku: "IPPM4-11-512-GRS",
        color: "Gris Espacial",
        colorHex: "#3A3A3C",
        stock: 5,
        price: 2699000,
        isActive: true,
        attributes: { connectivity: "Wi-Fi", storage: "512GB" },
      },
      {
        id: "var-9-3",
        name: "256GB Wi-Fi Plata",
        sku: "IPPM4-11-256-PLT",
        color: "Plata",
        colorHex: "#F5F5F7",
        stock: 4,
        price: 2299000,
        isActive: true,
        attributes: { connectivity: "Wi-Fi", storage: "256GB" },
      },
    ],
  },
  // ── Apple Watch ──────────────────────────────────────────────────────────
  {
    id: "prod-10",
    name: "Apple Watch Series 10",
    slug: "apple-watch-series-10-46mm-negro",
    description:
      "Apple Watch Series 10, la pantalla más grande en el diseño más delgado. Detección de apnea del sueño, sensor de temperatura y ECG. Modo descanso inteligente y hasta 18 horas de batería.",
    shortDescription: "46mm · OLED · Detección apnea del sueño",
    brand: "Apple",
    basePrice: 999000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: false,
    status: "ACTIVE",
    tags: ["apple-watch", "wearable", "salud"],
    category: MOCK_CATEGORIES[4],
    images: [
      {
        id: "img-10-1",
        url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        alt: "Apple Watch Series 10 Negro",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-10-1",
        name: "46mm Negro Jet/Negro",
        sku: "AWS10-46-JBN",
        color: "Negro Jet",
        colorHex: "#1C1C1E",
        stock: 10,
        price: 999000,
        isActive: true,
        attributes: { size: "46mm" },
      },
      {
        id: "var-10-2",
        name: "42mm Plata/Blanco",
        sku: "AWS10-42-SLW",
        color: "Plata",
        colorHex: "#E8E8ED",
        stock: 8,
        price: 949000,
        isActive: true,
        attributes: { size: "42mm" },
      },
    ],
  },
  // ── Accesorios ────────────────────────────────────────────────────────────
  {
    id: "prod-11",
    name: "MagSafe Charger 25W",
    slug: "magsafe-charger-25w-usb-c",
    description:
      "Cargador MagSafe de 25W para iPhone 12 y posteriores. Carga inalámbrica magnética rápida con alineación perfecta. Compatible con casos MagSafe y accesorios del ecosistema.",
    shortDescription: "25W · Magnético · iPhone 12 o posterior",
    brand: "Apple",
    basePrice: 129000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: false,
    status: "ACTIVE",
    tags: ["accesorios", "carga", "magsafe"],
    category: MOCK_CATEGORIES[5],
    images: [
      {
        id: "img-11-1",
        url: "https://images.unsplash.com/photo-1608508644127-ba99d7732fee?w=800&q=80",
        alt: "MagSafe Charger 25W",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-11-1",
        name: "Blanco",
        sku: "MGSF-25W-WHT",
        color: "Blanco",
        colorHex: "#FFFFFF",
        stock: 50,
        price: 129000,
        isActive: true,
        attributes: {},
      },
    ],
  },
  {
    id: "prod-12",
    name: "Apple Pencil Pro",
    slug: "apple-pencil-pro",
    description:
      "Apple Pencil Pro con detección de inclinación mejorada, hover y acción de apretado personalizable. Compatible con iPad Pro M4 e iPad Air M2. La herramienta perfecta para creativos y diseñadores.",
    shortDescription: "Hover · Squeeze · iPad Pro M4 compatible",
    brand: "Apple",
    basePrice: 449000,
    compareAtPrice: undefined,
    isNew: true,
    isFeatured: true,
    status: "ACTIVE",
    tags: ["accesorios", "ipad", "pencil"],
    category: MOCK_CATEGORIES[5],
    images: [
      {
        id: "img-12-1",
        url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
        alt: "Apple Pencil Pro",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: "var-12-1",
        name: "Blanco",
        sku: "APC-PRO-WHT",
        color: "Blanco",
        colorHex: "#FFFFFF",
        stock: 15,
        price: 449000,
        isActive: true,
        attributes: {},
      },
    ],
  },
];

// ============================================================================
// Helpers
// ============================================================================

export const MOCK_META: PaginationMeta = {
  total: MOCK_PRODUCTS.length,
  page: 1,
  limit: 20,
  totalPages: 1,
};

export function getMockProducts(options?: {
  limit?: number;
  featured?: boolean;
  categorySlug?: string;
}) {
  let items = [...MOCK_PRODUCTS];
  if (options?.featured) {
    items = items.filter((p) => p.isFeatured);
  }
  if (options?.categorySlug) {
    items = items.filter((p) => p.category?.slug === options.categorySlug);
  }
  if (options?.limit) {
    items = items.slice(0, options.limit);
  }
  return {
    items,
    meta: { ...MOCK_META, total: items.length, totalPages: 1 },
  };
}

export function getMockProductBySlug(slug: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getMockCategories(): Category[] {
  return MOCK_CATEGORIES;
}

export function getMockCategoryBySlug(slug: string): Category | null {
  return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getMockBanners(): Banner[] {
  return MOCK_BANNERS;
}
