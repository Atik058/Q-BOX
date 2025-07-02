import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useCart } from "../../contexts/CartContext";

type Product = {
  id: number;
  name: string;
  category?: string;
  price: number;
  stock: number;
  image_url?: string;
};

export default function CustomerPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://192.168.39.192:8000/get-products.php`);
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 5) return "Low Stock";
    return "In Stock";
  };

  const getStockStyle = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 5) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("userId");
    router.replace("/auth/customer-login"); // or your login route
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-10">
      {/* Header with Search and Cart */}
      <View className="p-5 bg-white shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Image source={require("../../assets/images/qbox logo.png")} className="w-10 h-10 mr-3" />
            <Text className="text-xl font-bold text-gray-800">Qbox Inventory</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} className="bg-red-100 px-3 py-1 rounded">
            <Text className="text-red-600 font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View className="bg-gray-100 rounded-lg px-3 py-2 flex-row items-center">
          <Feather name="search" size={18} color="#6b7280" className="mr-2" />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-gray-800"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Welcome Banner */}
        <View className="mx-5 mt-5 p-5 bg-indigo-600 rounded-xl">
          <Text className="text-white text-lg font-semibold">Welcome to Qbox!</Text>
          <Text className="text-indigo-100 mt-1">Browse our latest inventory items</Text>
        </View>

        {/* All Products */}
        <View className="px-5 mt-6 mb-10">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-800">All Products</Text>
            <TouchableOpacity>
              <Text className="text-indigo-600">Filter</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4f46e5" />
          ) : filteredProducts.length === 0 ? (
            <Text className="text-gray-500 text-center mt-10">No products found.</Text>
          ) : (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="bg-white rounded-lg p-3 mb-3 flex-row shadow-sm"
                activeOpacity={0.8}
                onPress={() => router.push({
                  pathname: "/customer/product-details",
                  params: { product: JSON.stringify(product) }
                })}
              >
                <Image
                  source={
                    product.image_url
                      ? { uri: product.image_url }
                      : require("../../assets/images/icon.png")
                  }
                  className="w-16 h-16 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-800 font-medium">{product.name}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm mt-1">{product.category || "General"}</Text>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-indigo-600 font-bold">৳{product.price}</Text>
                    <TouchableOpacity
                      className="bg-indigo-100 p-2 rounded-full"
                      onPress={() => {
                        addToCart(product);
                        Alert.alert("Success", "Product added to cart!");
                      }}
                    >
                      <Feather name="shopping-cart" size={16} color="#4f46e5" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation (No Search Tab) */}
      <View className="flex-row justify-around items-center py-3 bg-white border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <MaterialIcons name="home" size={24} color="#4f46e5" />
          <Text className="text-indigo-600 text-xs mt-1">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push("/customer/cart")}>
          <FontAwesome name="shopping-cart" size={24} color="#4f46e5" />
          <Text className="text-indigo-600 text-xs mt-1">Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push("/customer/profile")}>
          <Feather name="user" size={24} color="#9ca3af" />
          <Text className="text-gray-400 text-xs mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
