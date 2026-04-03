import BuscarPageClient from "./BuscarPageClient";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Buscar Productos",
  description:
    "Busca tu producto Apple favorito en iMarket. Encontrá iPhones, MacBooks, AirPods, iPads y más.",
  keywords: ["buscar productos apple", "encontrar iphone", "búsqueda"],
  canonical: "/buscar",
});

export default function BuscarPage() {
  return <BuscarPageClient />;
}
