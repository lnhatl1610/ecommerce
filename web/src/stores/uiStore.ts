import { create } from "zustand";

interface ToastItem { id: number; message: string }
interface UiState {
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  toasts: ToastItem[];
  toggleMobileMenu: () => void;
  toggleCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  toasts: [],
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  addToast: (message) => set((state) => ({ toasts: [...state.toasts, { id: Date.now(), message }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
