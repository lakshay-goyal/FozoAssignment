import "./global.css"
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
 
export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(home)");
    }
  }, [isLoaded, isSignedIn]);

  const handleAuthRedirect = () => {
    router.push("/(auth)/sign-in");
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500 mb-8">
        Welcome to Nativewind!
      </Text>
      <TouchableOpacity
        onPress={handleAuthRedirect}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold text-lg">
          Go to Authentication
        </Text>
      </TouchableOpacity>
    </View>
  );
}