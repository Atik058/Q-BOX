import React from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCart } from "../../contexts/CartContext";

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Add some products to your cart before checking out.");
      return;
    }
    // Here you would send cartItems to your backend to create an order
    Alert.alert("Checkout", "Order placed successfully!");
    clearCart();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 16 }}>
      <Text style={styles.heading}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>৳{item.price}</Text>
            </View>
            <View style={styles.qtyContainer}>
              <Text>Qty:</Text>
              <TextInput
                style={styles.qtyInput}
                keyboardType="numeric"
                value={item.quantity?.toString() || "1"}
                onChangeText={text => {
                  const qty = parseInt(text) || 1;
                  updateQuantity(item.id, qty);
                }}
              />
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={styles.removeBtn}>Remove</Text>
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
  qtyInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    width: 40,
    height: 32,
    marginLeft: 6,
    textAlign: "center",
    padding: 0,
  },
  removeBtn: {
    color: "red",
    fontWeight: "bold",
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