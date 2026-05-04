import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
    raisonSociale: "",
  });

  const roles = [
    { label: "Agriculteur", value: "agriculteur" },
    { label: "Revendeur", value: "revendeur" },
    { label: "Distributeur", value: "distributeur" },
    { label: "Fournisseur", value: "fournisseur" },
  ];

  const wilayas = [
    { label: "01 - Adrar", value: "01" },
    { label: "02 - Chlef", value: "02" },
    { label: "31 - Oran", value: "31" },
    { label: "29 - Mascara", value: "29" },
    { label: "16 - Alger", value: "16" },
  ];

  const handleRegister = async () => {
    const isEmpty = (v: string) => !v || v.trim() === "";

    if (
      isEmpty(form.prenom) ||
      isEmpty(form.nom) ||
      isEmpty(form.email) ||
      isEmpty(form.phone) ||
      isEmpty(form.password) ||
      isEmpty(form.wilaya) ||
      isEmpty(form.commune) ||
      isEmpty(form.adresse)
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    if (!acceptPolicy) {
      Alert.alert("Attention", "Veuillez accepter la politique");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        wilaya: form.wilaya,
        commune: form.commune.trim(),
        adresse: form.adresse.trim(),
        role: form.role,
        raisonSociale: form.raisonSociale?.trim() || "",
        createdAt: new Date().toISOString(),
      });

      setShowPopup(true);
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const SelectBox = ({ label, value, placeholder, onPress }: any) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={onPress}>
        <Text style={{ color: value ? "#fff" : "#6b7280" }}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.headerBox}>
            <Text style={styles.logoText}>PhytoCycle</Text>
            <Text style={styles.subtitle}>Créer un compte 🌱</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>

            <SelectBox
              label="Rôle *"
              value={roles.find(r => r.value === form.role)?.label}
              placeholder="Sélectionnez"
              onPress={() => setShowRole(true)}
            />

            <Text style={styles.label}>Raison sociale</Text>
            <TextInput
              style={styles.input}
              value={form.raisonSociale}
              onChangeText={(t) => setForm({ ...form, raisonSociale: t })}
            />

            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              value={form.prenom}
              onChangeText={(t) => setForm({ ...form, prenom: t })}
            />

            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={form.nom}
              onChangeText={(t) => setForm({ ...form, nom: t })}
            />

            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />

            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
            />

            <SelectBox
              label="Wilaya *"
              value={wilayas.find(w => w.value === form.wilaya)?.label}
              placeholder="Choisir"
              onPress={() => setShowWilaya(true)}
            />

            <Text style={styles.label}>Commune *</Text>
            <TextInput
              style={styles.input}
              value={form.commune}
              onChangeText={(t) => setForm({ ...form, commune: t })}
            />

            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={styles.input}
              value={form.adresse}
              onChangeText={(t) => setForm({ ...form, adresse: t })}
            />

            <View style={styles.policyCard}>
              <Switch value={acceptPolicy} onValueChange={setAcceptPolicy} />
              <Text style={styles.policyText}>
                J'accepte la politique
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                {loading ? "Chargement..." : "S'inscrire"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.link}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          {/* MODALS */}
          <Modal visible={showRole} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {roles.map(r => (
                  <TouchableOpacity
                    key={r.value}
                    onPress={() => {
                      setForm({ ...form, role: r.value });
                      setShowRole(false);
                    }}
                  >
                    <Text style={styles.option}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          <Modal visible={showWilaya} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {wilayas.map(w => (
                  <TouchableOpacity
                    key={w.value}
                    onPress={() => {
                      setForm({ ...form, wilaya: w.value });
                      setShowWilaya(false);
                    }}
                  >
                    <Text style={styles.option}>{w.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          <Modal visible={showPopup} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={{ color: "#2ecc71", fontWeight: "bold" }}>
                  Inscription réussie ✅
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setShowPopup(false);
                    router.replace("/");
                  }}
                >
                  <Text style={styles.link}>Continuer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1f16" },
  scrollContent: { flexGrow: 1, padding: 20 },

  headerBox: { alignItems: "center", marginBottom: 30 },
  logoText: { color: "#2ecc71", fontSize: 32, fontWeight: "900" },
  subtitle: { color: "#94a3b8" },

  card: {
    backgroundColor: "#0f2a1e",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  label: { color: "#cbd5f5", marginTop: 10 },

  input: {
    backgroundColor: "#0b1f16",
    borderWidth: 1,
    borderColor: "#1e3a2f",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },

  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#94a3b8" },
  link: { color: "#2ecc71", marginLeft: 5 },

  policyCard: { flexDirection: "row", alignItems: "center", gap: 10 },

  policyText: { color: "#cbd5f5", fontSize: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#0f2a1e",
    padding: 20,
    borderRadius: 10,
  },

  option: { color: "#fff", padding: 10 },
});