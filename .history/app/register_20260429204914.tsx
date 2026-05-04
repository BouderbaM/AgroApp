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

  // ✅ ERREURS STATE
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    wilaya: "",
    commune: "",
    adresse: "",
  });

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    wilaya: "",
    role: "agriculteur",
    commune: "",
    adresse: "",
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

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    const newErrors = {
      nom: "",
      prenom: "",
      email: "",
      phone: "",
      password: "",
      wilaya: "",
      commune: "",
      adresse: "",
    };

    let isValid = true;

    // Regex patterns
    const stringOnlyRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/; // Lettres avec accents, espaces, apostrophes, tirets
    const addressRegex = /^[a-zA-ZÀ-ÿ0-9\s'-]+$/; // Lettres, chiffres, espaces, apostrophes, tirets
    const phoneRegex = /^(05|06|07)\d{8}$/; // 10 chiffres commençant par 05, 06 ou 07
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email avec @ et domaine

    // ✅ Validation Nom
    if (!form.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
      isValid = false;
    } else if (!stringOnlyRegex.test(form.nom.trim())) {
      newErrors.nom = "Le nom ne doit contenir que des lettres";
      isValid = false;
    }

    // ✅ Validation Prénom
    if (!form.prenom.trim()) {
      newErrors.prenom = "Le prénom est obligatoire";
      isValid = false;
    } else if (!stringOnlyRegex.test(form.prenom.trim())) {
      newErrors.prenom = "Le prénom ne doit contenir que des lettres";
      isValid = false;
    }

    // ✅ Validation Email
    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire";
      isValid = false;
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "L'email doit contenir @ et être valide";
      isValid = false;
    }

    // ✅ Validation Téléphone
    if (!form.phone.trim()) {
      newErrors.phone = "Le téléphone est obligatoire";
      isValid = false;
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone =
        "Doit commencer par 05, 06 ou 07 et contenir 10 chiffres";
      isValid = false;
    }

    // ✅ Validation Mot de passe
    if (!form.password) {
      newErrors.password = "Le mot de passe est obligatoire";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
      isValid = false;
    }

    // ✅ Validation Wilaya
    if (!form.wilaya) {
      newErrors.wilaya = "La wilaya est obligatoire";
      isValid = false;
    }

    // ✅ Validation Commune
    if (!form.commune.trim()) {
      newErrors.commune = "La commune est obligatoire";
      isValid = false;
    } else if (!stringOnlyRegex.test(form.commune.trim())) {
      newErrors.commune = "La commune ne doit contenir que des lettres";
      isValid = false;
    }

    // ✅ Validation Adresse
    if (!form.adresse.trim()) {
      newErrors.adresse = "L'adresse est obligatoire";
      isValid = false;
    } else if (!addressRegex.test(form.adresse.trim())) {
      newErrors.adresse =
        "L'adresse ne doit contenir que des lettres et des chiffres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ✅ CLEAR ERROR ON INPUT CHANGE
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // ✅ REGISTER
  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    if (!acceptPolicy) {
      Alert.alert(
        "Attention",
        "Veuillez accepter la politique de confidentialité",
      );
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
        commune: form.commune,
        adresse: form.adresse,
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
  const SelectBox = ({ label, value, placeholder, onPress, error }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selectBox, error && styles.inputError]}
        onPress={onPress}
      >
        <Text style={[styles.selectText, !value && { color: "#8E949A" }]}>
          {value || placeholder}
        </Text>
        <Text style={{ color: "#fff" }}>▼</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  // ✅ INPUT WITH ERROR
  const InputWithError = ({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry,
    keyboardType,
  }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry || false}
        keyboardType={keyboardType || "default"}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
            error={errors.wilaya}
          />

          {/* PRENOM */}
          <InputWithError
            label="Prénom"
            value={form.prenom}
            onChangeText={(text) => handleInputChange("prenom", text)}
            error={errors.prenom}
          />

          {/* NOM */}
          <InputWithError
            label="Nom"
            value={form.nom}
            onChangeText={(text) => handleInputChange("nom", text)}
            error={errors.nom}
          />

          {/* PHONE */}
          <InputWithError
            label="Téléphone"
            value={form.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            error={errors.phone}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* EMAIL */}
          <InputWithError
            label="Email"
            value={form.email}
            onChangeText={(text) => handleInputChange("email", text)}
            error={errors.email}
            keyboardType="email-address"
          />

          {/* PASSWORD */}
          <InputWithError
            label="Mot de passe"
            value={form.password}
            onChangeText={(text) => handleInputChange("password", text)}
            error={errors.password}
            secureTextEntry
          />

          {/* WILAYA */}
          <SelectBox
            label="Wilaya"
            value={wilayas.find((w) => w.value === form.wilaya)?.label}
            placeholder="Sélectionnez une wilaya"
            onPress={() => setShowWilaya(true)}
            error={errors.wilaya}
          />

          {/* COMMUNE */}
          <InputWithError
            label="Commune"
            value={form.commune}
            onChangeText={(text) => handleInputChange("commune", text)}
            error={errors.commune}
          />

          {/* ADRESSE */}
          <InputWithError
            label="Adresse"
            value={form.adresse}
            onChangeText={(text) => handleInputChange("adresse", text)}
            error={errors.adresse}
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
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
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
                        setErrors({ ...errors, wilaya: "" });
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
                    d'inflammation (feu, soleil direct, carburant). Ne jamais
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
                    d'utilisation et d'élimination.{"\n"}
                    Afficher des consignes de sécurité visibles dans le magasin.
                    {"\n"}
                    📦 2. Gestion des emballages{"\n"}
                    Encourager le retour des flacons vides.{"\n"}
                    Mettre en place un système de collecte ou de dépôt.{"\n"}
                    ⚠️ 3. Stockage sécurisé{"\n"}
                    Stocker les produits dans un endroit conforme aux normes de
                    sécurité. {"\n"}Éviter l'exposition à la chaleur et à
                    l'humidité.{"\n"}
                    📋 4. Traçabilité{"\n"}
                    Assurer un suivi des produits vendus.{"\n"}
                    Collaborer avec les organismes de recyclage.{"\n"}
                    🤝 5. Partenariat environnemental Travailler avec les
                    programmes de recyclage et de collecte. {"\n"}Participer aux
                    campagnes de protection de l'environnement.{"\n"}
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
    borderWidth: 1,
    borderColor: "transparent",
  },

  inputError: {
    borderColor: "#FF4444",
    borderWidth: 1,
  },

  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
  },

  selectBox: {
    backgroundColor: "#1A1C1E",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "transparent",
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

  buttonDisabled: {
    opacity: 0.6,
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
