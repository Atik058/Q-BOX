import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

// ✅ Define Product type
type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string; // optional, if you don't have images for all
};

export default function ProductScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://192.168.39.192:8000/get-products.php"); // Update with your PHP API
            const data = await res.json();
            if (Array.isArray(data.products)) {
                setProducts(data.products);
            } else {
                console.error("Unexpected response:", data);
            }

        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    // ✅ Typed renderItem
    const renderItem = ({ item }: { item: Product }) => (
        <View className="bg-white mb-4 p-4 rounded-xl shadow-sm">
            {item.image_url ? (
                <Image
                    source={{ uri: item.image_url }}
                    style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 8 }}
                    resizeMode="cover"
                />
            ) : null}
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-gray-600">{item.description?.slice(0, 60)}...</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <View>
                    <Text className="text-indigo-600 font-semibold">৳ {item.price}</Text>
                    <Text className="text-sm text-gray-500">Stock: {item.stock}</Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#4f46e5",
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        marginLeft: 16,
                    }}
                    onPress={() => router.push({ pathname: "/admin/edit-product", params: { id: item.id } })}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold mb-4 text-gray-800">All Products</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4f46e5" />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </SafeAreaView>
    );
}
