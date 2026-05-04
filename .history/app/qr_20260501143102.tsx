import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRScreen() {
  const params = useLocalSearchParams();

  const data = JSON.stringify({
    sacId: params.sacId,
    quantite: params.quantite,
    date: params.date,
    point: params.point,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Sac</Text>

      <QRCode value={data} size={220} />

      <Text style={styles.text}>{params.sacId}</Text>
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
  title: { color: "#4CAF50", marginBottom: 20 },
  text: { color: "#fff", marginTop: 10 },
});
