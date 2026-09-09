import prisma from "../../config/db.js";
import { WishlistRepository } from "./wishlist.repository.js";
export class WishlistService { constructor(private readonly repository: WishlistRepository = new WishlistRepository()) {} list(userId: string) { return this.repository.list(userId); } async add(userId: string, productId: string) { if (!(await prisma.product.findUnique({ where: { id: productId } }))) throw new Error("Product not found"); return this.repository.add(userId, productId); } remove(userId: string, productId: string) { return this.repository.remove(userId, productId); } }
