type ToastType = "success" | "info";

export function showToast(message: string, type: ToastType = "success") {
  window.dispatchEvent(new CustomEvent("dashboard:toast", { detail: { id: Date.now(), message, type } }));
}
