import { Slot } from "expo-router";
import React from "react";
import { CartProvider } from "../contexts/CartContext";
import { FavoriteProvider } from "../contexts/FavoriteContext";
import "../global.css";

export default function RootLayout() {
  return (
    <CartProvider>
      <FavoriteProvider>
        <Slot />
      </FavoriteProvider>
    </CartProvider>
  );
}
