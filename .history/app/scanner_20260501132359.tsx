import { BarCodeScanner } from "expo-barcode-scanner";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { db } from "../constants/firebaseConfig";

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = async ({ data }) => {
    setScanned(true);

    try {
      const ref = doc(db, "declarations", data);

      await updateDoc(ref, {
        status: "collecté",
      });

      Alert.alert("Succès", "Sac collecté ✔");
    } catch (e) {
      Alert.alert("Erreur", "QR invalide");
    }
  };

  if (hasPermission === null) {
    return <Text>Demande permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Pas d'accès caméra</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleScan}
      style={{ flex: 1 }}
    />
  );
}
