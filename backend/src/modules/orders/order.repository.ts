import { OrderDAO } from "./order.dao.js";
import type { CheckoutDTO, UpdateOrderStatusDTO } from "./order.dto.js";
import type { OrderWithDetails } from "./order.types.js";

export class OrderRepository {
  private readonly dao: OrderDAO;
  constructor(dao?: OrderDAO) { this.dao = dao ?? new OrderDAO(); }
  checkout(userId: string, data: CheckoutDTO): Promise<OrderWithDetails> { return this.dao.checkout(userId, data); }
  findById(id: string, userId?: string): Promise<OrderWithDetails | null> { return this.dao.findById(id, userId); }
  findMany(userId?: string): Promise<OrderWithDetails[]> { return this.dao.findMany(userId); }
  updateStatus(id: string, data: UpdateOrderStatusDTO, changedById?: string): Promise<OrderWithDetails | null> { return this.dao.updateStatus(id, data, changedById); }
}
