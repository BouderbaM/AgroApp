import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
const WelcomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logoText}>EcoPhytoCycle</Text>
          <Text style={styles.subLogoText}>DZ</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            BIENVENUE SUR ECOPHYTOCYCLE DZ
          </Text>
          <Text style={styles.welcomeDesc}>
            Découvrez la première application mobile dédiée à la traçabilité et
            au recyclage des emballages vides de produits phytosanitaires en
            Algérie.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardMainText}>
            Conçue pour les agriculteurs avec l'appui des revendeurs et
            fournisseurs, EcoPhytoCycle DZ optimise la collecte...
          </Text>
          <Text style={styles.cardSubText}>
            Contribuez à une agriculture durable et à une économie circulaire...
          </Text>
          <Text style={styles.cardItalicText}>
            Rejoignez la communauté pour un secteur phytopharmaceutique plus
            vert et responsable.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/index")}
          >
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  scrollContent: {
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  header: { alignItems: "center", marginBottom: 40 },
  logoText: { color: "#4caf50", fontSize: 42, fontWeight: "bold" },
  subLogoText: { color: "#4caf50", fontSize: 24, fontWeight: "600" },
  welcomeSection: { alignItems: "center", marginBottom: 30 },
  welcomeTitle: {
    color: "#4caf50",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeDesc: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#1a1c1e",
    borderRadius: 15,
    padding: 25,
    width: "100%",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardMainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    lineHeight: 24,
  },
  cardSubText: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  cardItalicText: { color: "#9ca3af", fontSize: 14, fontStyle: "italic" },
  buttonContainer: { width: "100%", gap: 15 },
  primaryButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4caf50",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#4caf50", fontSize: 18, fontWeight: "bold" },
});

export default WelcomePage;
