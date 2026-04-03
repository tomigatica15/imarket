import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/graphql/server";

interface HeroSectionProps {
  banners: Banner[];
}

export function HeroSection({ banners }: HeroSectionProps) {
  const banner = banners[0];

  return (
    <section className="px-6 mt-8 max-w-7xl mx-auto mb-16">
      <div className="relative w-full h-[540px] rounded-xl overflow-hidden flex items-center group shadow-sm">
        {banner?.imageUrl ? (
          <Image
            src={banner.imageUrl}
            alt={banner.title || "iMarket"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="relative z-10 px-12 max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider mb-6">
            {banner?.subtitle || "ENVÍO GRATIS DESDE $150.000"}
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-10 tracking-tight">
            {banner?.title || (
              <>
                La era del <br />
                <span className="text-white/80">lifestyle tech.</span>
              </>
            )}
          </h1>
          <Link
            href={banner?.linkUrl || "/productos"}
            className="px-8 py-4 bg-white text-on-surface font-headline font-bold rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2"
          >
            {banner?.linkText || "Comprar ahora"}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
