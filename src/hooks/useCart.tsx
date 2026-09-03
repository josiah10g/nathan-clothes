import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  size: string;
  priceCents: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (item: CartItem) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "nathans-clothes-cart";
const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartState>(() => {
    const key = (id: string, size: string) => `${id}__${size}`;
    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotalCents: items.reduce((n, i) => n + i.quantity * i.priceCents, 0),
      add: (item) =>
        setItems((prev) => {
          const existing = prev.find((i) => key(i.productId, i.size) === key(item.productId, item.size));
          if (existing) {
            return prev.map((i) =>
              key(i.productId, i.size) === key(item.productId, item.size)
                ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) }
                : i,
            );
          }
          return [...prev, item];
        }),
      setQuantity: (productId, size, quantity) =>
        setItems((prev) =>
          prev.map((i) =>
            key(i.productId, i.size) === key(productId, size)
              ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) }
              : i,
          ),
        ),
      remove: (productId, size) =>
        setItems((prev) => prev.filter((i) => key(i.productId, i.size) !== key(productId, size))),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
