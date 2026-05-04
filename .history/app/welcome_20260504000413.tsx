import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WelcomePage = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.logoText}>PhytoCycle</Text>
          <Text style={styles.subtitle}>
            Plateforme intelligente de recyclage agricole ♻️
          </Text>
        </View>

        {/* INTRO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BIENVENUE SUR PhytoCycle</Text>

          <Text style={styles.cardText}>
            Découvrez la première application mobile dédiée à la traçabilité et
            au recyclage des emballages vides de produits phytosanitaires en
            Algérie.
          </Text>

          <Text style={styles.cardSub}>
            Conçue pour les agriculteurs avec l'appui des revendeurs et
            fournisseurs, PhytoCycle optimise la collecte et le suivi.
          </Text>

          <Text style={styles.cardItalic}>
            🌱 Contribuez à une agriculture durable et à une économie circulaire :
            signalez vos emballages vides !
          </Text>
          <Text style={styles.cardSubText}>
            
          </Text>
          <Text style={styles.cardItalic}>
            Rejoignez la communauté pour un secteur phytopharmaceutique plus
            vert et responsable.
          </Text>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>
          {/* LOGIN */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>

          {/* REGISTER */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/register")}
          >
            <Ionicons name="create-outline" size={20} color="#2ecc71" />
            <Text style={styles.secondaryButtonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomePage;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16", // نفس collections
  },

  scrollContent: {
    padding: 20,
    justifyContent: "center",
    flexGrow: 1,
  },

  /* HEADER */
  headerBox: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoText: {
    color: "#2ecc71",
    fontSize: 32,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 5,
    fontSize: 13,
  },

  /* CARD */
  card: {
    backgroundColor: "#0f2a1e",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e3a2f",
    marginBottom: 30,
  },

  cardTitle: {
    color: "#2ecc71",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  cardText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: "center",
  },

  cardSub: {
    color: "#cbd5f5",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },

  cardItalic: {
    color: "#94a3b8",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },

  /* BUTTONS */
  buttonContainer: {
    gap: 15,
  },

  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,

    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 14,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,

    borderWidth: 1,
    borderColor: "#2ecc71",
    padding: 16,
    borderRadius: 14,
  },

  secondaryButtonText: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "bold",
  },
});
