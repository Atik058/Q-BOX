import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import React from "react";
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const CUSTOMER_EMAIL = "customer@qbox.com";
const CUSTOMER_PASSWORD = "customer123";

export default function CustomerLogin() {
  const [email, setEmail] = React.useState(CUSTOMER_EMAIL);
  const [password, setPassword] = React.useState(CUSTOMER_PASSWORD);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      console.log("Attempting to login with:", { email });
      
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('http://192.168.151.192:8000/login.php', {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });
    
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);
      
      if (result.status === 'success') {
        console.log("Login successful!");
        router.push('/customer');
      } else {
        console.log("Login failed:", result.message);
        alert(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 px-8 justify-center">
            {/* Logo/Header Section */}
            <View className="items-center mb-10">
              <Image
                source={require('../../assets/images/qbox logo.png')}
                className="w-32 h-32 mb-4"
              />
              <Text className="text-3xl font-bold text-gray-800">Customer Portal</Text>
              <Text className="text-gray-500 mt-2">Inventory Management System</Text>
            </View>

            {/* Login Form */}
            <View>
              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                  <MaterialIcons name="email" size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                  <MaterialIcons name="lock" size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700"
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons 
                      name={showPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity className="items-end mb-6">
                <Text className="text-indigo-600 text-sm">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className="bg-indigo-600 py-4 rounded-lg shadow-md mb-4"
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-500">Don&apos;t have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/customer-signup")}>
                  <Text className="text-indigo-600 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="absolute bottom-8 left-0 right-0 items-center">
              <Text className="text-gray-400 text-xs">
                © 2023 Qbox Inventory. All rights reserved.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}