import { OrderRepository } from "./order.repository.js";
import type { CheckoutDTO, UpdateOrderStatusDTO } from "./order.dto.js";
import type { OrderWithDetails } from "./order.types.js";
import { ORDER_TRANSITIONS } from "./order.types.js";
import prisma from "../../config/db.js";
import { sendEmail } from "../../lib/email.js";

export class OrderService {
  private readonly repository: OrderRepository;
  constructor(repository?: OrderRepository) { this.repository = repository ?? new OrderRepository(); }
  async checkout(userId: string, data: CheckoutDTO): Promise<OrderWithDetails> {
    const order = await this.repository.checkout(userId, data);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
    if (user) void sendEmail({ to: user.email, subject: `Order ${order.id} confirmed`, html: `<p>Hello ${user.name},</p><p>Your order has been created successfully.</p><p>Total: ${order.totalAmount.toLocaleString("vi-VN")} VND</p>` }).catch(() => undefined);
    return order;
  }
  list(userId?: string): Promise<OrderWithDetails[]> { return this.repository.findMany(userId); }
  findById(id: string, userId?: string): Promise<OrderWithDetails | null> { return this.repository.findById(id, userId); }

  async updateStatus(id: string, data: UpdateOrderStatusDTO, changedById?: string): Promise<OrderWithDetails | null> {
    const order = await this.repository.findById(id);
    if (!order) return null;
    if (!ORDER_TRANSITIONS[order.status].includes(data.status)) throw new Error(`Invalid order transition from ${order.status} to ${data.status}`);
    return this.repository.updateStatus(id, data, changedById);
  }
}
