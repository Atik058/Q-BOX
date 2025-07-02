import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

type Checkout = {
  id: number;
  user_id: number;
  total: number;
  status: string;
  items: string;
  username?: string; // Added optional username field
};

export default function AdminCheckouts() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "accepted">("pending");

  const fetchCheckouts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://192.168.39.192:8000/get-all-checkouts.php");
      const data = await res.json();
      setCheckouts(data.checkouts || []);
    } catch (err) {
      setCheckouts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const handleAccept = async (checkout_id: number) => {
    try {
      const res = await fetch("http://192.168.39.192:8000/admin-accept-checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkout_id }),
      });
      const result = await res.json();
      if (result.status === "success") {
        Alert.alert("Checkout accepted!", "Stock updated.");
        fetchCheckouts();
      } else {
        Alert.alert("Error", result.message || "Failed to accept checkout.");
      }
    } catch (err) {
      Alert.alert("Error", "Network error.");
    }
  };

  // Filter checkouts by selected tab
  const filteredCheckouts = checkouts.filter((item) => item.status === tab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <Text style={{
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 8,
        textAlign: "center",
        color: "#4f46e5"
      }}>
        Orders
      </Text>
      {/* Tab Switch */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: tab === "pending" ? "#4f46e5" : "#e5e7eb",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 20,
            marginRight: 8,
          }}
          onPress={() => setTab("pending")}
        >
          <Text style={{
            color: tab === "pending" ? "#fff" : "#4f46e5",
            fontWeight: "bold"
          }}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: tab === "accepted" ? "#4f46e5" : "#e5e7eb",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 20,
          }}
          onPress={() => setTab("accepted")}
        >
          <Text style={{
            color: tab === "accepted" ? "#fff" : "#4f46e5",
            fontWeight: "bold"
          }}>
            Accepted
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredCheckouts}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={fetchCheckouts}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fff",
                marginBottom: 18,
                padding: 18,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOpacity: 0.07,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16, color: "#374151" }}>
                  Checkout #{item.id}
                </Text>
                <Text style={{
                  backgroundColor: "#e0e7ff",
                  color: "#3730a3",
                  fontWeight: "bold",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  fontSize: 13,
                }}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
              <Text style={{ color: "#6b7280", marginBottom: 2 }}>
                User: <Text style={{ color: "#111827" }}>{item.username || "Unknown"}</Text> (ID: {item.user_id})
              </Text>
              <Text style={{ color: "#6b7280", marginBottom: 2 }}>Total: <Text style={{ color: "#16a34a", fontWeight: "bold" }}>৳{item.total}</Text></Text>
              <Text style={{ color: "#6b7280", marginBottom: 6 }}>Items:</Text>
              <View style={{ marginLeft: 8, marginBottom: 8 }}>
                {JSON.parse(item.items).map((prod: any, idx: number) => (
                  <Text key={idx} style={{ color: "#374151", fontSize: 15 }}>
                    • {prod.name} <Text style={{ color: "#4f46e5" }}>x{prod.quantity}</Text>
                  </Text>
                ))}
              </View>
              {item.status === "pending" && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#4f46e5",
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginTop: 6,
                    alignItems: "center",
                  }}
                  onPress={() => handleAccept(item.id)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                    Accept & Deduct Stock
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32, color: "#6b7280" }}>
              No {tab} orders.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}