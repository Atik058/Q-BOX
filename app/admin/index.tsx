import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AdminPanel() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const res = await fetch("http://192.168.39.192:8000/get-product-count.php");
        const data = await res.json();
        setTotalProducts(data.total);
      } catch (err) {
        setTotalProducts(0);
      }
    };
    fetchProductCount();
  }, []);

  useEffect(() => {
    const fetchTotalStock = async () => {
      try {
        const res = await fetch("http://192.168.39.192:8000/get-total-stock.php");
        const data = await res.json();
        setTotalStock(data.total_stock);
      } catch (err) {
        setTotalStock(0);
      }
    };
    fetchTotalStock();
  }, []);

  const stats = [
    { title: "Total Products", value: totalStock.toLocaleString(), icon: "box", color: "bg-blue-100", textColor: "text-blue-600" },
    { title: "Low Stock", value: "42", icon: "exclamation", color: "bg-amber-100", textColor: "text-amber-600" },
    { title: "Total Items", value: totalProducts.toLocaleString(), icon: "list-alt", color: "bg-purple-100", textColor: "text-purple-600" },
    { title: "Today's Orders", value: "36", icon: "shopping-cart", color: "bg-green-100", textColor: "text-green-600" },
  ];

  const quickActions = [
    { title: "Add Product", icon: "plus", screen: "add-product", color: "bg-indigo-500" },
    { title: "Manage Order", icon: "shopping-cart", screen: "manage-users", color: "bg-emerald-500" }, // Changed text and icon
    { title: "Generate Report", icon: "file-text", screen: "report", color: "bg-amber-500" },
    { title: "Settings", icon: "settings", screen: "settings", color: "bg-gray-500" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-10">
      {/* Header */}
      <View className="flex-row justify-between items-center p-5 bg-white shadow-sm">
        <View className="flex-row items-center">
          <Image
            source={require('../../assets/images/qbox logo.png')}
            className="w-10 h-10 mr-3"
          />
          <Text className="text-xl font-bold text-gray-800">Qbox Admin</Text>
        </View>
        <TouchableOpacity>
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="#4b5563" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Welcome Banner */}
        <View className="mx-5 mt-5 p-5 bg-indigo-600 rounded-xl">
          <Text className="text-white text-lg font-semibold">Welcome back, Admin!</Text>
          <Text className="text-indigo-100 mt-1">Here&apos;s what&apos;s happening with your inventory today</Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between px-5 mt-5">
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[48%] p-4 mb-4 ${stat.color} rounded-lg`}
              activeOpacity={0.8}
              onPress={() => {
                // Remove routing from "Today's Orders"
              }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-500 text-sm">{stat.title}</Text>
                  <Text className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</Text>
                </View>
                <FontAwesome5 name={stat.icon} size={24} color={stat.textColor.split('text-')[1] + "00"} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-5 mt-2">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                className={`w-[48%] p-4 mb-4 ${action.color} rounded-lg items-center justify-center`}
                activeOpacity={0.8}
                onPress={() => {
                  if (action.screen === "add-product") {
                    router.push("/admin/add-product");
                  } else if (action.screen === "manage-users") {
                    router.push("/admin/checkouts");
                  } else if (action.screen === "report") {
                    router.push("/admin/report"); // Route to report.tsx when Generate Report is clicked
                  }
                  // You can add more conditions here if you implement those screens later:
                  // else if (action.screen === "settings") {
                  //   router.push("/admin/settings");
                  // }
                }}
              >
                <Feather name={action.icon as any} size={24} color="white" />
                <Text className="text-white font-medium mt-2 text-center">{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-3 bg-white border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <MaterialIcons name="dashboard" size={24} color="#4f46e5" />
          <Text className="text-indigo-600 text-xs mt-1">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push({ pathname: "/admin/product" })}>
          <Feather name="package" size={24} color="#9ca3af" />
          <Text className="text-gray-400 text-xs mt-1">Products</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="users" size={24} color="#9ca3af" />
          <Text className="text-gray-400 text-xs mt-1">Users</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="settings" size={24} color="#9ca3af" />
          <Text className="text-gray-400 text-xs mt-1">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}