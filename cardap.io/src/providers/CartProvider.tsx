// CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { TItem } from "../domains/Item/item";

interface CartItem {
  item: TItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: TItem) => void;
  removeFromCart: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  toggleCart: () => void;
  isOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const addToCart = (item: TItem) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.item.id === item.id
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((cartItem) => cartItem.item.id !== itemId));
  };

  const decreaseQuantity = (itemId: string) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.item.id === itemId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          return prev.map((cartItem) =>
            cartItem.item.id === itemId
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
        }
        return prev.filter((cartItem) => cartItem.item.id !== itemId);
      }
      return prev;
    });
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        isOpen,
        toggleCart,
        decreaseQuantity,
        cart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
