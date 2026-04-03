import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container py-24 px-8 border-t border-outline/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-xs">
          <span className="flex items-center gap-2 text-xl font-bold tracking-tighter text-on-surface mb-6 font-headline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 814 1000"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.6-150.3-109.2c-52.9-77.7-96.7-198.8-96.7-314.5 0-208.8 136.3-319.1 270.8-319.1 67.2 0 123.1 44.3 164.7 44.3 39.5 0 101.1-47 176.3-47 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
            </svg>
            iMarket
          </span>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
            Curaduría digital de los mejores celulares y productos tech del
            mundo para elevar tu estilo de vida diario.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div>
            <h5 className="font-headline font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">
              AYUDA
            </h5>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/soporte"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Soporte
                </Link>
              </li>
              <li>
                <Link
                  href="/envios"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Envío
                </Link>
              </li>
              <li>
                <Link
                  href="/devoluciones"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline font-bold text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">
              NEWSLETTER
            </h5>
            <p className="text-sm text-on-surface-variant mb-4">
              Novedades y lanzamientos semanales.
            </p>
            <form className="flex border-b border-outline/30 pb-2">
              <input
                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full outline-none"
                placeholder="Email"
                type="email"
              />
              <button type="submit" className="text-primary hover:opacity-70">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-widest">
          © {new Date().getFullYear()} iMarket. Todos los derechos reservados.
        </p>
        <p className="text-[11px] font-medium text-on-surface-variant">
          Desarrollado por{" "}
          <a
            href="https://tgdevs.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-bold"
          >
            TGDevs
          </a>
        </p>
      </div>
    </footer>
  );
}
