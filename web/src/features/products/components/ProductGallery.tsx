import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";

interface ProductGalleryProps {
  name: string;
  thumbnail: string | null;
  images?: string[];
  videoUrls?: string[];
  variantImage?: string | null;
  discountPercent?: number;
  outOfStock: boolean;
}

export function ProductGallery({ name, thumbnail, images = [], videoUrls = [], variantImage, discountPercent, outOfStock }: ProductGalleryProps) {
  const media = useMemo(() => {
    const imageItems = [variantImage, thumbnail, ...images]
      .filter((value): value is string => Boolean(value))
      .filter((value, index, values) => values.indexOf(value) === index)
      .map((src) => ({ type: "image" as const, src }));
    const videoItems = videoUrls.map((src) => ({ type: "video" as const, src }));
    return [...imageItems, ...videoItems];
  }, [images, thumbnail, variantImage, videoUrls]);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const active = media[activeIndex];

  useEffect(() => setActiveIndex(0), [variantImage]);
  const move = (direction: number) => setActiveIndex((current) => (current + direction + media.length) % media.length);

  return (
    <Dialog>
      <div className="grid gap-3 sm:grid-cols-[100px_minmax(0,1fr)]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible">
          {media.map((item, index) => (
            <button
              type="button"
              key={`${item.src}-${index}`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative size-[88px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#f0eeed] transition sm:size-[100px] ${activeIndex === index ? "border-black" : "border-transparent hover:border-black/30"}`}
              aria-label={`Xem ${item.type === "video" ? "video" : "ảnh"} ${index + 1} của ${name}`}
            >
              {item.type === "image" ? <img src={item.src} alt="" className="h-full w-full object-contain" /> : <><video src={item.src} className="h-full w-full object-cover" muted /><span className="absolute inset-0 grid place-items-center bg-black/20"><Play className="fill-white text-white" size={24} /></span></>}
            </button>
          ))}
        </div>
        <div className="relative order-1 sm:order-2">
          <DialogTrigger render={<button type="button" className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-[#f0eeed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black" aria-label={`Phóng to hình ảnh ${name}`} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const endX = event.changedTouches[0]?.clientX; if (touchStartX.current === null || endX === undefined || Math.abs(endX - touchStartX.current) < 40) return; event.preventDefault(); move(endX < touchStartX.current ? 1 : -1); touchStartX.current = null; }} />}>
            {active?.type === "video" ? <video src={active.src} className="h-full w-full object-contain" muted /> : active ? <img src={active.src} alt={name} className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none" /> : <span className="grid h-full place-items-center text-sm text-black/40">Chưa có hình ảnh</span>}
            <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"><Expand size={18} aria-hidden="true" /></span>
            <span className="absolute left-4 top-4 flex flex-wrap gap-2">{outOfStock && <span className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">Hết hàng</span>}{discountPercent ? <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">-{discountPercent}%</span> : null}</span>
            {media.length > 1 && <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white sm:hidden">{activeIndex + 1}/{media.length}</span>}
          </DialogTrigger>
          {media.length > 1 && <><button type="button" onClick={() => move(-1)} className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white sm:flex" aria-label="Ảnh trước"><ChevronLeft aria-hidden="true" /></button><button type="button" onClick={() => move(1)} className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white sm:flex" aria-label="Ảnh sau"><ChevronRight aria-hidden="true" /></button></>}
        </div>
      </div>
      <DialogContent className="bg-[#f0eeed] p-8">
        <DialogTitle className="sr-only">Hình ảnh {name}</DialogTitle>
        <DialogDescription className="sr-only">Hình ảnh sản phẩm ở kích thước lớn</DialogDescription>
        {active?.type === "video" ? <video src={active.src} className="max-h-[80dvh] w-full object-contain" controls autoPlay /> : active ? <img src={active.src} alt={name} className="max-h-[80dvh] w-full object-contain" /> : null}
      </DialogContent>
    </Dialog>
  );
}
