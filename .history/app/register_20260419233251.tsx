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
                  Consignes de Sécurité et de Gestion des Flacons de Pesticides
                  Vides🌿
                </Text>

                <ScrollView style={{ maxHeight: 300 }}>
                  <Text style={styles.popupText}>
                    👨‍🌾 Pour les Agriculteurs (Utilisateurs){"\n"}
                    🔒 1. Fermeture et stockage{"\n"}
                    Bien fermer hermétiquement les flacons après utilisation.
                    {"\n"}
                    Ne jamais laisser les flacons ouverts ou mal fermés.{"\n"}
                    Stocker les flacons dans un endroit sec, ventilé et
                    sécurisé.{"\n"}
                    🔥 2. Sécurité incendie{"\n"}
                    Éloigner les flacons de toute source de chaleur ou
                    d’inflammation (feu, soleil direct, carburant). Ne jamais
                    {"\n"}
                    brûler les flacons vides.{"\n"}
                    🚫 3. Protection sanitaire{"\n"}
                    Ne jamais réutiliser les flacons pour eau, nourriture ou
                    autres usages domestiques.{"\n"}
                    Garder hors de portée des enfants et des animaux.{"\n"}
                    ♻️ 4. Gestion des déchets{"\n"}
                    Ne pas jeter les flacons dans la nature ou dans les oueds.
                    {"\n"}
                    Déposer les flacons dans les points de collecte agréés.
                    {"\n"}
                    🧤 5. Protection individuelle{"\n"}
                    Porter des gants et équipements de protection lors de la
                    {"\n"}
                    manipulation. Se laver les mains après manipulation. {"\n"}
                    🏪Pour les Vendeurs de Produits Phytosanitaires{"\n"}
                    📢 1. Sensibilisation des clients{"\n"}
                    Informer les agriculteurs sur les bonnes pratiques
                    d’utilisation et d’élimination.{"\n"}
                    Afficher des consignes de sécurité visibles dans le magasin.
                    {"\n"}
                    📦 2. Gestion des emballages{"\n"}
                    Encourager le retour des flacons vides.{"\n"}
                    Mettre en place un système de collecte ou de dépôt.{"\n"}
                    ⚠️ 3. Stockage sécurisé{"\n"}
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
