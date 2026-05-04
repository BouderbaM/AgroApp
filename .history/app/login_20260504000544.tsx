import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const role = snap.data().role;

        if (role === "agriculteur") router.replace("/home");
        else if (role === "vendeur") router.replace("/vendeur");
        else if (role === "collecteur") router.replace("/collecteur");
        else router.replace("/home");
      } else {
        Alert.alert("Erreur", "Utilisateur introuvable");
      }
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.headerBox}>
            <Text style={styles.logoText}>PhytoCycle</Text>
            <Text style={styles.subtitle}>
              Plateforme intelligente de recyclage ♻️
            </Text>
          </View>

          {/* CARD FORM */}
          <View style={styles.card}>
            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="mail@example.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* PASSWORD */}
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre mot de passe"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* BUTTON */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.loginText}>Connexion</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas de compte ?</Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.link}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },

  /* HEADER */
  headerBox: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoText: {
    color: "#2ecc71",
    fontSize: 32,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 5,
    fontSize: 13,
  },

  /* CARD */
  card: {
    backgroundColor: "#0f2a1e",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  label: {
    color: "#cbd5f5",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 13,
  },

  input: {
    backgroundColor: "#0b1f16",
    borderWidth: 1,
    borderColor: "#1e3a2f",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 10,
  },

  /* BUTTON */
  loginButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },

  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* FOOTER */
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },

  footerText: {
    color: "#94a3b8",
  },

  link: {
    color: "#2ecc71",
    fontWeight: "bold",
  },
});
