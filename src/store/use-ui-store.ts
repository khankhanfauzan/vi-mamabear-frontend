import { create } from "zustand";

export interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UIState {
  // Mobile Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Cart Drawer
  isCartOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;

  // Generic Modal State
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Cart Animation State
  cartIconRect: Coordinates | null;
  isFlying: boolean;
  setCartIconRect: (rect: Coordinates | null) => void;
  triggerCartBounce: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Mobile Sidebar
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Cart Drawer
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  closeCart: () => set({ isCartOpen: false }),

  // Generic Modal State
  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  // Cart Animation
  cartIconRect: null,
  isFlying: false,
  setCartIconRect: (rect) => set({ cartIconRect: rect }),
  triggerCartBounce: () => {
    set({ isFlying: true });
    setTimeout(() => set({ isFlying: false }), 300);
  },
}));
