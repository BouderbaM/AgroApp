import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../constants/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    wilaya: "",
    role: "agriculteur",
  });

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        phone: form.phone,
        wilaya: form.wilaya,
        role: form.role,
      });

      Alert.alert("Success", "Compte créé !");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Créer un compte</Text>

      {Object.keys(form).map((key) =>
        key !== "role" ? (
          <TextInput
            key={key}
            placeholder={key}
            onChangeText={(text) =>
              setForm({ ...form, [key]: text })
            }
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
        ) : null
      )}

      <Text>Role:</Text>
      <TextInput
        placeholder="agriculteur / vendeur / collecteur"
        onChangeText={(text) =>
          setForm({ ...form, role: text })
        }
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TouchableOpacity onPress={handleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}