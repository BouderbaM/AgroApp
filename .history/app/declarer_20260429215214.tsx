import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../constants/firebaseConfig";

export default function Declarer() {
  const router = useRouter();

  const [form, setForm] = useState({
    quantite: "",
    contenance: "",
    etat: "Bon",
    point_collecte: "",
  });

  const handleConfirm = async () => {
    try {
      if (!form.quantite || !form.point_collecte) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erreur", "Utilisateur non connecté");
        return;
      }

      await addDoc(collection(db, "declarations"), {
        userId: user.uid,
        quantite: Number(form.quantite),
        contenance: form.contenance,
        etat: form.etat,
        point_collecte: form.point_collecte,
        status: "en attente",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Succès", "Déclaration enregistrée ✔");

      setForm({
        quantite: "",
        contenance: "",
        etat: "Bon",
        point_collecte: "",
      });

      router.back();
    } catch (error) {
      Alert.alert("Erreur", error?.message || "Une erreur est survenue");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Emballages vides à collecter</Text>
        <Text style={styles.subtitle}>
          Déclarez vos bidons phytosanitaires vides
        </Text>

        {/* Quantité */}
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nombre de bidons"
          placeholderTextColor="#5A5E62"
          value={form.quantite}
          onChangeText={(t) => setForm({ ...form, quantite: t })}
        />

        {/* Contenance */}
        <Text style={styles.label}>Contenance</Text>
        <View style={styles.row}>
          {["100 mL", "200 mL", "500 mL", "1 L", "2 L", "5 L"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.typeButton,
                form.contenance === item && styles.activeGreenButton,
              ]}
              onPress={() => setForm({ ...form, contenance: item })}
            >
              <Text style={styles.buttonText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Etat */}
        <Text style={styles.label}>État</Text>
        {["Bon", "Écrasé", "Endommagé"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.stateButton,
              form.etat === item && styles.activeGreenButton,
            ]}
            onPress={() => setForm({ ...form, etat: item })}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {/* Point de collecte */}
        <Text style={styles.label}>Point de collecte</Text>
        <TextInput
          style={styles.input}
          value={form.point_collecte}
          onChangeText={(text) => setForm({ ...form, point_collecte: text })}
          placeholder="Lieu de collecte"
          placeholderTextColor="#555"
        />

        {/* Buttons */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/")}>
          <Ionicons name="home-outline" size={22} color="#8E949A" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/declaration")}>
          <Ionicons name="paper-plane-outline" size={22} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Ionicons name="person-outline" size={22} color="#8E949A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },

  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  title: { fontSize: 24, color: "#4CAF50", fontWeight: "bold" },
  subtitle: { color: "#8E949A", marginBottom: 20 },

  label: { color: "#fff", marginTop: 15 },

  input: {
    backgroundColor: "#1A1C1E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap", // 🔥 fix مهم
  },

  typeButton: {
    backgroundColor: "#1A1C1E",
    padding: 10,
    margin: 4,
    borderRadius: 8,
  },

  stateButton: {
    backgroundColor: "#1A1C1E",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },

  activeGreenButton: { backgroundColor: "#4CAF50" },

  buttonText: { color: "#fff", textAlign: "center" },

  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },

  confirmText: { color: "#fff", textAlign: "center" },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#333",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  cancelText: { color: "#fff", textAlign: "center" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#1A1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26292B",
  },
});
