import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity/lib/queries/query";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColorway: string;
  selectedSize: string;
}

interface StoreState {
  items: CartItem[];

  // Selection state
  selectedColorway: string | null;
  selectedSize: string | null;
  setSelectedColorway: (colorway: string | null) => void;
  setSelectedSize: (size: string | null) => void;
  resetSelection: () => void;

  // Cart actions
  addItem: (product: Product) => void;
  removeItem: (productId: string, colorway: string, size: string) => void;
  deleteCartProduct: (productId: string, colorway: string, size: string) => void;
  resetCart: () => void;

  // Getters
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string, colorway: string, size: string) => number;
  getGroupedItems: () => CartItem[];
  getStockForSelection: (product: Product) => number;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],

      // ── SELECTION ──────────────────────────────────────
      selectedColorway: null,
      selectedSize: null,

      setSelectedColorway: (colorway) =>
        set({ selectedColorway: colorway, selectedSize: null }),

      setSelectedSize: (size) => set({ selectedSize: size }),

      resetSelection: () =>
        set({ selectedColorway: null, selectedSize: null }),

      // ── CART ACTIONS ───────────────────────────────────
      addItem: (product) => {
        const { selectedColorway, selectedSize } = get();
        if (!selectedColorway || !selectedSize) return;

        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product._id === product._id &&
              item.selectedColorway === selectedColorway &&
              item.selectedSize === selectedSize
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id &&
                item.selectedColorway === selectedColorway &&
                item.selectedSize === selectedSize
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: 1, selectedColorway, selectedSize },
            ],
          };
        });
      },

      removeItem: (productId, colorway, size) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            const isMatch =
              item.product._id === productId &&
              item.selectedColorway === colorway &&
              item.selectedSize === size;

            if (isMatch) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),

      deleteCartProduct: (productId, colorway, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product._id === productId &&
                item.selectedColorway === colorway &&
                item.selectedSize === size
              )
          ),
        })),

      resetCart: () => set({ items: [] }),

      // ── GETTERS ────────────────────────────────────────
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        ),

      getSubTotalPrice: () =>
        get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          return total + (price - discount) * item.quantity;
        }, 0),

      getItemCount: (productId, colorway, size) => {
        const item = get().items.find(
          (item) =>
            item.product._id === productId &&
            item.selectedColorway === colorway &&
            item.selectedSize === size
        );
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      getStockForSelection: (product) => {
        const { selectedColorway, selectedSize } = get();
        if (!selectedColorway || !selectedSize) return 0;

        const colorway = product.colorways?.find(
          (c) => c.name === selectedColorway
        );
        if (!colorway) return 0;

        const sizeConfig = colorway.sizes?.find(
          (s) => s.size === selectedSize
        );
        return sizeConfig?.stock ?? 0;
      },
    }),
    { name: "cart-store" }
  )
);

export default useStore;