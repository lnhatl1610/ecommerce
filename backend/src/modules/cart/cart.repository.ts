import { CartDAO } from "./cart.dao.js";
import type { AddCartItemDTO, UpdateCartItemDTO } from "./cart.dto.js";
import type { CartOwner, CartWithItems } from "./cart.types.js";

export class CartRepository {
  private readonly dao: CartDAO;

  constructor(dao?: CartDAO) {
    this.dao = dao ?? new CartDAO();
  }

  find(owner: CartOwner): Promise<CartWithItems | null> { return this.dao.find(owner); }
  create(owner: CartOwner): Promise<CartWithItems> { return this.dao.create(owner); }
  upsertItem(cartId: string, data: AddCartItemDTO): Promise<CartWithItems> { return this.dao.upsertItem(cartId, data); }
  updateItem(cartId: string, itemId: string, data: UpdateCartItemDTO): Promise<CartWithItems | null> { return this.dao.updateItem(cartId, itemId, data); }
  removeItem(cartId: string, itemId: string): Promise<CartWithItems | null> { return this.dao.removeItem(cartId, itemId); }
  merge(sourceCartId: string, targetCartId: string): Promise<CartWithItems> { return this.dao.merge(sourceCartId, targetCartId); }
}
