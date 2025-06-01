import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import React from "react";
import { Alert, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

const ADMIN_EMAIL = "admin@qbox.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const [email, setEmail] = React.useState("admin@qbox.com");
  const [password, setPassword] = React.useState("admin123");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setEmail("");
      setPassword("");
      console.log("Login successful");
      router.push("/admin");
    } else {
      Alert.alert("Invalid credentials", "Please check your email and password.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-center">

        <View className=" px-8 justify-center items-center mb-10">
        <Image
            source={require('../../assets/images/qbox logo.png')} // Replace with your logo
            className="w-32 h-32 mb-4"
          />
          <Text className="text-3xl font-bold text-gray-800">Admin Portal</Text>
          <Text className="text-gray-500 mt-2">Inventory Management System</Text>
          
        </View>

        {/* Login Form */}

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <MaterialIcons name="email" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                placeholder="Enter admin email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-8">
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

          {/* Login Button */}
          <TouchableOpacity
            className="bg-indigo-600 py-4 rounded-lg shadow-md"
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
          </TouchableOpacity>

          {/* Admin Hint */}
          <View className="mt-6 items-center">
            <Text className="text-gray-500 text-sm">
              Use admin email: <Text className="font-semibold">{ADMIN_EMAIL}</Text>
            </Text>
          </View>

        {/* Footer */}
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <Text className="text-gray-400 text-xs">
            © 2023 Qbox Inventory. All rights reserved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}