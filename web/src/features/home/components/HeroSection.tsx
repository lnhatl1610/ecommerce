import { Link } from "react-router-dom";

const stats = [
  ["200+", "International Brands"],
  ["2,000+", "High-Quality Products"],
  ["30,000+", "Happy Customers"],
] as const;

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#f2f0f1]">
      <div className="relative mx-auto min-h-[663px] max-w-7xl px-4 pt-10 sm:px-8 lg:min-h-[600px] lg:pt-20">
        <div className="relative z-[1] max-w-[610px]">
          <h1 className="home-display text-[38px] leading-[.94] sm:text-6xl lg:text-[64px]">
            Find clothes<br />that matches<br />your style
          </h1>
          <p className="mt-5 max-w-[545px] text-sm leading-5 text-black/60 sm:text-base sm:leading-6">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <Link to="/shop" className="mt-6 flex h-[52px] w-full items-center justify-center rounded-full bg-black text-sm font-medium text-white transition hover:bg-black/80 sm:w-[210px]">
            Shop Now
          </Link>
          <dl className="mt-6 grid max-w-[590px] grid-cols-2 justify-center gap-y-4 sm:mt-12 sm:flex sm:justify-start">
            {stats.map(([value, label], index) => (
              <div key={label} className={`px-5 first:pl-0 sm:border-l sm:border-black/10 sm:first:border-0 ${index === 2 ? "col-span-2 mx-auto sm:mx-0" : ""}`}>
                <dt className="text-2xl font-bold leading-none sm:text-[40px]">{value}</dt>
                <dd className="mt-1 whitespace-nowrap text-xs text-black/60 sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img src="/images/home/hero/hero-banner.png" alt="Hai người mẫu mặc trang phục phong cách hiện đại" className="absolute bottom-0 left-1/2 h-[315px] w-[390px] max-w-none -translate-x-1/2 object-cover object-top sm:h-[360px] sm:w-[500px] lg:left-auto lg:right-0 lg:h-[590px] lg:w-[660px] lg:translate-x-0" />
      </div>
    </section>
  );
}
