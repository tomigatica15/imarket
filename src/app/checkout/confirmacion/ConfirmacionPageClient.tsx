"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";
import { CheckCircle, ArrowRight } from "lucide-react";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";
  const method = searchParams.get("method") || "";

  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="max-w-lg mx-auto px-4 pt-12 md:pt-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold mb-3 font-headline">
          ¡Pedido Confirmado!
        </h1>

        {orderNumber && (
          <p className="text-on-surface-variant mb-6">
            Tu número de orden es:{" "}
            <span className="font-bold text-on-surface">#{orderNumber}</span>
          </p>
        )}

        {method === "transfer" && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
            <p className="font-bold text-orange-700 mb-2">
              Transferencia Bancaria
            </p>
            <p className="text-sm text-orange-600">
              Te enviaremos los datos para realizar la transferencia por email.
              Una vez confirmado el pago, procesaremos tu pedido.
            </p>
          </div>
        )}

        {method === "cash" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
            <p className="font-bold text-emerald-700 mb-2">
              Pago contra entrega
            </p>
            <p className="text-sm text-emerald-600">
              Abonarás el total al momento de recibir tu pedido. Nos pondremos
              en contacto para coordinar la entrega.
            </p>
          </div>
        )}

        <p className="text-on-surface-variant text-sm mb-8">
          Nos pondremos en contacto para coordinar el envío de tu pedido.
          Recibirás un email con los detalles.
        </p>

        <Link
          href="/"
          className="h-12 px-8 bg-primary text-white font-bold rounded-xl inline-flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          Volver al inicio
          <ArrowRight className="w-5 h-5" />
        </Link>
      </main>

      <div className="hidden md:block mt-12">
        <Footer />
      </div>
    </div>
  );
}

export default function ConfirmacionPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant">
            Cargando...
          </div>
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
