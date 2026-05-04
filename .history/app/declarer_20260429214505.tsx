import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

import {
  Alert,
  Modal,
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

  const [showWilaya, setShowWilaya] = useState(false);


  const [form, setForm] = useState({
    quantite: "",
    type: "HDPE",
    etat: "Bon",
    wilaya: "",
  });

  const handleConfirm = async () => {
    try {
      if (!form.quantite || !form.wilaya) {
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
        type: form.type,
        etat: form.etat,
        wilaya: form.wilaya,
        status: "en attente",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Succès", "Déclaration enregistrée ✔");
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const SelectBox = ({ label, value, placeholder, onPress }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBox} onPress={onPress}>
        <Text style={[styles.selectText, !value && { color: "#8E949A" }]}>
          {value || placeholder}
        </Text>
        <Text style={{ color: "#fff" }}>▼</Text>
      </TouchableOpacity>
    </View>
  );

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

        {/* Type */}
        <Text style={styles.label}>Type</Text>
        <View style={styles.row}>
          {["HDPE", "PTE"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.typeButton,
                form.type === item && styles.activeGreenButton,
              ]}
              onPress={() => setForm({ ...form, type: item })}
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

     

        {/* Modal Wilaya */}
        <Modal visible={showWilaya} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
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
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="paper-plane-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agriculteur")}
        >
          <Ionicons name="leaf" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>
            Agriculteur
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profil")}
        >
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { padding: 20 },

  title: { fontSize: 24, color: "#4CAF50", fontWeight: "bold" },
  subtitle: { color: "#8E949A", marginBottom: 20 },

  label: { color: "#fff", marginTop: 15 },

  input: {
    backgroundColor: "#1A1C1E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
  },

  row: { flexDirection: "row" },

  typeButton: {
    flex: 1,
    backgroundColor: "#1A1C1E",
    padding: 12,
    margin: 2,
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

  selectBox: {
    backgroundColor: "#1A1C1E",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  selectText: { color: "#fff" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    maxHeight: "70%",
  },

  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  optionText: { color: "#fff" },

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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "#1A1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26292B",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    color: "#8E949A",
    fontSize: 11,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // 👈 مهم
  },

  cancelText: { color: "#fff", textAlign: "center" },
});
