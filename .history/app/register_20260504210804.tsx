import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
    commune: "", // ✅ champ texte
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
    { label: "03 - Laghouat", value: "03" },
    { label: "04 - Oum El Bouaghi", value: "04" },
    { label: "05 - Batna", value: "05" },
    { label: "06 - Béjaïa", value: "06" },
    { label: "07 - Biskra", value: "07" },
    { label: "08 - Béchar", value: "08" },
    { label: "09 - Blida", value: "09" },
    { label: "10 - Bouira", value: "10" },
    { label: "11 - Tamanrasset", value: "11" },
    { label: "12 - Tébessa", value: "12" },
    { label: "13 - Tlemcen", value: "13" },
    { label: "14 - Tiaret", value: "14" },
    { label: "15 - Tizi Ouzou", value: "15" },
    { label: "16 - Alger", value: "16" },
    { label: "17 - Djelfa", value: "17" },
    { label: "18 - Jijel", value: "18" },
    { label: "19 - Sétif", value: "19" },
    { label: "20 - Saïda", value: "20" },
    { label: "21 - Skikda", value: "21" },
    { label: "22 - Sidi Bel Abbès", value: "22" },
    { label: "23 - Annaba", value: "23" },
    { label: "24 - Guelma", value: "24" },
    { label: "25 - Constantine", value: "25" },
    { label: "26 - Médéa", value: "26" },
    { label: "27 - Mostaganem", value: "27" },
    { label: "28 - M'Sila", value: "28" },
    { label: "29 - Mascara", value: "29" },
    { label: "30 - Ouargla", value: "30" },
    { label: "31 - Oran", value: "31" },
    { label: "32 - El Bayadh", value: "32" },
    { label: "33 - Illizi", value: "33" },
    { label: "34 - Bordj Bou Arreridj", value: "34" },
    { label: "35 - Boumerdès", value: "35" },
    { label: "36 - El Tarf", value: "36" },
    { label: "37 - Tindouf", value: "37" },
    { label: "38 - Tissemsilt", value: "38" },
    { label: "39 - El Oued", value: "39" },
    { label: "40 - Khenchela", value: "40" },
    { label: "41 - Souk Ahras", value: "41" },
    { label: "42 - Tipaza", value: "42" },
    { label: "43 - Mila", value: "43" },
    { label: "44 - Aïn Defla", value: "44" },
    { label: "45 - Naâma", value: "45" },
    { label: "46 - Aïn Témouchent", value: "46" },
    { label: "47 - Ghardaïa", value: "47" },
    { label: "48 - Relizane", value: "48" },
    { label: "49 - El M'Ghair", value: "49" },
    { label: "50 - El Meniaa", value: "50" },
    { label: "51 - Ouled Djellal", value: "51" },
    { label: "52 - Bordj Badji Mokhtar", value: "52" },
    { label: "53 - Béni Abbès", value: "53" },
    { label: "54 - Timimoun", value: "54" },
    { label: "55 - Touggourt", value: "55" },
    { label: "56 - Djanet", value: "56" },
    { label: "57 - In Salah", value: "57" },
    { label: "58 - In Guezzam", value: "58" },
  ];

  // ✅ REGISTER
  const handleRegister = async () => {
    const isEmpty = (value) => !value || value.trim() === "";

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
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs obligatoires (*)",
      );
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
        form.password,
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
          <View style={styles.headerBox}>
            <Text style={styles.logoText}>PhytoCycle</Text>
            <Text style={styles.subtitle}>Créer un compte 🌱</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            {/* ROLE */}
            <SelectBox
              label="Rôle *"
              value={roles.find((r) => r.value === form.role)?.label}
              placeholder="Sélectionnez un rôle"
              onPress={() => setShowRole(true)}
            />

            {/* RAISON SOCIALE */}
            <Text style={styles.label}>Raison sociale</Text>
            <TextInput
              style={styles.input}
              placeholder="Optionnel"
              placeholderTextColor="#6b7280"
              value={form.raisonSociale}
              onChangeText={(text) => setForm({ ...form, raisonSociale: text })}
            />

            {/* PRENOM */}
            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              value={form.prenom}
              onChangeText={(text) => setForm({ ...form, prenom: text })}
            />

            {/* NOM */}
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={form.nom}
              onChangeText={(text) => setForm({ ...form, nom: text })}
            />

            {/* PHONE */}
            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
            />

            {/* EMAIL */}
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />

            {/* PASSWORD */}
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />

            {/* WILAYA */}
            <SelectBox
              label="Wilaya *"
              value={wilayas.find((w) => w.value === form.wilaya)?.label}
              placeholder="Sélectionnez une wilaya"
              onPress={() => setShowWilaya(true)}
            />

            {/* COMMUNE */}
            <Text style={styles.label}>Commune *</Text>
            <TextInput
              style={styles.input}
              value={form.commune}
              onChangeText={(text) => setForm({ ...form, commune: text })}
            />

            {/* ADRESSE */}
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={styles.input}
              value={form.adresse}
              onChangeText={(text) => setForm({ ...form, adresse: text })}
            />

            {/* POLICY */}
            <View style={styles.policyCard}>
              <Switch value={acceptPolicy} onValueChange={setAcceptPolicy} />
              <Text style={styles.policyText}>J'accepte la politique</Text>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleRegister}
            >
              <Text style={styles.loginText}>
                {loading ? "Chargement..." : "S'inscrire"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.link}>Se connecter</Text>
            </TouchableOpacity>
          </View>
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

  loginButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

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

  policyCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },

  policyText: {
    color: "#cbd5f5",
    fontSize: 12,
  },
});
});
