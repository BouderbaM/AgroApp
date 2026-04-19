import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig"; // تأكد من صحة المسار لملف firebaseConfig

const HomeScreen = () => {
  const router = useRouter();

  // --- States ---
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  // استرجاع البيانات عند فتح الصفحة
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const declarationsRef = collection(db, "declarations");

      // 1. إجمالي التصريحات
      const totalQuery = query(declarationsRef, where("userId", "==", userId));
      const totalSnapshot = await getCountFromServer(totalQuery);

      // 2. المؤكدة
      const confirmedQuery = query(
        declarationsRef,
        where("userId", "==", userId),
        where("status", "==", "confirmed"),
      );
      const confirmedSnapshot = await getCountFromServer(confirmedQuery);

      // 3. قيد الانتظار
      const pendingQuery = query(
        declarationsRef,
        where("userId", "==", userId),
        where("status", "==", "pending"),
      );
      const pendingSnapshot = await getCountFromServer(pendingQuery);

      setStats({
        total: totalSnapshot.data().count,
        confirmed: confirmedSnapshot.data().count,
        pending: pendingSnapshot.data().count,
      });
    } catch (error) {
      console.error("Error fetching statistics: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>EcoPhytoCycle DZ</Text>
          <Text style={styles.welcomeUser}>
            Bienvenue, {auth.currentUser?.email?.split("@")[0] || "User"}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Agriculteur</Text>
          </View>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Statistiques du mois</Text>
            {loading && <ActivityIndicator size="small" color="#4caf50" />}
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Déclarations</Text>
            <Text style={[styles.statValue, { color: "#4caf50" }]}>
              {loading ? "..." : stats.total}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Confirmées</Text>
            <Text style={[styles.statValue, { color: "#4caf50" }]}>
              {loading ? "..." : stats.confirmed}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>En attente</Text>
            <Text style={[styles.statValue, { color: "#ffc107" }]}>
              {loading ? "..." : stats.pending}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/declarations_list")} // مثال لمسار آخر
        >
          <Text style={styles.primaryButtonText}>
            Emballages vides à collecter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/collect_points")} // مثال لمسار آخر
        >
          <Text style={styles.secondaryButtonText}>Points de collecte</Text>
        </TouchableOpacity>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>À propos</Text>
          <Text style={styles.aboutText}>
            EcoPhytoCycle DZ est une plateforme de gestion du recyclage des
            bidons de produits phytosanitaires.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4caf50" />
          <Text style={[styles.navText, { color: "#4caf50" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/declarer")}
        >
          <MaterialCommunityIcons name="send" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="business" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Agriculteur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
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
  brandTitle: { color: "#4caf50", fontSize: 26, fontWeight: "bold" },
  welcomeUser: { color: "#9ca3af", fontSize: 16, marginTop: 5 },
  badgeContainer: {
    borderWidth: 1,
    borderColor: "#4caf50",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 10,
  },
  badgeText: { color: "#4caf50", fontSize: 13, fontWeight: "bold" },
  statsCard: {
    backgroundColor: "#1c1e21",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2d3035",
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statsTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statLabel: { color: "#9ca3af", fontSize: 15 },
  statValue: { fontSize: 20, fontWeight: "bold" },
  primaryButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4caf50",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  secondaryButtonText: { color: "#4caf50", fontSize: 16, fontWeight: "600" },
  aboutCard: {
    borderWidth: 1,
    borderColor: "#ffc107",
    borderRadius: 10,
    padding: 18,
    backgroundColor: "#1c1e21",
  },
  aboutTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: { color: "#9ca3af", fontSize: 14, lineHeight: 20 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1a1c1e",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2d3035",
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around",
  },
  navItem: { alignItems: "center" },
  navText: { color: "#9ca3af", fontSize: 11, marginTop: 4 },
});

export default HomeScreen;
