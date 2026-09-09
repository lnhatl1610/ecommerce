export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang chuẩn bị hàng",
  PAID: "Đã thanh toán",
  SHIPPED: "Đã bàn giao vận chuyển",
  OUT_FOR_DELIVERY: "Đang giao hàng",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao thành công",
  COMPLETED: "Hoàn thành",
  PAYMENT_FAILED: "Thanh toán thất bại",
  CANCELLED: "Đã hủy",
  RETURN_REQUESTED: "Yêu cầu đổi trả",
  RETURN_PROCESSING: "Đang xử lý đổi trả",
  REFUNDED: "Đã hoàn tiền",
  PARTIALLY_REFUNDED: "Hoàn tiền một phần",
  DELIVERY_FAILED: "Giao hàng thất bại",
};

export const getOrderStatusLabel = (status: string): string => ORDER_STATUS_LABELS[status] ?? status;
