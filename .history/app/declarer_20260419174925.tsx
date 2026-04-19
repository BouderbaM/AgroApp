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

  // القائمة الكاملة لولايات الجزائر (58 ولاية)
  const wilayas = [
    "01-Adrar", "02-Chlef", "03-Laghouat", "04-Oum El Bouaghi", "05-Batna", 
    "06-Béjaïa", "07-Biskra", "08-Béchar", "09-Blida", "10-Bouira", 
    "11-Tamanrasset", "12-Tébessa", "13-Tlemcen", "14-Tiaret", "15-Tizi Ouzou", 
    "16-Alger", "17-Djelfa", "18-Jijel", "19-Sétif", "20-Saïda", 
    "21-Skikda", "22-Sidi Bel Abbès", "23-Annaba", "24-Guelma", "25-Constantine", 
    "26-Médéa", "27-Mostaganem", "28-M'Sila", "29-Mascara", "30-Ouargla", 
    "31-Oran", "32-El Bayadh", "33-Illizi", "34-Bordj Bou Arreridj", "35-Boumerdès", 
    "36-El Tarf", "37-Tindouf", "38-Tissemsilt", "39-El Oued", "40-Khenchela", 
    "41-Souk Ahras", "42-Tipaza", "43-Mila", "44-Aïn Defla", "45-Naâma", 
    "46-Aïn Témouchent", "47-Ghardaïa", "48-Relizane", "49-El M'Ghair", "50-El Meniaa", 
    "51-Ouled Djellal", "52-Bordj Baji Mokhtar", "53-Béni Abbès", "54-Timimoun", 
    "55-Touggourt", "56-Djanet", "57-In Salah", "58-In Guezzam"
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

      await addDoc(collection(db, "declarations"), {
        userId: user?.uid,
        quantite: form.quantite,
        type: form.type,
        etat: form.etat,
        wilaya: form.wilaya,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Succès", "Déclaration enregistrée ✔");
      router.back();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Emballages vides à collecter</Text>
        <Text style={styles.subtitle}>Déclarez vos bidons phytosanitaires vides</Text>

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
        <Text style={styles.label}>Wilaya (Sélectionnez votre wilaya)</Text>
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
              <Text style={[
                styles.chipText,
                form.wilaya === w && styles.activeChipText
              ]}>{w}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#4CAF50", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#8E949A", marginBottom: 25 },
  label: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold", marginTop: 15, marginBottom: 10 },
  input: { backgroundColor: "#1A1C1E", borderWidth: 1, borderColor: "#2D3135", borderRadius: 8, height: 50, paddingHorizontal: 15, color: "#FFFFFF", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  typeButton: { flex: 1, backgroundColor: "#1A1C1E", height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", marginHorizontal: 2, borderWidth: 1, borderColor: "#2D3135" },
  stateButton: { backgroundColor: "#1A1C1E", height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 8, borderWidth: 1, borderColor: "#2D3135" },
  activeGreenButton: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
  wilayaScroll: { flexDirection: "row", marginBottom: 30 },
  wilayaChip: { backgroundColor: "#1A1C1E", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: "#2D3135" },
  activeChip: { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
  chipText: { color: "#FFFFFF", fontSize: 13 },
  activeChipText: { color: "#4CAF50", fontWeight: "bold" }, // تغيير لون النص عند الاختيار لتمييزه
  confirmButton: { backgroundColor: "#4CAF50", height: 55, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  confirmText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  cancelButton: { backgroundColor: "#111315", height: 55, borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#2D3135" },
  cancelText: { color: "#FFFFFF", fontSize: 16 },
});