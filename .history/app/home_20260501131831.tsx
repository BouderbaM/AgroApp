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
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

const screenWidth = Dimensions.get("window").width;
const HomeScreen = () => {
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    bon: 0,
    ecrase: 0,
    endommage: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) return;

      const declarationsRef = collection(db, "declarations");

      // TOTAL
      const qTotal = query(declarationsRef, where("userId", "==", user.uid));
      const snapTotal = await getCountFromServer(qTotal);

      // BON
      const qBon = query(
        declarationsRef,
        where("userId", "==", user.uid),
        where("etat", "==", "Bon"),
      );
      const snapBon = await getCountFromServer(qBon);

      // ÉCRASÉ
      const qEcrase = query(
        declarationsRef,
        where("userId", "==", user.uid),
        where("etat", "==", "Écrasé"),
      );
      const snapEcrase = await getCountFromServer(qEcrase);

      // ENDOMMAGÉ
      const qEndommage = query(
        declarationsRef,
        where("userId", "==", user.uid),
        where("etat", "==", "Endommagé"),
      );
      const snapEndommage = await getCountFromServer(qEndommage);

      setStats({
        total: snapTotal.data().count,
        bon: snapBon.data().count,
        ecrase: snapEcrase.data().count,
        endommage: snapEndommage.data().count,
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>PhytoCycle</Text>
          <Text style={styles.welcomeUser}>
            Bienvenue, {auth.currentUser?.email?.split("@")[0] || "User"}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Agriculteur</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Statistiques</Text>
            {loading && <ActivityIndicator size="small" color="#4caf50" />}
          </View>

          <View style={styles.inlineStats}>
            {/* TOTAL */}
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {loading ? "..." : stats.total}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>

            {/* BON */}
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <Text style={[styles.statValue, { color: "#4caf50" }]}>
                {loading ? "..." : stats.bon}
              </Text>
              <Text style={styles.statLabel}>Bon</Text>
            </View>

            {/* ÉCRASÉ */}
            <View style={styles.statBox}>
              <Ionicons name="warning" size={16} color="#ffc107" />
              <Text style={[styles.statValue, { color: "#ffc107" }]}>
                {loading ? "..." : stats.ecrase}
              </Text>
              <Text style={styles.statLabel}>Écrasé</Text>
            </View>

            {/* ENDOMMAGÉ */}
            <View style={styles.statBox}>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
              <Text style={[styles.statValue, { color: "#ef4444" }]}>
                {loading ? "..." : stats.endommage}
              </Text>
              <Text style={styles.statLabel}>Endommagé</Text>
            </View>
          </View>
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Répartition des états</Text>

          <PieChart
            data={[
              {
                name: "Bon",
                population: stats.bon,
                color: "#4caf50",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Écrasé",
                population: stats.ecrase,
                color: "#ffc107",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Endommagé",
                population: stats.endommage,
                color: "#ef4444",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
            ]}
            width={screenWidth - 40}
            height={180}
            chartConfig={{
              backgroundColor: "#1c1e21",
              backgroundGradientFrom: "#1c1e21",
              backgroundGradientTo: "#1c1e21",
              color: () => `#fff`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"10"}
            absolute
          />
        </View>
        {/* Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/collect_points")}
        >
          <Text style={styles.secondaryButtonText}>Points de collecte</Text>
        </TouchableOpacity>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>À propos</Text>
          <Text style={styles.aboutText}>
            PhytoCycle est une plateforme de recyclage des bidons agricoles.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
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

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agriculteur")}
        >
          <Ionicons name="business" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Agriculteur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profil")}
        >
          <Ionicons name="person" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121414" },
  scrollContent: { padding: 20, paddingBottom: 100 },

  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  brandTitle: { color: "#4caf50", fontSize: 26, fontWeight: "bold" },
  welcomeUser: { color: "#9ca3af", marginTop: 5 },

  badgeContainer: {
    borderWidth: 1,
    borderColor: "#4caf50",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 10,
  },
  badgeText: { color: "#4caf50", fontWeight: "bold" },

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
    marginBottom: 15,
  },

  statsTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  inlineStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4caf50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },

  secondaryButtonText: {
    color: "#4caf50",
    fontSize: 16,
    fontWeight: "600",
  },

  aboutCard: {
    borderWidth: 1,
    borderColor: "#ffc107",
    borderRadius: 10,
    padding: 18,
    backgroundColor: "#1c1e21",
  },

  aboutTitle: { color: "#fff", fontWeight: "bold", marginBottom: 5 },
  aboutText: { color: "#9ca3af" },

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
  navText: { color: "#9ca3af", fontSize: 11 },
});
