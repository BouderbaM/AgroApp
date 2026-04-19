import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>EcoPhytoCycle DZ</Text>
          <Text style={styles.welcomeUser}>Bienvenue, User</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Agriculteur</Text>
          </View>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Statistiques du mois</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Déclarations</Text>
            <Text style={[styles.statValue, { color: "#4caf50" }]}>0</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Confirmées</Text>
            <Text style={[styles.statValue, { color: "#4caf50" }]}>0</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>En attente</Text>
            <Text style={[styles.statValue, { color: "#ffc107" }]}>0</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Emballages vides à collecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Points de collecte</Text>
        </TouchableOpacity>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>À propos</Text>
          <Text style={styles.aboutText}>
            EcoPhytoCycle DZ est une plateforme de gestion du recyclage des bidons de produits phytosanitaires.
          </Text>
        </View>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4caf50" />
          <Text style={[styles.navText, { color: "#4caf50" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="send" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="business" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Agriculteur</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121414" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  brandTitle: { color: "#4caf50", fontSize: 24, fontWeight: "bold" },
  welcomeUser: { color: "#9ca3af", fontSize: 16, marginTop: 5 },
  badgeContainer: { 
    borderWidth: 1, 
    borderColor: "#4caf50", 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    paddingVertical: 4, 
    marginTop: 10 
  },
  badgeText: { color: "#4caf50", fontSize: 12, fontWeight: "600" },

  statsCard: { 
    backgroundColor: "#1c1e21", 
    borderRadius: 12, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: "#2d3035",
    marginBottom: 20 
  },
  statsTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  statRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  statLabel: { color: "#9ca3af", fontSize: 14 },
  statValue: { fontSize: 18, fontWeight: "bold" },

  primaryButton: { 
    backgroundColor: "#5cb85c", 
    paddingVertical: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 12 
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  secondaryButton: { 
    borderWidth: 1, 
    borderColor: "#4caf50", 
    paddingVertical: 15, 
    borderRadius: 8, 
    alignItems: "center",
    marginBottom: 25
  },
  secondaryButtonText: { color: "#4caf50", fontSize: 16, fontWeight: "600" },

  aboutCard: { 
    borderWidth: 1, 
    borderColor: "#ffc107", 
    borderRadius: 8, 
    padding: 15, 
    backgroundColor: "#1c1e21" 
  },
  aboutTitle: { color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  aboutText: { color: "#9ca3af", fontSize: 13, lineHeight: 18 },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1a1c1e",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2d3035",
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around"
  },
  navItem: { alignItems: "center" },
  navText: { color: "#9ca3af", fontSize: 12, marginTop: 4 }
});

export default HomeScreen;