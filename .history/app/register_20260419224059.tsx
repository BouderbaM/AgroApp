import { Picker } from "@react-native-picker/picker";
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

  // --- Backend States ---
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

  // --- Backend Logic ---
  const handleRegister = async () => {
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
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Succès", "Compte créé avec succès !");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
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
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>PhytoCycle</Text>
            <Text style={styles.brandSubTitle}>S'inscrire</Text>
          </View>

          {/* Role Selection */}
          <Text style={styles.label}>Rôle</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.role}
              onValueChange={(itemValue) =>
                setForm({ ...form, role: itemValue })
              }
              style={{ color: "#FFFFFF" }}
              dropdownIconColor="#FFFFFF"
              itemStyle={{ color: "#FFFFFF", backgroundColor: "#1A1C1E" }}
            >
              <Picker.Item label="Agriculteur" value="agriculteur" />
              <Picker.Item label="Vendeur" value="vendeur" />
              <Picker.Item label="Collecteur" value="collecteur" />
            </Picker>
          </View>

          {/* Form Inputs */}
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre prénom"
            placeholderTextColor="#5A5E62"
            value={form.prenom}
            onChangeText={(text) => setForm({ ...form, prenom: text })}
          />

          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#5A5E62"
            value={form.nom}
            onChangeText={(text) => setForm({ ...form, nom: text })}
          />

          <Text style={styles.label}>Numéro de téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+213 6XX XXX XXX"
            placeholderTextColor="#5A5E62"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre.email@example.com"
            placeholderTextColor="#5A5E62"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#5A5E62"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />

          <Text style={styles.label}>Wilaya</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.wilaya}
              onValueChange={(itemValue) =>
                setForm({ ...form, wilaya: itemValue })
              }
              dropdownIconColor="#FFFFFF"
              style={styles.picker}
            >
              <Picker.Item label="Sélectionnez une wilaya" value="" />
              <Picker.Item label="01 - Adrar" value="01" />
              <Picker.Item label="31 - Oran" value="31" />
              <Picker.Item label="29 - Mascara" value="29" />
              {/* أضف باقي الولايات هنا */}
            </Picker>
          </View>

          {/* Policy Section */}
          <View style={styles.policyCard}>
            <Switch
              value={acceptPolicy}
              onValueChange={setAcceptPolicy}
              trackColor={{ false: "#2D3135", true: "#4CAF50" }}
              thumbColor={acceptPolicy ? "#FFFFFF" : "#8E949A"}
            />
            <View style={styles.policyTextContainer}>
              <Text style={styles.policyText}>
                J'accepte la politique de confidentialité et le traitement de
                mes données pour organiser la collecte
              </Text>
              <TouchableOpacity>
                <Text style={styles.policyLink}>
                  Lire la politique complète
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Chargement..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez un compte? </Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.loginLink}>Connexion</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  brandSubTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1A1C1E",
    borderWidth: 1,
    borderColor: "#2D3135",
    borderRadius: 8,
    height: 52,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: "#2D3135",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    color: "#FFFFFF",
    height: 52,
  },
  policyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#1A1C1E",
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#2D3135",
  },
  policyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  policyText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 18,
  },
  policyLink: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 6,
    textDecorationLine: "underline",
  },
  registerButton: {
    backgroundColor: "#3E7B41",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#8E949A",
    fontSize: 14,
  },
  loginLink: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
});
