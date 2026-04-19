import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

// ... (بقية الاستيرادات السابقة)

export default function Register() {
  // مصفوفة الولايات كاملة (58 ولاية)
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
    // ... بقية الحقول
    wilaya: "",
  });

  return (
    <View style={styles.container}>
      {/* ... بقية العناصر */}

      <Text style={styles.label}>Wilaya</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.wilaya}
          onValueChange={(itemValue) => setForm({ ...form, wilaya: itemValue })}
          dropdownIconColor="#FFFFFF"
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez une wilaya" value="" color="#8E949A" />
          {algeriaWilayas.map((wilaya, index) => (
            <Picker.Item 
              key={index} 
              label={wilaya} 
              value={wilaya} 
              color="#FFFFFF" 
            />
          ))}
        </Picker>
      </View>

      {/* ... بقية العناصر */}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... ستايلاتك السابقة
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#1A1C1E',
    borderWidth: 1,
    borderColor: '#2D3135',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 52,
  },
});