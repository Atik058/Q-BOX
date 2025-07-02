import React, { createContext, useContext, useState } from "react";

export type Product = {
  id: number;
  name: string;
  category?: string;
  price: number;
  stock: number;
  image_url?: string;
};

type FavoriteContextType = {
  favoriteItems: Product[];
  addToFavorite: (product: Product) => void;
  removeFromFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  const addToFavorite = (product: Product) => {
    setFavoriteItems((prev) =>
      prev.find((item) => item.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromFavorite = (id: number) => {
    setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id: number) => {
    return favoriteItems.some((item) => item.id === id);
  };

  return (
    <FavoriteContext.Provider value={{ favoriteItems, addToFavorite, removeFromFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorite must be used within a FavoriteProvider");
  return context;
};