import { Link } from "react-router-dom";

const styles = [
  { name: "Casual", slug: "casual", wide: false },
  { name: "Formal", slug: "formal", wide: true },
  { name: "Party", slug: "party", wide: true },
  { name: "Gym", slug: "gym", wide: false },
] as const;

export function DressStyleSection() {
  return (
    <section className="rounded-[20px] bg-[#f0f0f0] px-5 py-10 sm:rounded-[40px] sm:px-16 sm:py-16">
      <h2 className="home-display text-center text-[32px] leading-none sm:text-5xl">Browse by dress style</h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-5">
        {styles.map((style) => (
          <Link key={style.name} to={`/shop?style=${style.slug}`} className={`group relative min-h-[190px] overflow-hidden rounded-[20px] bg-white lg:min-h-[289px] ${style.wide ? "lg:col-span-3" : "lg:col-span-2"}`}>
            <img src={`/images/home/styles/${style.slug}.png`} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute left-6 top-5 z-[1] text-2xl font-bold sm:text-4xl">{style.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
