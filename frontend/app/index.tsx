import "./global.css";
import { View, Text } from "react-native";
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
          <Text className="text-[42px] font-semibold text-[#C83A1A] tracking-[1px]">
            FOZO
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return <PageLoading />;
}