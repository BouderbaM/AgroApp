import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Agriculteur() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser(snap.data());
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading agriculteur...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>🌾 Espace Agriculteur</Text>

      <Text>👤 Nom: {user.nom}</Text>
      <Text>👤 Prénom: {user.prenom}</Text>
      <Text>📍 Wilaya: {user.wilaya}</Text>
      <Text>📧 Email: {user.email}</Text>
      <Text>📱 Phone: {user.phone}</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18 }}>📦 Mes options:</Text>

        <TouchableOpacity style={{ marginTop: 10 }}>
          <Text>➕ Ajouter produit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 10 }}>
          <Text>📊 Mes statistiques</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 10 }}>
          <Text>📦 Mes produits</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={logout} style={{ marginTop: 30 }}>
        <Text>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
