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
            style={[
              styles.stateBtn,
              form.etat === item && styles.activeChip,
            ]}
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
          <Text style={{ color: "#fff" }}>
            {date || "Choisir une date"}
          </Text>
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
          <Text style={styles.confirmText}>
            Confirmer la déclaration
          </Text>
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