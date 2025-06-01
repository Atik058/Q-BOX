import { useRouter } from "expo-router";
import * as React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
   const [email, setEmail] = React.useState("");
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <Image
        source={require("../assets/images/landing.jpg")}
        className="w-full h-72 object-cover"
      />

      <View className="flex-1 bg-blue-600 px-6  justify-center items-center">
        <Text className="text-4xl font-bold text-white mb-3 text-center">
          Welcome to Qbox
        </Text>

        <Text className="text-lg text-white mb-2 text-center">
          An Inventory Management Solution
        </Text>

        <Text className="text-base text-white text-center mb-16 max-w-[80%]">
          Keep track of your inventory stock easily and efficiently with our powerful tools.
        </Text>

        <TouchableOpacity
          className="bg-white py-4 px-12 rounded-lg shadow-lg shadow-blue-900/50 active:opacity-80"
          onPress={() => router.navigate("home" as any)}
        >
          <Text className="text-blue-600 text-lg font-bold">
            Get Started
          </Text>
        </TouchableOpacity>

        <View className="absolute bottom-8">
          <Text className="text-blue-200 text-sm">
            Your inventory management made simple
          </Text>
        </View>
      </View>
    </View>
  );
}