import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import { auth, db } from "../constants/firebaseConfig";

export default function Declarer() {
  const router = useRouter();

  const [location, setLocation] = useState<any>(null);
  const [date, setDate] = useState("");
  const [form, setForm] = useState({
    quantite: "",
    contenance: "",
    etat: "Bon",
    point_collecte: "",
  });

  // 📍 GPS
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Erreur", "GPS refusé");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocation(loc.coords);
  };

  // 📦 CONFIRM + CREATE QR
  const handleConfirm = async () => {
    try {
      if (!form.quantite || !form.point_collecte || !date) {
        Alert.alert("Erreur", "Remplir tous les champs");
        return;
      }

      const user = auth.currentUser;
      if (!user) return;

      // 🧠 ID unique du sac
      const sacId = "SAC-" + Date.now();

      // 💾 Save Firebase
      await addDoc(collection(db, "declarations"), {
        userId: user.uid,
        sacId: sacId,
        quantite: Number(form.quantite),
        contenance: form.contenance,
        etat: form.etat,
        point_collecte: form.point_collecte,
        date_collecte: date,

        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          : null,

        status: "en attente",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Succès", "Déclaration créée ✔");

      // 📲 الانتقال إلى QR SCREEN
      router.push({
        pathname: "/qr",
        params: {
          sacId: sacId,
          quantite: form.quantite,
          date: date,
        },
      });
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>♻️ Déclaration</Text>

        {/* Quantité */}
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.quantite}
          onChangeText={(t) => setForm({ ...form, quantite: t })}
        />

        {/* Point collecte */}
        <Text style={styles.label}>Point collecte</Text>
        <TextInput
          style={styles.input}
          value={form.point_collecte}
          onChangeText={(t) => setForm({ ...form, point_collecte: t })}
        />

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />

        {/* GPS */}
        <TouchableOpacity style={styles.gps} onPress={getLocation}>
          <Text style={{ color: "#fff" }}>📍 GPS</Text>
        </TouchableOpacity>

        {/* CONFIRM */}
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={{ color: "#fff" }}>Créer QR</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== STYLE ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { padding: 20 },

  title: {
    color: "#4CAF50",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: { color: "#fff", marginTop: 10 },

  input: {
    backgroundColor: "#1A1C1E",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
  },

  gps: {
    backgroundColor: "#1565C0",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },

  btn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
});
