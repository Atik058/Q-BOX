import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      // Upload to imgbb
      const base64Img = result.assets[0].base64;
      const apiKey = "6d3c163b49157e527fad5ae1bf01bfa1"; // Replace with your real API key

      const formData = new FormData();
      formData.append("image", base64Img ?? "");

      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });
        const imgData = await res.json();
        if (imgData.success) {
          setImageUrl(imgData.data.url);
        } else {
          Alert.alert("Image Upload Failed");
        }
      } catch (err) {
        Alert.alert("Image Upload Error", err instanceof Error ? err.message : "An unknown error occurred");
      }
    }
  };

  const handleAddProduct = async () => {
    if (!name || !quantity || !price || !imageUrl) {
      Alert.alert("Missing Fields", "Please fill all fields and pick an image.");
      return;
    }

    try {
      const response = await fetch("http://192.168.39.192:8000/add-product.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          stock: parseInt(quantity),
          price: parseFloat(price),
          image_url: imageUrl,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        Alert.alert("Success", "Product added successfully.");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to add product.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to server.");
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Add New Product</Text>

      <TextInput className="border p-3 mb-3" placeholder="Product Name" value={name} onChangeText={setName} />
      <TextInput className="border p-3 mb-3" placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput className="border p-3 mb-3" placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      <TextInput className="border p-3 mb-3" placeholder="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />

      <TouchableOpacity onPress={pickImage} className="bg-gray-200 p-3 rounded mb-3">
        <Text className="text-center text-gray-700 font-medium">{image ? "Change Image" : "Pick Product Image"}</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 12 }} />
      )}

      <TouchableOpacity onPress={handleAddProduct} className="bg-indigo-600 p-4 rounded">
        <Text className="text-white text-center font-bold">Add Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
