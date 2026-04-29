import { createContext, useContext, useState, useEffect,useMemo, type ReactNode } from "react";

/* ---------------- TYPES ---------------- */

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

/* ---------------- CONTEXT ---------------- */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
});
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}, [cartItems]);

const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.productId);

      if (existing) {
        return prev.map(i =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (productId: number) => {
    setCartItems(prev =>
      prev.map(i =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const decreaseQty = (productId: number) => {
    setCartItems(prev =>
      prev
        .map(i =>
          i.productId === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };


  //const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
