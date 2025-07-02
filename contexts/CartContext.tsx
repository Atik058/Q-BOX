import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define a product type
export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  quantity?: number; // quantity added to cart
};

// Define context type
type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provide context
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load userId on mount
  useEffect(() => {
    AsyncStorage.getItem("userId").then(setUserId);
  }, []);

  // Load cart for user
  useEffect(() => {
    if (userId) {
      AsyncStorage.getItem(`cart_${userId}`).then((data) => {
        if (data) setCartItems(JSON.parse(data));
        else setCartItems([]);
      });
    }
  }, [userId]);

  // Save cart for user
  useEffect(() => {
    if (userId) {
      AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
