import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Switch
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Register() {
  const router = useRouter();
  
  // قائمة جميع ولايات الجزائر (58 ولاية)
  const algeriaWilayas = [
    "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
    "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", 
    "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", 
    "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda", 
    "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", 
    "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla", 
    "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arreridj", "35 - Boumerdès", 
    "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", 
    "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", 
    "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", 
    "50 - Bordj Badji Mokhtar", "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", 
    "54 - In Guezzam", "55 - Touggourt", "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
  ];

  const [form, setForm] = useState({
    role: "Agriculteur",
    prenom: "",
    nom: "",
    phone: "",
    email: "",
    password: "",
    wilaya: "",
    acceptTerms: false,
  });

  const handleRegister = async () => {
    try {
      if (!form.email || !form.password || !form.wilaya || !form.phone) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
        return;
      }
      if (!form.acceptTerms) {
        Alert.alert("Erreur", "Veuillez accepter la politique de confidentialité");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        role: form.role,
        prenom: form.prenom,
        nom: form.nom,
        phone: form.phone,
        email: form.email,
        wilaya: form.wilaya,
        createdAt: new Date(),
      });

      Alert.alert("Succès", "Compte créé avec succès ✔");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>EcoPhytoCycle</Text>
          <Text style={styles.brandSub}>DZ - S'inscrire</Text>
        </View>

        {/* Role Selection */}
        <Text style={styles.label}>Rôle</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.role}
            onValueChange={(v) => setForm({ ...form, role: v })}
            style={styles.picker}
            dropdownIconColor="#4CAF50"
          >
            <Picker.Item label="Agriculteur" value="Agriculteur" color="#000" />
            <Picker.Item label="Collecteur" value="Collecteur" color="#000" />
          </Picker>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Prénom</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Votre prénom" 
          placeholderTextColor="#5A5E62"
          onChangeText={(v) => setForm({ ...form, prenom: v })}
        />

        <Text style={styles.label}>Nom</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Votre nom" 
          placeholderTextColor="#5A5E62"
          onChangeText={(v) => setForm({ ...form, nom: v })}
        />

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput 
          style={styles.input} 
          placeholder="+213 6XX XXX XXX" 
          placeholderTextColor="#5A5E62"
          keyboardType="phone-pad"
          onChangeText={(v) => setForm({ ...form, phone: v })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="votre.email@example.com" 
          placeholderTextColor="#5A5E62"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(v) => setForm({ ...form, email: v })}
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe" 
          placeholderTextColor="#5A5E62"
          secureTextEntry
          onChangeText={(v) => setForm({ ...form, password: v })}
        />

        {/* Wilaya Selection */}
        <Text style={styles.label}>Wilaya</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.wilaya}
            onValueChange={(v) => setForm({ ...form, wilaya: v })}
            style={styles.picker}
            dropdownIconColor="#4CAF50"
          >
            <Picker.Item label="Sélectionnez une wilaya" value="" color="#8E949A" />
            {algeriaWilayas.map((w, i) => (
              <Picker.Item key={i} label={w} value={w} color="#000" />
            ))}
          </Picker>
        </View>

        {/* Privacy Policy Box */}
        <View style={styles.policyCard}>
          <View style={styles.row}>
            <Switch 
              value={form.acceptTerms} 
              onValueChange={(v) => setForm({ ...form, acceptTerms: v })}
              trackColor={{ false: "#2D3135", true: "#4CAF50" }}
            />
            <Text style={styles.policyText}>
              J'accepte la politique de confidentialité et le traitement de mes données...
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lire la politique complète</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
          <Text style={styles.submitBtnText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/connexion")}>
          <Text style={styles.footerText}>Vous avez un compte? <Text style={styles.linkText}>Connexion</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111315' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 25 },
  brandTitle: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50' },
  brandSub: { color: '#8E949A', fontSize: 14 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  input: { 
    backgroundColor: '#1A1C1E', 
    borderWidth: 1, 
    borderColor: '#2D3135', 
    borderRadius: 8, 
    height: 50, 
    paddingHorizontal: 15, 
    color: '#FFFFFF' 
  },
  pickerWrapper: { 
    backgroundColor: '#1A1C1E', 
    borderWidth: 1, 
    borderColor: '#2D3135', 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  picker: { color: '#FFFFFF', height: 50 },
  policyCard: { 
    backgroundColor: '#1A1C1E', 
    borderRadius: 10, 
    padding: 15, 
    marginTop: 20, 
    borderWidth: 1, 
    borderColor: '#2D3135' 
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  policyText: { color: '#8E949A', fontSize: 12, flex: 1, marginLeft: 10 },
  linkText: { color: '#4CAF50', fontWeight: 'bold' },
  submitBtn: { 
    backgroundColor: '#386641', // اللون الأخضر الداكن كما في الصورة
    height: 55, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 25 
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footerText: { color: '#8E949A', textAlign: 'center', marginTop: 20 }
});