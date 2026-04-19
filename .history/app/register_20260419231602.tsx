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

  // ✅ STATES
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
    role: "agriculteur",
  });

  // ✅ DATA
  const roles = [
    { label: "Agriculteur", value: "agriculteur" },
    { label: "Vendeur", value: "vendeur" },
    { label: "Collecteur", value: "collecteur" },
  ];

  const wilayas = [
    { label: "01 - Adrar", value: "01" },
    { label: "31 - Oran", value: "31" },
    { label: "29 - Mascara", value: "29" },
    { label: "16 - Alger", value: "16" },
  ];

  // ✅ REGISTER
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
        form.password
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

      // ✅ SHOW POPUP
      setShowPopup(true);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SELECT BOX
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
          
          {/* HEADER */}
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
            value={form.prenom}
            onChangeText={(text) => setForm({ ...form, prenom: text })}
          />

          {/* NOM */}
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={form.nom}
            onChangeText={(text) => setForm({ ...form, nom: text })}
          />

          {/* PHONE */}
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
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
            <Switch
              value={acceptPolicy}
              onValueChange={setAcceptPolicy}
              trackColor={{ false: "#2D3135", true: "#4CAF50" }}
              thumbColor={acceptPolicy ? "#FFFFFF" : "#8E949A"}
            />
            <View style={styles.policyTextContainer}>
              <Text style={styles.policyText}>
                J'accepte la politique de confidentialité
              </Text>
              <TouchableOpacity onPress={() => router.push("/policy")}>
                <Text style={styles.policyLink}>
                  Lire la politique complète
                </Text>
              </TouchableOpacity>
            </View>
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

          {/* ROLE MODAL */}
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

          {/* WILAYA MODAL */}
          <Modal visible={showWilaya} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowWilaya(false)}
            >
              <View style={styles.modalContent}>
                <ScrollView style={{ maxHeight: 400 }}>
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
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* POPUP AFTER REGISTER */}
          <Modal visible={showPopup} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.popupCard}>
                <Text style={styles.popupTitle}>
                  Consignes de sécurité 🌿
                </Text>

                <ScrollView style={{ maxHeight: 300 }}>
                  <Text style={styles.popupText}>
                    👨‍🌾 Agriculteurs{"\n"}
                    🔒 Fermer les flacons{"\n"}
                    🔥 Éviter la chaleur{"\n"}
                    🚫 Ne pas réutiliser{"\n"}
                    ♻️ Déposer en collecte{"\n"}
                    🧤 Porter des gants{"\n\n"}
                    🏪 Vendeurs{"\n"}
                    📢 Sensibiliser clients{"\n"}
                    📦 Collecte des flacons{"\n"}
                    ⚠️ Stockage sécurisé{"\n"}
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.popupButton}
                  onPress={() => {
                    setShowPopup(false);
                    router.replace("/");
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Compris
                  </Text>
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
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { padding: 20 },

  header: { alignItems: "center", marginBottom: 20 },
  brandTitle: { fontSize: 28, color: "#4CAF50", fontWeight: "bold" },
  brandSubTitle: { color: "#fff" },

  label: { color: "#fff", marginTop: 15, marginBottom: 6 },

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
    alignItems: "flex-start",
    marginTop: 20,
  },

  policyTextContainer: { flex: 1, marginLeft: 10 },
  policyText: { color: "#fff", fontSize: 12 },
  policyLink: { color: "#4CAF50", fontSize: 12 },

  registerButton: {
    backgroundColor: "#3E7B41",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },

  registerButtonText: { color: "#fff", textAlign: "center" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    padding: 10,
  },

  option: { padding: 15, borderBottomWidth: 1, borderColor: "#333" },
  optionText: { color: "#fff" },

  popupCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    padding: 20,
  },

  popupTitle: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  popupText: { color: "#fff", fontSize: 13, lineHeight: 20 },

  popupButton: {
    marginTop: 15,
    backgroundColor: "#3E7B41",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});