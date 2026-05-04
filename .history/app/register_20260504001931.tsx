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
  View
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Register() {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [showWilaya, setShowWilaya] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    wilaya: "",
    commune: "",
    adresse: "",
    role: "agriculteur",
    raison_social: "",
  });

  const roles = [
    { label: "Agriculteur", value: "agriculteur" },
    { label: "Revendeur", value: "revendeur" },
    { label: "Distributeur", value: "distributeur" },
    { label: "Fournisseur", value: "fournisseur" },
  ];

  const wilayas = [
    { label: "31 - Oran", value: "31" },
    { label: "29 - Mascara", value: "29" },
    { label: "16 - Alger", value: "16" },
  ];

  // ✅ VALIDATION FIXED
  const validateForm = () => {
    const textRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!form.raison_social) return showErr("Raison sociale obligatoire");
    if (!textRegex.test(form.raison_social))
      return showErr("Raison sociale invalide");

    if (!textRegex.test(form.nom)) return showErr("Nom invalide");
    if (!textRegex.test(form.prenom)) return showErr("Prénom invalide");
    if (!textRegex.test(form.commune)) return showErr("Commune invalide");
    if (!textRegex.test(form.adresse)) return showErr("Adresse invalide");

    if (!phoneRegex.test(form.phone))
      return showErr("Téléphone invalide (05/06/07)");

    if (!passwordRegex.test(form.password))
      return showErr("Mot de passe: 8 caractères minimum");

    if (!form.wilaya) return showErr("Wilaya obligatoire");
    if (!acceptPolicy) return showErr("Accepter la politique");

    return true;
  };

  const showErr = (msg) => {
    Alert.alert("Erreur", msg);
    return false;
  };

  // ✅ FIREBASE FIXED
  const handleRegister = async () => {
    if (!validateForm()) return;

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

      console.log("✅ USER CREATED:", user.uid);

      setShowPopup(true);
    } catch (error) {
      console.log("❌ FIREBASE ERROR:", error);
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ title }) => <Text style={styles.label}>{title} *</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>PhytoCycle</Text>
            <Text style={styles.subtitle}>Créer un compte</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Label title="Raison sociale" />
            <TextInput
              style={styles.input}
              value={form.raison_social}
              onChangeText={(t) => setForm({ ...form, raison_social: t })}
            />

            <Label title="Prénom" />
            <TextInput
              style={styles.input}
              value={form.prenom}
              onChangeText={(t) => setForm({ ...form, prenom: t })}
            />

            <Label title="Nom" />
            <TextInput
              style={styles.input}
              value={form.nom}
              onChangeText={(t) => setForm({ ...form, nom: t })}
            />

            <Label title="Téléphone" />
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
            />

            <Label title="Email" />
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />

            <Label title="Mot de passe" />
            <TextInput
              style={styles.input}
              secureTextEntry
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
            />

            {/* BUTTON */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Ionicons name="person-add" size={20} color="#fff" />
                  <Text style={styles.btnText}>Créer compte</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
