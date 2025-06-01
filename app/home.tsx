import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';

export default function Home() {
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center bg-white">
            {/* Animated Title */}
            <Animatable.Text 
                animation="fadeInDown" 
                duration={1000}
                className="text-3xl font-bold mb-8 text-gray-800"
            >
                Inventory Management
            </Animatable.Text>
            
            <Animatable.Text 
                animation="fadeIn" 
                duration={1000}
                delay={300}
                className="text-xl text-gray-600 mb-12"
            >
                Log in as
            </Animatable.Text>

            <View className="flex-row flex-wrap justify-center">
                {/* Admin Panel Button */}
                <TouchableOpacity
                    className="bg-indigo-600 py-6 px-8 rounded-xl m-3 w-40 items-center shadow-lg shadow-indigo-500/30 active:opacity-80"
                    onPress={() => router.push({ pathname: "/auth/admin-login" })}
                >
                    <Animatable.View 
                        animation="bounceIn" 
                        duration={1500} 
                        delay={200}
                        className="mb-3"
                    >
                        <MaterialCommunityIcons 
                            name="account-key" 
                            size={50} 
                            color="white" 
                        />
                    </Animatable.View>

                    <Text className="text-white text-lg font-semibold">Admin</Text>
                    <Text className="text-indigo-200 text-sm mt-1">Dashboard Access</Text>
                </TouchableOpacity>

                {/* Customer Panel Button */}
                <TouchableOpacity
                    className="bg-emerald-600 py-6 px-8 rounded-xl m-3 w-40 items-center shadow-lg shadow-emerald-500/30 active:opacity-80"
                    onPress={() => router.push({ pathname: "/auth/customer-login" })}
                >
                    <Animatable.View 
                        animation="bounceIn" 
                        duration={1500} 
                        delay={400}
                        className="mb-3"
                    >
                        <MaterialCommunityIcons 
                            name="storefront" 
                            size={50} 
                            color="white" 
                        />
                    </Animatable.View>

                    <Text className="text-white text-lg font-semibold">Customer</Text>
                    <Text className="text-emerald-200 text-sm mt-1">Inventory Access</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Animatable.View 
                animation="fadeInUp"
                duration={1000}
                delay={600}
                className="absolute bottom-10"
            >
                <Text className="text-gray-400 text-sm">
                    Select your role to continue
                </Text>
            </Animatable.View>
        </View>
    );
}