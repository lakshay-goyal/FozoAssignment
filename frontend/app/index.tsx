import "./global.css";
import { View, Text, Image } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import PageLoading from "../components/PageLoading";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && isLoaded) {
      router.replace(isSignedIn ? "/(home)" : "/(auth)/sign-in");
    }
  }, [showSplash, isLoaded, isSignedIn]);

  if (!isLoaded || showSplash) {
    return (
      <LinearGradient
        colors={["#EDFFA9", "#D6EE72"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 items-center justify-center"
      >
        <View className="items-center justify-center h-full w-full">
          <Image
            source={{ uri: "https://getfozo.in/brand-full.png" }}
            className="w-32 h-16"
            resizeMode="contain"
          />

        </View>
      </LinearGradient>
    );
  }

  return <PageLoading />;
}