import { Slot } from "expo-router";
import React from "react";
import { CartProvider } from "../contexts/CartContext";
import "../global.css";

export default function RootLayout() {
  return (
    <CartProvider>
      <Slot />
    </CartProvider>
  );
}
