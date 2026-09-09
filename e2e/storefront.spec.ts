import { expect, test } from "@playwright/test";
test("register, add to cart and checkout", async ({ page }) => {
  let items: object[] = [];
  await page.route("http://localhost:3000/api/**", async (route) => {
    const request = route.request(); const path = new URL(request.url()).pathname;
    const product = { id: "p1", name: "Áo mẫu", slug: "ao-mau", description: "Mẫu", basePrice: 199000, thumbnail: null, variants: [{ id: "v1", sku: "AO-1", price: 199000, stockQuantity: 5, attributes: {} }] };
    if (path.endsWith("/products")) return route.fulfill({ json: { success: true, data: { items: [product] } } });
    if (path.endsWith("/cart/items") && request.method() === "POST") items = [{ id: "i1", quantity: 1, variant: { ...product.variants[0], product } }];
    if (path.endsWith("/cart") || path.endsWith("/cart/items")) return route.fulfill({ json: { success: true, data: { id: "c1", items } } });
    if (path.endsWith("/register")) return route.fulfill({ json: { success: true, data: { user: { id: "u1", name: "Test User", email: "test@example.com" }, accessToken: "token" } } });
    if (path.endsWith("/orders") && request.method() === "POST") { items = []; return route.fulfill({ json: { success: true, data: { id: "order-1234", status: "PENDING", totalAmount: 199000, paymentMethod: "COD", createdAt: new Date().toISOString() } } }); }
    if (path.endsWith("/orders")) return route.fulfill({ json: { success: true, data: [] } });
    return route.fulfill({ json: { success: true, data: {} } });
  });
  await page.goto("/");
  await page.getByLabel("Tài khoản").click();
  await page.getByText("Chưa có tài khoản? Đăng ký").click();
  await page.getByPlaceholder("Họ tên").fill("Test User");
  await page.getByPlaceholder("Email").fill("test@example.com");
  await page.getByPlaceholder("Mật khẩu").fill("Password123!");
  await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
  await page.getByText("NHAT STORE").click();
  await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
  await page.getByLabel("Giỏ hàng").click();
  page.on("dialog", (dialog) => dialog.accept(""));
  await page.getByRole("button", { name: "Checkout COD" }).click();
  await expect(page.getByText(/Đặt hàng thành công/)).toBeVisible();
});
