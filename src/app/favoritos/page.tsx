import FavoritosPageClient from "./FavoritosPageClient";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Mis Favoritos",
  description:
    "Tus productos Apple favoritos guardados en iMarket. Accede rápidamente a los productos que más te interesan.",
  noIndex: true,
  canonical: "/favoritos",
});

export default function FavoritosPage() {
  return <FavoritosPageClient />;
}
