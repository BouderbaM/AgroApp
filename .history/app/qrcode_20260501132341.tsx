import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code du sac</Text>

      <QRCode
        value={id} // 🔥 هذا المهم
        size={200}
      />

      <Text style={styles.subtitle}>Montrez ce code au collecteur</Text>
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
  },
  subtitle: {
    color: "#fff",
    marginTop: 20,
  },
});
