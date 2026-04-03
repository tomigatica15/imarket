import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getProducts,
  type Product,
} from "@/lib/graphql/server";
import { Navbar, BottomNav, Footer } from "@/components/layout";
import { ProductDetail } from "./ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Producto no encontrado" };
    return {
      title: `${product.name} - iMarket`,
      description: product.shortDescription || product.description || "",
    };
  } catch {
    return { title: "Producto no encontrado" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  let relatedProducts: Product[] = [];
  try {
    const allProducts = await getProducts({ limit: 5 });
    relatedProducts = allProducts.items
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  } catch {
    relatedProducts = [];
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
