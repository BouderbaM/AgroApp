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

  // --- States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Backend Logic ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      // 🔐 تسجيل الدخول
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 🧠 جلب البيانات من Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const role = data.role;

        // 🚀 توجيه حسب role كما في منطقك الأصلي
        if (role === "agriculteur") {
          router.replace("/home");
        } else if (role === "vendeur") {
          router.replace("/vendeur");
        } else if (role === "collecteur") {
          router.replace("/collecteur");
        } else {
          router.replace("/home");
        }
      } else {
        Alert.alert("Erreur", "Utilisateur introuvable في قاعدة البيانات");
      }
    } catch (error: any) {
      Alert.alert("Erreur de connexion", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Text style={styles.logoText}>PhytoCycle</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Input: Email (أو الهاتف حسب إعدادك) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: mail@example.com"
                placeholderTextColor="#5A5E62"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input: Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                placeholderTextColor="#5A5E62"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Action Button: Connexion */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Connexion</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Footer: Create Account Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.linkText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles (Dark Theme المطابق للصورة) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4CAF50",
    letterSpacing: 0.5,
  },
  subLogoText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
    fontWeight: "bold",
  },
  formSection: {
    width: "100%",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1A1C1E",
    borderWidth: 1,
    borderColor: "#2D3135",
    borderRadius: 8,
    height: 55,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#8E949A",
    fontSize: 14,
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
});
