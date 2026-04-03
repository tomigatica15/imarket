import { Truck, ShieldCheck, Headphones } from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="px-8 max-w-7xl mx-auto mb-20 py-16 bg-background rounded-xl grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mb-6">
          <Truck className="w-6 h-6" />
        </div>
        <h4 className="font-headline font-bold text-lg mb-2">Envío Rápido</h4>
        <p className="text-sm text-on-surface-variant max-w-[200px]">
          Gratis en compras seleccionadas.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mb-6">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="font-headline font-bold text-lg mb-2">Pago Seguro</h4>
        <p className="text-sm text-on-surface-variant max-w-[200px]">
          Todas las transacciones protegidas.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mb-6">
          <Headphones className="w-6 h-6" />
        </div>
        <h4 className="font-headline font-bold text-lg mb-2">Soporte 24/7</h4>
        <p className="text-sm text-on-surface-variant max-w-[200px]">
          Atención personalizada siempre.
        </p>
      </div>
    </section>
  );
}
