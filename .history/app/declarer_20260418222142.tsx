import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Declarer() {
  const router = useRouter();
  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "MSila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arreridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Meniaa",
  ];
  const [form, setForm] = useState({
    quantite: "",
    type: "HDPE",
    etat: "bon",
    wilaya: "",
  });

  const handleConfirm = () => {
    if (!form.quantite || !form.wilaya) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    Alert.alert("Succès", "Déclaration envoyée ✔");
    console.log(form);

    // هنا لاحقًا نربطها مع Firebase
  };

  const handleCancel = () => {
    setForm({
      quantite: "",
      type: "HDPE",
      etat: "bon",
      wilaya: "",
    });

    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      {/* 🟢 Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Emballage vide à collecte
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Déclarer vos bidons phytosanitaires vides
      </Text>

      {/* 📦 Quantité */}
      <TextInput
        placeholder="Quantité"
        keyboardType="numeric"
        value={form.quantite}
        onChangeText={(t) => setForm({ ...form, quantite: t })}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* 🧪 Type */}
      <Text>Type</Text>
      <Picker
        selectedValue={form.type}
        onValueChange={(v) => setForm({ ...form, type: v })}
      >
        <Picker.Item label="HDPE" value="HDPE" />
        <Picker.Item label="TPE" value="TPE" />
      </Picker>

      {/* ⚠️ État */}
      <Text>État</Text>
      <Picker
        selectedValue={form.etat}
        onValueChange={(v) => setForm({ ...form, etat: v })}
      >
        <Picker.Item label="Bon" value="bon" />
        <Picker.Item label="Écrasé" value="ecrase" />
        <Picker.Item label="Endommagé" value="endommage" />
      </Picker>

      {/* 📍 Wilaya */}
      <TextInput
        placeholder="Wilaya"
        value={form.wilaya}
        onChangeText={(t) => setForm({ ...form, wilaya: t })}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* 🔘 Buttons */}
      <TouchableOpacity
        onPress={handleConfirm}
        style={{
          backgroundColor: "green",
          padding: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white" }}>Confirmer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCancel}
        style={{
          backgroundColor: "red",
          padding: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white" }}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}
