import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

export default function Profile() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // You may want to fetch more user info from backend using userId
      const userId = await AsyncStorage.getItem("userId");
      const name = await AsyncStorage.getItem("userName");
      const email = await AsyncStorage.getItem("userEmail");
      setUser({ id: userId || "", name: name || "", email: email || "" });
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <View className="bg-indigo-50 p-8 rounded-xl shadow-md items-center">
        <Text className="text-2xl font-bold text-indigo-700 mb-2">Profile</Text>
        <Text className="text-lg text-gray-800 mb-1">Name: {user?.name}</Text>
        <Text className="text-lg text-gray-800 mb-1">Email: {user?.email}</Text>
        <Text className="text-base text-gray-500">User ID: {user?.id}</Text>
      </View>
    </SafeAreaView>
  );
}