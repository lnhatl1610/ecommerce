import { WishlistDAO } from "./wishlist.dao.js";
export class WishlistRepository { constructor(private readonly dao: WishlistDAO = new WishlistDAO()) {} list(userId: string) { return this.dao.list(userId); } add(userId: string, productId: string) { return this.dao.add(userId, productId); } remove(userId: string, productId: string) { return this.dao.remove(userId, productId); } }
