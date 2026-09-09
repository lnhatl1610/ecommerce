const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

export function BrandStrip() {
  return (
    <section className="bg-black px-4 py-8 text-white sm:px-8 sm:py-10" aria-label="Featured brands">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-5 sm:justify-between sm:gap-8">
        {brands.map((brand, index) => (
          <span key={brand} className={`whitespace-nowrap text-2xl ${index === 3 ? "font-black tracking-wide" : index === 4 ? "font-light" : "font-serif"} sm:text-4xl`}>
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
