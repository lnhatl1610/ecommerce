import { useEffect, useState } from "react";
import { BrandStrip } from "@/features/home/components/BrandStrip";
import { DressStyleSection } from "@/features/home/components/DressStyleSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { ProductShowcase } from "@/features/home/components/ProductShowcase";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { productApi } from "@/features/products/api/productApi";
import type { Product } from "@/types/product";
import { Helmet } from "react-helmet-async";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    void productApi
      .list()
      .then((result) => {
        if (active) setProducts("items" in result ? result.items : []);
      })
      .catch(() => {
        // The curated storefront remains visible when the API is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="home-page relative left-1/2 -mt-8 w-screen -translate-x-1/2">
      <Helmet><title>SHOP.CO — Thời trang cho phong cách của bạn</title><meta name="description" content="Khám phá thời trang mới, sản phẩm bán chạy và phong cách phù hợp với bạn tại SHOP.CO." /></Helmet>
      <HeroSection />
      <BrandStrip />
      <main className="mx-auto max-w-7xl px-4 pb-8 sm:px-8">
        <ProductShowcase id="new-arrivals" title="New Arrivals" products={products.slice(0, 4)} imageOffset={0} />
        <div className="mx-auto max-w-6xl border-t border-black/10" />
        <ProductShowcase title="Top Selling" products={products.slice(4, 8)} imageOffset={4} />
        <DressStyleSection />
        <TestimonialsSection />
      </main>
    </div>
  );
}
