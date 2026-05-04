import { Ionicons } from "@expo/vector-icons";
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
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import QRCode from "react-native-qrcode-svg";
import { auth, db } from "../constants/firebaseConfig";

export default function Declarer() {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [date, setDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const [form, setForm] = useState({
    quantite: "",
    contenance: "",
    etat: "Bon",
    point_collecte: "",
  });

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

  const prixTotal =
    (Number(form.quantite) || 0) *
    (priceByContenance[form.contenance] || 0) *
    (etatMultiplier[form.etat] || 1);

  /* ================= GPS ================= */
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erreur", "Permission refusée");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  /* ================= SUBMIT ================= */
  const handleConfirm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (!form.quantite || !form.point_collecte || !date) {
        Alert.alert("Erreur", "Remplir tous les champs");
        return;
      }

      const qrPayload = JSON.stringify({
        userId: user.uid,
        date_collecte: date,
        point_collecte: form.point_collecte,
        prixTotal,
      });

      await addDoc(collection(db, "declarations"), {
        ...form,
        userId: user.uid,
        date_collecte: date,
        prixTotal,
        location: location || null,
        status: "en attente",
        createdAt: serverTimestamp(),
      });

      setQrData(qrPayload);

      router.push({
        pathname: "/qr",
        params: { data: qrPayload },
      });
    } catch (e) {
      Alert.alert("Erreur", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>♻️ Déclaration</Text>
          <Text style={styles.subtitle}>
            Recyclage intelligent des bidons agricoles
          </Text>
        </View>

        {/* QUANTITY */}
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.quantite}
          onChangeText={(t) => setForm({ ...form, quantite: t })}
        />

        {/* CONTENANCE */}
        <Text style={styles.label}>Contenance</Text>
        <View style={styles.row}>
          {Object.keys(priceByContenance).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                form.contenance === item && styles.chipActive,
              ]}
              onPress={() => setForm({ ...form, contenance: item })}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ETAT */}
        <Text style={styles.label}>État</Text>
        {["Bon", "Écrasé", "Endommagé"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.state, form.etat === item && styles.stateActive]}
            onPress={() => setForm({ ...form, etat: item })}
          >
            <Text style={styles.stateText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {/* POINT */}
        <Text style={styles.label}>Point de collecte</Text>
        <TextInput
          style={styles.input}
          value={form.point_collecte}
          onChangeText={(t) => setForm({ ...form, point_collecte: t })}
        />

        {/* DATE */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={{ color: "#fff" }}>{date || "Choisir une date"}</Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            onDayPress={(d) => {
              setDate(d.dateString);
              setShowCalendar(false);
            }}
          />
        )}

        {/* PRICE */}
        <View style={styles.priceBox}>
          <Text style={styles.price}>💰 {prixTotal.toFixed(2)} DA</Text>
        </View>

        {/* GPS */}
        <TouchableOpacity style={styles.gps} onPress={getLocation}>
          <Ionicons name="location" size={18} color="#2ecc71" />
          <Text style={styles.gpsText}>Position GPS</Text>
        </TouchableOpacity>

        {/* CONFIRM */}
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={styles.btnText}>
            Confirmer ({prixTotal.toFixed(2)} DA)
          </Text>
        </TouchableOpacity>

        {/* QR */}
        {qrData && (
          <View style={styles.qr}>
            <QRCode value={qrData} size={180} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
  },

  content: {
    padding: 18,
    paddingBottom: 120,
  },

  headerBox: {
    backgroundColor: "#0f2a1e",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1e3a2f",
    marginBottom: 15,
  },

  title: {
    color: "#2ecc71",
    fontSize: 24,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 12,
  },

  label: {
    color: "#cbd5f5",
    marginTop: 12,
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#0f2a1e",
    padding: 12,
    borderRadius: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#0f2a1e",
    padding: 8,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  chipActive: {
    backgroundColor: "#2ecc71",
  },

  chipText: {
    color: "#fff",
    fontSize: 12,
  },

  state: {
    backgroundColor: "#0f2a1e",
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
  },

  stateActive: {
    backgroundColor: "#2ecc71",
  },

  stateText: {
    color: "#fff",
  },

  priceBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#0f2a1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  price: {
    color: "#2ecc71",
    fontWeight: "bold",
  },

  gps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#0f2a1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  gpsText: {
    color: "#2ecc71",
  },

  btn: {
    marginTop: 18,
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 14,
  },

  btnText: {
    color: "#0b1f16",
    textAlign: "center",
    fontWeight: "bold",
  },

  qr: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#0f2a1e",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },
});
