import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PageLoading() {
  return (
    <LinearGradient
      colors={['#EDFFA9', '#D6EE72']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <ActivityIndicator size="large" color="#000" />
    </LinearGradient>
  );
}