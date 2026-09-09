import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

const catalog = [
  { name: "T-shirt with Tape Details", price: 120, rating: 4.5 },
  { name: "Skinny Fit Jeans", price: 240, compareAtPrice: 260, discount: "-20%", rating: 3.5 },
  { name: "Checkered Shirt", price: 180, rating: 4.5 },
  { name: "Sleeve Striped T-shirt", price: 130, compareAtPrice: 160, discount: "-30%", rating: 4.5 },
  { name: "Vertical Striped Shirt", price: 212, compareAtPrice: 232, discount: "-20%", rating: 5 },
  { name: "Courage Graphic T-shirt", price: 145, rating: 4 },
  { name: "Loose Fit Bermuda Shorts", price: 80, rating: 3 },
  { name: "Faded Skinny Jeans", price: 210, rating: 4.5 },
] as const;

interface ProductShowcaseProps {
  id?: string;
  title: string;
  products: Product[];
  imageOffset: number;
}

export function ProductShowcase({ id, title, products, imageOffset }: ProductShowcaseProps) {
  return (
    <section id={id} className="py-16 sm:py-20">
      <h2 className="home-display text-center text-[32px] sm:text-5xl">{title}</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-12 lg:grid-cols-4 lg:gap-5">
        {catalog.slice(imageOffset, imageOffset + 4).map((item, index) => {
          const product = products[index];
          const target = product ? `/products/${product.slug}` : "/shop";
          const imageNumber = imageOffset + index + 1;

          return (
            <article key={item.name} className={index > 1 ? "hidden lg:block" : undefined}>
              <Link to={target} className="group block">
                <div className="aspect-square overflow-hidden rounded-2xl bg-[#f0eeed]">
                  <img src={`/images/home/products/product-${imageNumber}.png`} alt={item.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <h3 className="mt-3 truncate text-sm font-bold sm:text-base">{item.name}</h3>
              </Link>
              <div className="mt-1.5 flex items-center gap-1 text-[#ffc633]" aria-label={`${item.rating} trên 5 sao`}>
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star key={starIndex} size={15} className={starIndex < Math.round(item.rating) ? "fill-current" : "fill-current opacity-30"} />
                ))}
                <span className="ml-1 text-xs text-black/60">{item.rating}/5</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-lg font-bold sm:text-2xl">
                <span>${item.price}</span>
                {"compareAtPrice" in item && <del className="text-black/40">${item.compareAtPrice}</del>}
                {"discount" in item && <span className="rounded-full bg-[#ff3333]/10 px-2 py-1 text-[10px] font-medium text-[#ff3333] sm:text-xs">{item.discount}</span>}
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-8 text-center sm:mt-10">
        <Link to="/shop" className="inline-flex h-[52px] w-full items-center justify-center rounded-full border border-black/10 text-sm font-medium transition hover:bg-black hover:text-white sm:w-[218px]">View All</Link>
      </div>
    </section>
  );
}
