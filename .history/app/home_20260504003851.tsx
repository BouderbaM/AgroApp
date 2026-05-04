import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";
import { useLanguage } from "../context/LanguageContext";

const HomeScreen = () => {
  const router = useRouter();

  /* ================= LANGUAGE ================= */
  const { lang, t } = useLanguage();

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

      const ref = collection(db, "declarations");

      const baseQuery = (etat: string) =>
        query(ref, where("userId", "==", user.uid), where("etat", "==", etat));

      const [total, bon, ecrase, endommage] = await Promise.all([
        getCountFromServer(query(ref, where("userId", "==", user.uid))),
        getCountFromServer(baseQuery("Bon")),
        getCountFromServer(baseQuery("Écrasé")),
        getCountFromServer(baseQuery("Endommagé")),
      ]);

      setStats({
        total: total.data().count,
        bon: bon.data().count,
        ecrase: ecrase.data().count,
        endommage: endommage.data().count,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>♻️ {t[lang].headerTitle}</Text>

          <Text style={styles.subtitle}>{t[lang].headerSubtitle}</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t[lang].roleBadge}</Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          <StatCard
            label={t[lang].total}
            value={stats.total}
            icon="cube-outline"
          />

          <StatCard
            label={t[lang].good}
            value={stats.bon}
            icon="checkmark-circle"
            color="#2ecc71"
          />

          <StatCard
            label={t[lang].crushed}
            value={stats.ecrase}
            icon="warning"
            color="#facc15"
          />

          <StatCard
            label={t[lang].damaged}
            value={stats.endommage}
            icon="close-circle"
            color="#ef4444"
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#0b1f16" />
          <Text style={styles.primaryText}>{t[lang].newDeclaration}</Text>
        </TouchableOpacity>

        {/* ABOUT */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>{t[lang].aboutTitle}</Text>

          <Text style={styles.aboutText}>{t[lang].aboutText}</Text>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#2ecc71" />
          <Text style={[styles.navText, { color: "#2ecc71" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>{t[lang].declaration}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/collections_list")}>
          <Ionicons name="leaf-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>{t[lang].collection}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>{t[lang].profile}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* ================= CARD ================= */
const StatCard = ({ label, value, icon, color = "#2ecc71" }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default HomeScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 100,
  },

  headerBox: {
    backgroundColor: "#0f2a1e",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1e3a2f",
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    color: "#2ecc71",
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
  },

  badge: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#2ecc71",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#2ecc71",
    fontSize: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#0f2a1e",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e3a2f",
    marginBottom: 10,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },

  primaryBtn: {
    flexDirection: "row",
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },

  primaryText: {
    color: "#0b1f16",
    fontWeight: "bold",
  },

  aboutBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#0f2a1e",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  aboutTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
  },

  aboutText: {
    color: "#94a3b8",
    fontSize: 13,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: "#081812",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1e3a2f",
  },

  navText: {
    color: "#94a3b8",
    fontSize: 11,
  },
});
