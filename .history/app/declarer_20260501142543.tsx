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
import { auth, db } from "../constants/firebaseConfig";

export default function Declarer() {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [qrData, setQrData] = useState<string | null>(null);
  // 📅 IMPORTANT: string format
  const [date, setDate] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);

  const [form, setForm] = useState({
    quantite: "",
    contenance: "",
    etat: "Bon",
    point_collecte: "",
  });

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

      await addDoc(collection(db, "declarations"), {
        userId: user.uid,
        quantite: Number(form.quantite),
        contenance: form.contenance,
        etat: form.etat,
        point_collecte: form.point_collecte,

        date_collecte: date, // 📅 string YYYY-MM-DD

        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          : null,

        status: "en attente",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Succès", "Déclaration enregistrée ✔");
      const sacId = "SAC-" + Date.now();

      setQrData(
        JSON.stringify({
          sacId,
          userId: user.uid,
          date_collecte: date,
          point_collecte: form.point_collecte,
        }),
      );
      // Reset
      setForm({
        quantite: "",
        contenance: "",
        etat: "Bon",
        point_collecte: "",
      });

      setLocation(null);
      setDate("");
      setShowCalendar(false);

      router.back();
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
          placeholder="Lieu de collecte"
          placeholderTextColor="#555"
        />

        {/* 📅 Date */}
        <Text style={styles.label}>Date de collecte</Text>

        <TouchableOpacity
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={{ color: "#fff" }}>
            {date ? date : "Choisir une date"}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <View style={styles.calendarBox}>
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
          </View>
        )}

        {/* GPS */}
        <TouchableOpacity style={styles.gpsButton} onPress={getLocation}>
          <Text style={styles.gpsText}>📍 Utiliser ma position</Text>
        </TouchableOpacity>

        {location && (
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(4)} , {location.longitude.toFixed(4)}
          </Text>
        )}

        {/* Buttons */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmer</Text>
        </TouchableOpacity>
        {qrData && (
          <View style={styles.qrBox}>
            <Text style={{ color: "#fff", marginBottom: 10 }}>
              QR Code du sac
            </Text>

            <QRCode value={qrData} size={200} />

            <Text style={{ color: "#9ca3af", marginTop: 10 }}>
              Montrez ce QR au collecteur
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#8E949A" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <Ionicons name="paper-plane-outline" size={22} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#8E949A" />
        </TouchableOpacity>
      </View>
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
