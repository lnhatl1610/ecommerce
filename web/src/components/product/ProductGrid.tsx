import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
export function ProductGrid({ products, onAdd, onWishlist }: { products: Product[]; onAdd: (product: Product) => void; onWishlist?: (product: Product) => void }) { return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} onWishlist={onWishlist}/>)}</div>; }
