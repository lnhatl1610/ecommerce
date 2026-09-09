# Database Schema / ERD

Nguồn chân lý: `backend/prisma/schema.prisma`.

## Models

| Model | Quan hệ chính | Index / Unique |
|---|---|---|
| User | Address[], Order[], Cart?, Review[], Wishlist[] | `email` unique |
| Address | User, Order[] | `userId` |
| Category | parent/children, Product[] | `slug` unique |
| Product | Category, Variant[], Image[], Review[], Wishlist[] | `slug` unique; `categoryId`, `status` |
| ProductVariant | Product, CartItem[], OrderItem[] | `sku` unique; `productId` |
| ProductImage | Product | `productId` |
| Cart | User? / sessionId, CartItem[] | `userId` unique, `sessionId` unique |
| CartItem | Cart, Variant | unique(`[cartId, variantId]`) |
| Order | User, Address?, Coupon?, OrderItem[], Payment[] | `userId`, `status` |
| OrderItem | Order, Variant | `orderId` |
| Payment | Order | `orderId` |
| Review | Product, User | unique(`[productId, userId]`) |
| Coupon | Order[] | `code` unique |
| Wishlist | User, Product | unique(`[userId, productId]`) |

## Enums

`Role`, `ProductStatus`, `OrderStatus`, `PaymentStatus`, `PaymentProvider`, `PaymentMethod`, `DiscountType`.

## Order state machine

```text
PENDING → PAID → SHIPPING → COMPLETED
    ↘ CANCELLED (từ PENDING/PAID; hoàn stock nếu đã trừ)
```

## Migration convention

```bash
cd backend
npx prisma validate
npx prisma migrate dev --name <snake_case_description>
npx prisma generate
```

Không sửa migration đã apply trên shared environments; tạo migration mới.
