import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  hydrated: boolean;
  add: (item: CartItem) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

const BASE_STORAGE_KEY = "nathans-clothes-cart";
const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Each user has their own cart storage key. When logged out, guest cart is used.
  const storageKey = useMemo(() => {
    return user ? `${BASE_STORAGE_KEY}_${user.id}` : `${BASE_STORAGE_KEY}_guest`;
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, [storageKey, authLoading]);

  useEffect(() => {
    if (!hydrated || authLoading) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, hydrated, storageKey, authLoading]);

  const value = useMemo<CartState>(() => {
    const key = (id: string, size: string) => `${id}__${size}`;
    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotalCents: items.reduce((n, i) => n + i.quantity * i.priceCents, 0),
      hydrated,
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
