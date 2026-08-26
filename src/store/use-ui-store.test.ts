import { useUIStore } from "./use-ui-store";

// Reset the store to its initial state before every test to avoid state leaking
// between test cases, since zustand stores are singletons.
const initialState = useUIStore.getState();

beforeEach(() => {
  useUIStore.setState(initialState, true);
});

describe("useUIStore", () => {
  it("has the correct initial state", () => {
    const state = useUIStore.getState();
    expect(state.isSidebarOpen).toBe(false);
    expect(state.isCartOpen).toBe(false);
    expect(state.activeModal).toBeNull();
    expect(state.cartIconRect).toBeNull();
    expect(state.isFlying).toBe(false);
  });

  it("toggles the sidebar open and closed", () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(true);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it("closes the sidebar directly", () => {
    useUIStore.getState().toggleSidebar();
    useUIStore.getState().closeSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it("toggles the cart drawer open and closed", () => {
    useUIStore.getState().toggleCart();
    expect(useUIStore.getState().isCartOpen).toBe(true);

    useUIStore.getState().closeCart();
    expect(useUIStore.getState().isCartOpen).toBe(false);
  });

  it("opens and closes a named modal", () => {
    useUIStore.getState().openModal("confirm-delete");
    expect(useUIStore.getState().activeModal).toBe("confirm-delete");

    useUIStore.getState().closeModal();
    expect(useUIStore.getState().activeModal).toBeNull();
  });

  it("sets the cart icon rect for the fly-to-cart animation", () => {
    const rect = { x: 10, y: 20, width: 30, height: 40 };
    useUIStore.getState().setCartIconRect(rect);
    expect(useUIStore.getState().cartIconRect).toEqual(rect);

    useUIStore.getState().setCartIconRect(null);
    expect(useUIStore.getState().cartIconRect).toBeNull();
  });

  it("triggers the cart bounce animation and resets isFlying after the timeout", () => {
    jest.useFakeTimers();

    useUIStore.getState().triggerCartBounce();
    expect(useUIStore.getState().isFlying).toBe(true);

    jest.advanceTimersByTime(300);
    expect(useUIStore.getState().isFlying).toBe(false);

    jest.useRealTimers();
  });
});
