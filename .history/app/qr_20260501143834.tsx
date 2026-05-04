import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRScreen() {
  const params = useLocalSearchParams();

  // 👇 مهم جدًا: استخراج البيانات بشكل صحيح
  const data =
    typeof params.data === "string"
      ? params.data
      : JSON.stringify(params.data || {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code du sac</Text>

      {data ? (
        <QRCode value={data} size={220} />
      ) : (
        <Text style={{ color: "red" }}>QR vide</Text>
      )}

      <Text style={styles.subtitle}>Montrez ce QR au collecteur</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#4CAF50",
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#9ca3af",
    marginTop: 15,
    textAlign: "center",
  },
});
