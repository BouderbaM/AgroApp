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
  Text,
  TextInput,
  TouchableOpacity,
  View
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
    commune: "",
    adresse: "",
    role: "agriculteur",
  });

  // ✅ DATA
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
  const validateForm = () => {
    // Regex للحروف الفرنسية فقط (مع المسافات)
    const frenchRegex = /^[a-zA-Z\s]+$/;
    // Regex للهاتف (يبدأ بـ 05، 06، 07 وله 10 أرقام)
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    // Regex لكلمة المرور (8 حروف وأرقام على الأقل)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!frenchRegex.test(form.nom)) {
      Alert.alert(
        "Erreur",
        "Le Nom doit contenir uniquement des lettres françaises.",
      );
      return false;
    }
    if (!frenchRegex.test(form.prenom)) {
      Alert.alert(
        "Erreur",
        "Le Prénom doit contenir uniquement des lettres françaises.",
      );
      return false;
    }
    if (!frenchRegex.test(form.commune)) {
      Alert.alert(
        "Erreur",
        "La Commune doit contenir uniquement des lettres françaises.",
      );
      return false;
    }
    if (!frenchRegex.test(form.adresse)) {
      Alert.alert(
        "Erreur",
        "L'Adresse doit contenir uniquement des lettres françaises.",
      );
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      Alert.alert(
        "Erreur",
        "Le numéro de téléphone doit commencer par 05, 06 ou 07 et contenir 10 chiffres.",
      );
      return false;
    }
    if (!passwordRegex.test(form.password)) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères (lettres et chiffres).",
      );
      return false;
    }
    if (!form.wilaya) {
      Alert.alert("Erreur", "Veuillez sélectionner une wilaya.");
      return false;
    }
    if (!acceptPolicy) {
      Alert.alert(
        "Attention",
        "Veuillez accepter la politique de confidentialité.",
      );
      return false;
    }
    return true;
  };
  // ✅ REGISTER
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

      setShowPopup(true);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };
  const LabelWithStar = ({ children }) => (
    <Text style={styles.label}>
      {children} <Text style={{ color: "red" }}>*</Text>
    </Text>
  );

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
          <View style={styles.header}>
            <Text style={styles.brandTitle}>PhytoCycle</Text>
            <Text style={styles.brandSubTitle}>S'inscrire</Text>
          </View>

          {/* RÔLE */}
          <LabelWithStar>Rôle</LabelWithStar>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowRole(true)}
          >
            <Text style={styles.selectText}>
              {roles.find((r) => r.value === form.role)?.label}
            </Text>
            <Text style={{ color: "#fff" }}>▼</Text>
          </TouchableOpacity>

          {/* PRÉNOM */}
          <LabelWithStar>Prénom</LabelWithStar>
          <TextInput
            style={styles.input}
            value={form.prenom}
            placeholder="Ex: Ahmed"
            placeholderTextColor="#666"
            onChangeText={(text) => setForm({ ...form, prenom: text })}
          />

          {/* NOM */}
          <LabelWithStar>Nom</LabelWithStar>
          <TextInput
            style={styles.input}
            value={form.nom}
            placeholder="Ex: Mansouri"
            placeholderTextColor="#666"
            onChangeText={(text) => setForm({ ...form, nom: text })}
          />

          {/* PHONE */}
          <LabelWithStar>Téléphone</LabelWithStar>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={form.phone}
            placeholder="06XXXXXXXX"
            placeholderTextColor="#666"
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          {/* EMAIL */}
          <LabelWithStar>Email</LabelWithStar>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          {/* PASSWORD */}
          <LabelWithStar>Mot de passe</LabelWithStar>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />

          {/* WILAYA */}
          <LabelWithStar>Wilaya</LabelWithStar>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowWilaya(true)}
          >
            <Text
              style={[styles.selectText, !form.wilaya && { color: "#8E949A" }]}
            >
              {wilayas.find((w) => w.value === form.wilaya)?.label ||
                "Sélectionnez une wilaya"}
            </Text>
            <Text style={{ color: "#fff" }}>▼</Text>
          </TouchableOpacity>

          {/* COMMUNE */}
          <LabelWithStar>Commune</LabelWithStar>
          <TextInput
            style={styles.input}
            value={form.commune}
            onChangeText={(text) => setForm({ ...form, commune: text })}
          />

          {/* ADRESSE */}
          <LabelWithStar>Adresse</LabelWithStar>
          <TextInput
            style={styles.input}
            value={form.adresse}
            onChangeText={(text) => setForm({ ...form, adresse: text })}
          />

          {/* POLICY & BUTTON (كما هي في كودك) */}
          {/* ... باقي الكود من سويتش الحماية والأزرار والمودالز ... */}
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
