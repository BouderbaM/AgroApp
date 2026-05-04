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

  const basePrice = priceByContenance[form.contenance] || 0;
  const multiplier = etatMultiplier[form.etat] || 1;
  const prixTotal = (Number(form.quantite) || 0) * basePrice * multiplier;

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erreur", "Permission GPS refusée");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const handleConfirm = async () => {
    try {
      if (!form.quantite || !form.point_collecte || !date) {
        Alert.alert("Erreur", "Remplir tous les champs");
        return;
      }

      const user = auth.currentUser;
      if (!user) return;

      const qrPayload = JSON.stringify({
        userId: user.uid,
        quantite: form.quantite,
        contenance: form.contenance,
        etat: form.etat,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER PRO */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>♻️ Déclaration des bidons</Text>
          <Text style={styles.subtitle}>
            Système intelligent de recyclage agricole
          </Text>
        </View>

        {/* INPUTS */}
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.quantite}
          onChangeText={(t) => setForm({ ...form, quantite: t })}
        />

        <Text style={styles.label}>Contenance</Text>
        <View style={styles.row}>
          {Object.keys(priceByContenance).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                form.contenance === item && styles.activeChip,
              ]}
              onPress={() => setForm({ ...form, contenance: item })}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>État</Text>
        {["Bon", "Écrasé", "Endommagé"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.stateBtn, form.etat === item && styles.activeChip]}
            onPress={() => setForm({ ...form, etat: item })}
          >
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}

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
            onDayPress={(day) => {
              setDate(day.dateString);
              setShowCalendar(false);
            }}
          />
        )}

        {/* PRICE CARD */}
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>
            💰 Total estimé : {prixTotal.toFixed(2)} DA
          </Text>
        </View>

        {/* GPS */}
        <TouchableOpacity style={styles.gpsBtn} onPress={getLocation}>
          <Ionicons name="location-outline" size={18} color="#fff" />
          <Text style={styles.btnText}>Position GPS</Text>
        </TouchableOpacity>

        {/* CONFIRM */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmer la déclaration</Text>
        </TouchableOpacity>

        {/* QR */}
        {qrData && (
          <View style={styles.qrBox}>
            <QRCode value={qrData} size={180} />
          </View>
        )}
      </ScrollView>

      {/* 🔥 BOTTOM NAV (UNCHANGED) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <Ionicons name="paper-plane-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Liste</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  headerBox: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#0f2a1e",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  title: {
    color: "#2ecc71",
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },

  label: {
    color: "#cbd5f5",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 20,
    margin: 4,
  },

  stateBtn: {
    backgroundColor: "#111827",
    padding: 12,
    marginTop: 6,
    borderRadius: 10,
  },

  activeChip: {
    backgroundColor: "#2ecc71",
  },

  chipText: {
    color: "#fff",
    fontSize: 12,
  },

  priceBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#0f2a1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2ecc71",
  },

  priceText: {
    color: "#2ecc71",
    fontWeight: "bold",
  },

  gpsBtn: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    backgroundColor: "#1565C0",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
  },

  confirmBtn: {
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },

  confirmText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
  },

  qrBox: {
    marginTop: 20,
    alignItems: "center",
  },

  /* NAV */
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: "#081812",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#1e3a2f",
    borderTopWidth: 1,
  },

  navText: {
    color: "#94a3b8",
    fontSize: 11,
  },
});
