import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Register() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Erreur", "Veuillez remplir les champs");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        ...form,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Succès", "Compte créé !");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121414" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* HEADER */}
          <View style={{ alignItems: "center", marginBottom: 25 }}>
            <Text
              style={{ color: "#4CAF50", fontSize: 26, fontWeight: "bold" }}
            >
              PhytoCycle
            </Text>
            <Text style={{ color: "#9CA3AF", marginTop: 5 }}>
              Créer un compte
            </Text>
          </View>

          {/* CARD FORM */}
          <View
            style={{
              backgroundColor: "#1C1E21",
              borderRadius: 12,
              padding: 20,
              borderWidth: 1,
              borderColor: "#2D3035",
            }}
          >
            {/* INPUT */}
            {["nom", "prenom", "email", "phone", "password"].map((field) => (
              <View key={field} style={{ marginBottom: 15 }}>
                <Text style={{ color: "#9CA3AF", marginBottom: 5 }}>
                  {field}
                </Text>

                <TextInput
                  style={{
                    backgroundColor: "#121414",
                    borderRadius: 8,
                    padding: 12,
                    color: "#fff",
                    borderWidth: 1,
                    borderColor: "#2D3035",
                  }}
                  secureTextEntry={field === "password"}
                  onChangeText={(text) => setForm({ ...form, [field]: text })}
                />
              </View>
            ))}
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={{
              backgroundColor: "#4CAF50",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={handleRegister}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  S'inscrire
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#9CA3AF" }}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
