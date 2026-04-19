import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../constants/firebaseConfig";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenue 👋</Text>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
