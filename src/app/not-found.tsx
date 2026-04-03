import { Navbar, BottomNav, Footer } from "@/components/layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto text-center">
        <h1 className="font-headline text-6xl font-extrabold tracking-tight mb-4 text-on-surface">
          404
        </h1>
        <p className="text-on-surface-variant text-lg mb-8">
          No pudimos encontrar la página que buscás.
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-primary text-white font-headline font-bold rounded-full hover:opacity-90 active:scale-95 transition-all inline-block"
        >
          Volver al inicio
        </Link>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
