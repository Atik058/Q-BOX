// app/admin/edit-product.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, SafeAreaView, Text, TextInput } from "react-native";

export default function EditProduct() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://192.168.39.192:8000/get-product.php?id=${id}`);
                const data = await res.json();
                setProduct(data);
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price.toString());
                setStock(data.stock.toString());
            } catch (err) {
                Alert.alert("Error", "Could not fetch product.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleSave = async () => {
        try {
            const res = await fetch("http://192.168.39.192:8000/update-product.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(id),
                    name,
                    description,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                }),
            });

            const result = await res.json();
            if (result.success) {
                Alert.alert("Success", "Product updated.");
                router.back();
            } else {
                Alert.alert("Error", "Update failed.");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 p-4 bg-white">
            <Text className="text-xl font-bold mb-4">Edit Product</Text>

            <Text>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                className="border p-2 rounded mb-4"
            />

            <Text>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                className="border p-2 rounded mb-4"
                multiline
            />

            <Text>Price</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="border p-2 rounded mb-4"
            />

            <Text>Stock</Text>
            <TextInput
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                className="border p-2 rounded mb-4"
            />

            <Button title="Save Changes" color="#4f46e5" onPress={handleSave} />
        </SafeAreaView>
    );
}
