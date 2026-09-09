import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { name: "Alex K.", text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable." },
  { name: "James L.", text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is on-point with the latest trends." },
] as const;

export function TestimonialsSection() {
  return (
    <section className="pb-8 pt-16 sm:pt-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="home-display max-w-[250px] text-[32px] leading-[.95] sm:max-w-none sm:text-5xl">Our happy customers</h2>
        <div className="flex gap-4 pb-1">
          <button type="button" aria-label="Đánh giá trước" className="rounded-full p-1 hover:bg-black/5"><ArrowLeft size={22} /></button>
          <button type="button" aria-label="Đánh giá tiếp theo" className="rounded-full p-1 hover:bg-black/5"><ArrowRight size={22} /></button>
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <article key={testimonial.name} className={`rounded-[20px] border border-black/10 p-6 sm:p-7 ${index > 0 ? "hidden sm:block" : ""} ${index > 1 ? "sm:hidden lg:block" : ""}`}>
            <div className="flex text-[#ffc633]" aria-label="5 trên 5 sao">
              {Array.from({ length: 5 }, (_, starIndex) => <Star key={starIndex} size={19} className="fill-current" />)}
            </div>
            <h3 className="mt-3 flex items-center gap-1.5 text-lg font-bold">{testimonial.name}<CheckCircle2 size={16} className="fill-[#01ab31] text-white" /></h3>
            <p className="mt-3 text-sm leading-5 text-black/60">“{testimonial.text}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
