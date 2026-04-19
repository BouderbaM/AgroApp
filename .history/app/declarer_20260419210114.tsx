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

  const wilayas = [
    "Mascara",
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
  ];

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
        userId: user.uid, // ⚠️ بدون ?
        quantite: Number(form.quantite), // نحولها لرقم
        type: form.type,
        etat: form.etat,
        wilaya: form.wilaya,
        status: "en attente", // مهم للإحصائيات
        createdAt: serverTimestamp(),
      });

      Alert.alert("Succès", "Déclaration enregistrée ✔");
      router.back();
    } catch (error: any) {
      console.log(error); // مهم
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.title}>Emballages vides à collecter</Text>
        <Text style={styles.subtitle}>
          Déclarez vos bidons phytosanitaires vides
        </Text>

        {/* Quantité */}
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          placeholder="Nombre de bidons"
          placeholderTextColor="#5A5E62"
          keyboardType="numeric"
          value={form.quantite}
          onChangeText={(t) => setForm({ ...form, quantite: t })}
          style={styles.input}
        />

        {/* Type Selection */}
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

        {/* État Selection */}
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

        {/* Wilaya Selection */}
        <Text style={styles.label}>Wilaya</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.wilayaScroll}
        >
          {wilayas.map((w) => (
            <TouchableOpacity
              key={w}
              style={[
                styles.wilayaChip,
                form.wilaya === w && styles.activeChip,
              ]}
              onPress={() => setForm({ ...form, wilaya: w })}
            >
              <Text style={styles.chipText}>{w}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Action Buttons */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E949A",
    marginBottom: 25,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1A1C1E",
    borderWidth: 1,
    borderColor: "#2D3135",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#1A1C1E",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#2D3135",
  },
  stateButton: {
    backgroundColor: "#1A1C1E",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2D3135",
  },
  activeGreenButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  wilayaScroll: {
    flexDirection: "row",
    marginBottom: 30,
  },
  wilayaChip: {
    backgroundColor: "#1A1C1E",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#2D3135",
  },
  activeChip: {
    borderColor: "#4CAF50",
    backgroundColor: "#1A1C1E",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#111315",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D3135",
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 16,
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
});
