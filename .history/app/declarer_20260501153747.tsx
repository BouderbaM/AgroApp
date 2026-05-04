import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
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
import QRCode from "react-native-qrcode-svg";

import { Calendar } from "react-native-calendars";
import { auth, db } from "../constants/firebaseConfig";

export default function Declarer() {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const [form, setForm] = useState({
    quantite: "",
    contenance: "",
    etat: "Bon",
    point_collecte: "",
  });

  // ⭐ الأسعار
  const priceByContenance = {
    "100 mL": 2,
    "200 mL": 3,
    "500 mL": 5,
    "1 L": 8,
    "2 L": 12,
    "5 L": 20,
  };

  const etatMultiplier = {
    Bon: 1,
    Écrasé: 0.7,
    Endommagé: 0.4,
  };

  // ⭐ حساب السعر
  const basePrice = priceByContenance[form.contenance] || 0;
  const multiplier = etatMultiplier[form.etat] || 1;

  const prixTotal = Number(form.quantite || 0) * basePrice * multiplier;

  // 📍 GPS
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Erreur", "Permission GPS refusée");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(loc.coords);
      Alert.alert("Succès", "Localisation récupérée ✔");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de récupérer la position");
    }
  };

  // 📦 Submit
  const handleConfirm = async () => {
    try {
      if (!form.quantite || !form.point_collecte || !date) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erreur", "Utilisateur non connecté");
        return;
      }

      const sacId = "SAC-" + Date.now();

      const qrPayload = JSON.stringify({
        sacId,
        userId: user.uid,
        date_collecte: date,
        point_collecte: form.point_collecte,
        prixTotal, // ⭐ داخل QR
      });

      await addDoc(collection(db, "declarations"), {
        userId: user.uid,
        quantite: Number(form.quantite),
        contenance: form.contenance,
        etat: form.etat,
        point_collecte: form.point_collecte,
        date_collecte: date,

        prixTotal, // ⭐ حفظ السعر

        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          : null,

        status: "en attente",
        createdAt: serverTimestamp(),
      });

      setQrData(qrPayload);

      router.push({
        pathname: "/qr",
        params: { data: qrPayload },
      });
    } catch (error) {
      Alert.alert("Erreur", error?.message || "Une erreur est survenue");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>♻️ Déclaration des bidons</Text>

        {/* Quantité */}
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.quantite}
          onChangeText={(t) => setForm({ ...form, quantite: t })}
          placeholderTextColor="#5A5E62"
        />

        {/* Contenance */}
        <Text style={styles.label}>Contenance</Text>
        <View style={styles.row}>
          {["100 mL", "200 mL", "500 mL", "1 L", "2 L", "5 L"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.typeButton,
                form.contenance === item && styles.activeButton,
              ]}
              onPress={() => setForm({ ...form, contenance: item })}
            >
              <Text style={styles.buttonText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* État */}
        <Text style={styles.label}>État</Text>
        {["Bon", "Écrasé", "Endommagé"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.stateButton,
              form.etat === item && styles.activeButton,
            ]}
            onPress={() => setForm({ ...form, etat: item })}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {/* Point collecte */}
        <Text style={styles.label}>Point de collecte</Text>
        <TextInput
          style={styles.input}
          value={form.point_collecte}
          onChangeText={(text) => setForm({ ...form, point_collecte: text })}
        />

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={{ color: "#fff" }}>{date || "Choisir une date"}</Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            onDayPress={(day) => {
              setDate(day.dateString);
              setShowCalendar(false);
            }}
            theme={{
              backgroundColor: "#1A1C1E",
              calendarBackground: "#1A1C1E",
              dayTextColor: "#fff",
              monthTextColor: "#4CAF50",
              arrowColor: "#4CAF50",
            }}
          />
        )}

        {/* ⭐ DISPLAY PRICE */}
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>
            💰 Prix estimé: {prixTotal.toFixed(2)} DA
          </Text>
        </View>

        {/* GPS */}
        <TouchableOpacity style={styles.gpsButton} onPress={getLocation}>
          <Text style={styles.gpsText}>📍 Position</Text>
        </TouchableOpacity>

        {/* CONFIRM */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>
            Confirmer ({prixTotal.toFixed(2)} DA)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { padding: 20, paddingBottom: 100 },

  title: { fontSize: 22, color: "#4CAF50", fontWeight: "bold" },

  label: { color: "#fff", marginTop: 15 },

  input: {
    backgroundColor: "#1A1C1E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
  },

  row: { flexDirection: "row", flexWrap: "wrap" },

  typeButton: {
    backgroundColor: "#1A1C1E",
    padding: 10,
    margin: 4,
    borderRadius: 8,
  },
  qrBox: {
    marginTop: 20,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1A1C1E",
    borderRadius: 10,
  },
  stateButton: {
    backgroundColor: "#1A1C1E",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },

  activeButton: { backgroundColor: "#4CAF50" },

  buttonText: { color: "#fff" },

  gpsButton: {
    backgroundColor: "#1565C0",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  gpsText: { color: "#fff", textAlign: "center" },

  locationText: { color: "#4CAF50", marginTop: 5 },

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
  },
});
