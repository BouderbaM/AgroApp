import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { auth, db } from "../constants/firebaseConfig";

export default function Declarer() {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

        date_collecte: date, // 📅

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

      // Reset
      setForm({
        quantite: "",
        contenance: "",
        etat: "Bon",
        point_collecte: "",
      });
      setLocation(null);
      setDate(new Date());

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

        {/* Etat */}
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

        {/* Date */}
        <Text style={styles.label}>Date de collecte</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: "#fff" }}>
            {date.toLocaleDateString("fr-FR")}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
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

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
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
