import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../../contexts/CartContext";

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Add some products to your cart before checking out.");
      return;
    }

    // Check stock for each item
    const unavailable = cartItems.find(item => (item.quantity || 1) > item.stock);
    if (unavailable) {
      Alert.alert(
        "Not Available",
        `Only ${unavailable.stock} of "${unavailable.name}" available in stock.`
      );
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    const total = getTotal();

    try {
      const response = await fetch("http://192.168.39.192:8000/checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          items: cartItems,
          total,
        }),
      });
      const result = await response.json();
      if (result.status === "success") {
        Alert.alert("Checkout", "Order sent! Waiting for admin approval.");
        clearCart();
      } else {
        Alert.alert("Error", result.message || "Checkout failed.");
      }
    } catch (err) {
      Alert.alert("Error", "Network error during checkout.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 16 }}>
      <Text style={styles.heading}>View Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image_url }} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>৳{item.price}</Text>
            </View>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity || 1}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={styles.removeBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ৳{getTotal()}</Text>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  itemPrice: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  removeBtn: {
    fontSize: 18,
    color: "red",
    marginLeft: 8,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 16,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
});