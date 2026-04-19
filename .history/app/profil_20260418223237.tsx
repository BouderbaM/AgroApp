import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { auth, db } from "../constants/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  if (!userData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>👤 Profile</Text>

      <Text>Nom: {userData.nom}</Text>
      <Text>Prénom: {userData.prenom}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Phone: {userData.phone}</Text>
      <Text>Wilaya: {userData.wilaya}</Text>
      <Text>Role: {userData.role}</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}