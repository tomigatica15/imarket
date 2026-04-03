import LoginPageClient from "./LoginPageClient";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Iniciar Sesión",
  description:
    "Inicia sesión o crea tu cuenta en iMarket. Accede a ofertas exclusivas en productos Apple y tecnología.",
  noIndex: true,
  canonical: "/login",
});

export default function LoginPage() {
  return <LoginPageClient />;
}
