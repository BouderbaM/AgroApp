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

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    wilaya: "",
    role: "agriculteur",
  });

  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showRole, setShowRole] = useState(false);
  const [showWilaya, setShowWilaya] = useState(false);

  const roles = [
    { label: "Agriculteur", value: "agriculteur" },
    { label: "Vendeur", value: "vendeur" },
    { label: "Collecteur", value: "collecteur" },
  ];

  const wilayas = [
    { label: "01 - Adrar", value: "01" },
    { label: "29 - Mascara", value: "29" },
    { label: "31 - Oran", value: "31" },
  ];

  const handleRegister = async () => {
    if (!acceptPolicy) {
      Alert.alert("Attention", "Veuillez accepter la politique");
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
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        phone: form.phone,
        wilaya: form.wilaya,
        role: form.role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Succès", "Compte créé !");
      router.replace("/");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const SelectBox = ({ label, value, placeholder, onPress }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBox} onPress={onPress}>
        <Text style={[styles.selectText, !value && { color: "#8E949A" }]}>
          {value || placeholder}
        </Text>
        <Text style={{ color: "#fff" }}>▼</Text>
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
          <View style={styles.header}>
            <Text style={styles.brandTitle}>PhytoCycle</Text>
            <Text style={styles.brandSubTitle}>S'inscrire</Text>
          </View>

          {/* ROLE */}
          <SelectBox
            label="Rôle"
            value={roles.find((r) => r.value === form.role)?.label}
            placeholder="Sélectionnez un rôle"
            onPress={() => setShowRole(true)}
          />

          {/* PRENOM */}
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre prénom"
            placeholderTextColor="#5A5E62"
            value={form.prenom}
            onChangeText={(text) => setForm({ ...form, prenom: text })}
          />

          {/* NOM */}
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#5A5E62"
            value={form.nom}
            onChangeText={(text) => setForm({ ...form, nom: text })}
          />

          {/* PHONE */}
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+213"
            placeholderTextColor="#5A5E62"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            placeholderTextColor="#5A5E62"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            placeholderTextColor="#5A5E62"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />

          {/* WILAYA */}
          <SelectBox
            label="Wilaya"
            value={wilayas.find((w) => w.value === form.wilaya)?.label}
            placeholder="Sélectionnez une wilaya"
            onPress={() => setShowWilaya(true)}
          />

          {/* POLICY */}
          <View style={styles.policyCard}>
            <Switch value={acceptPolicy} onValueChange={setAcceptPolicy} />
            <Text style={styles.policyText}>
              J'accepte la politique de confidentialité
            </Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Chargement..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          {/* MODAL ROLE */}
          <Modal visible={showRole} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowRole(false)}
            >
              <View style={styles.modalContent}>
                {roles.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.option}
                    onPress={() => {
                      setForm({ ...form, role: item.value });
                      setShowRole(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* MODAL WILAYA */}
          <Modal visible={showWilaya} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowWilaya(false)}
            >
              <View style={styles.modalContent}>
                {wilayas.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.option}
                    onPress={() => {
                      setForm({ ...form, wilaya: item.value });
                      setShowWilaya(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  brandTitle: { fontSize: 28, color: "#4CAF50", fontWeight: "bold" },
  brandSubTitle: { color: "#fff" },

  label: {
    color: "#fff",
    marginTop: 15,
    marginBottom: 6,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#1A1C1E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
  },

  selectBox: {
    backgroundColor: "#1A1C1E",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  selectText: { color: "#fff" },

  policyCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  policyText: { color: "#fff", marginLeft: 10 },

  registerButton: {
    backgroundColor: "#3E7B41",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },

  registerButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#1A1C1E",
    borderRadius: 10,
  },

  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  optionText: { color: "#fff" },
});
