import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");

  // جلب اسم المستخدم لعرضه في الترحيب
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserName(snap.data().prenom || "User");
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>EcoPhytoCycle DZ</Text>
          <Text style={styles.welcomeText}>Bienvenue, {userName}</Text>

          {/* Role Badge */}
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Agriculteur</Text>
          </View>
        </View>

        {/* Statistiques Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistiques du mois</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Déclarations</Text>
            <Text style={[styles.statNumber, { color: "#4CAF50" }]}>0</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Confirmées</Text>
            <Text style={[styles.statNumber, { color: "#4CAF50" }]}>0</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>En attente</Text>
            <Text style={[styles.statNumber, { color: "#FFB300" }]}>0</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/declarer")}
        >
          <Text style={styles.buttonText}>Emballages vides à collecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Points de collecte</Text>
        </TouchableOpacity>

        {/* À propos Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>À propos</Text>
          <Text style={styles.aboutContent}>
            EcoPhytoCycle DZ est une plateforme de gestion du recyclage des
            bidons de produits phytosanitaires.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={20} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="send-outline" size={20} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agriculteur")}
        >
          <Ionicons name="leaf-outline" size={20} color="#8E949A" />
          <Text style={styles.navText}>Agriculteur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profil")}
        >
          <Ionicons name="person-outline" size={20} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  welcomeText: {
    fontSize: 14,
    color: "#8E949A",
    marginTop: 5,
  },
  roleBadge: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 15,
  },
  roleText: {
    color: "#4CAF50",
    fontSize: 12,
  },
  statsCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#26292B",
    marginBottom: 20,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statLabel: {
    color: "#8E949A",
    fontSize: 14,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#111315",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 25,
  },
  secondaryButtonText: {
    color: "#4CAF50",
    fontSize: 16,
  },
  aboutCard: {
    backgroundColor: "#111315",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#FFB300", // لون الإطار الأصفر كما في الصورة
  },
  aboutTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutContent: {
    color: "#8E949A",
    fontSize: 13,
    lineHeight: 20,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#1A1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26292B",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: "#8E949A",
  },
});
