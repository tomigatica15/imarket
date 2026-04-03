import CheckoutPageClient from "./CheckoutPageClient";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Finalizar Compra",
  description:
    "Completá tu compra en iMarket. Ingresá tus datos de envío y elegí tu método de pago preferido.",
  noIndex: true,
  canonical: "/checkout",
});

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
