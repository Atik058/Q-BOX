import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React from "react";
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function CustomerSignup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSignup = async () => {
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      console.log("Attempting to connect to:", 'http://192.168.39.192:8000/signup.php');
      console.log("Sending data:", { name, email });
      
      const formData = new URLSearchParams();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      console.log("Form data being sent:", formData.toString());

      const response = await fetch('http://192.168.39.192:8000/signup.php', {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });
    
      const result = await response.json();
      console.log("result", result);
      if (result.status === 'success') {
        const user = result.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('user_id', user.id);
        await AsyncStorage.setItem('user_name', user.name);
        await AsyncStorage.setItem('user_email', user.email);

        const currentUser = await AsyncStorage.getItem('user');
        const userId = await AsyncStorage.getItem('user_id');
        const userName =  await AsyncStorage.getItem('user_name');
        const userEmail =  await AsyncStorage.getItem('user_email');

        console.log("User :", currentUser)
        console.log("user id ", userId );
        console.log("user name ", userName );
        console.log("user email ", userEmail );


        console.log("Signup successful!");
        router.push('/customer');
      } else {
        console.log("Signup failed:", result.message);
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
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
        <View className="items-center mb-8">
          <Image
            source={require('../../assets/images/icon.png')}
            className="w-32 h-32 mb-4"
          />
          <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
          <Text className="text-gray-500 mt-2">Join Qbox Inventory System</Text>
        </View>

        {/* Signup Form */}
        <View>
          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Full Name</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <MaterialIcons name="person" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View className="mb-4">
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
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <MaterialIcons name="lock" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                placeholder="Create password"
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

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Confirm Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <MaterialIcons name="lock-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            className="bg-indigo-600 py-4 rounded-lg shadow-md mb-4"
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-semibold">Create Account</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/customer-login")}>
              <Text className="text-indigo-600 font-semibold">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View className="absolute bottom-8 left-0 right-0 items-center px-8">
          <Text className="text-gray-400 text-xs text-center">
            By creating an account, you agree to our 
            <Text className="text-indigo-400"> Terms of Service </Text> 
            and 
            <Text className="text-indigo-400"> Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}