import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../../contexts/CartContext"; // Add this import

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const params = useLocalSearchParams();
  const product = params.product ? JSON.parse(params.product as string) : null;
  const { addToCart } = useCart(); // Use the cart context

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No product data.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-indigo-50">
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            marginTop: 32,
            width: width * 0.92,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Image
            source={
              product.image_url
                ? { uri: product.image_url }
                : require("../../assets/images/icon.png")
            }
            style={{
              width: width * 0.7,
              height: 220,
              borderRadius: 16,
              marginBottom: 18,
              backgroundColor: "#f3f4f6",
            }}
            resizeMode="cover"
          />

          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">{product.name}</Text>
          <View className="flex-row items-center mb-2">
            <Text className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-lg mr-2">
              ৳{product.price}
            </Text>
            <Text className="text-gray-500 text-base">{product.category || "General"}</Text>
          </View>
          <Text className="text-gray-700 mb-2 text-center">
            Stock:{" "}
            <Text className="font-semibold">{product.stock}</Text>
          </Text>
          <Text className="text-base text-gray-700 text-center mb-4">
            {product.description || "No description available."}
          </Text>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          padding: 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#4f46e5",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() => {
            addToCart(product);
            // Optionally show a confirmation
            Alert.alert("Success", "Product added to cart!");
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}