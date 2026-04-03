import CarritoPageClient from "./CarritoPageClient";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Carrito de Compras",
  description:
    "Revisá los productos en tu carrito de compras en iMarket. Completá tu pedido de productos Apple y tecnología.",
  noIndex: true,
  canonical: "/carrito",
});

export default function CarritoPage() {
  return <CarritoPageClient />;
}
