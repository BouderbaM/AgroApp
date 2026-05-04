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
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

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

      const ref = collection(db, "declarations");

      const baseQuery = (etat) =>
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
        {/* HEADER ECO */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>♻️ PhytoCycle</Text>
          <Text style={styles.subtitle}>
            Gestion intelligente des bidons agricoles
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Agriculteur</Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          <StatCard label="Total" value={stats.total} icon="cube-outline" />
          <StatCard
            label="Bon"
            value={stats.bon}
            icon="checkmark-circle"
            color="#2ecc71"
          />
          <StatCard
            label="Écrasé"
            value={stats.ecrase}
            icon="warning"
            color="#facc15"
          />
          <StatCard
            label="Endommagé"
            value={stats.endommage}
            icon="close-circle"
            color="#ef4444"
          />
        </View>

        {/* ACTION */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#0b1f16" />
          <Text style={styles.primaryText}>Nouvelle Déclaration</Text>
        </TouchableOpacity>

        {/* ABOUT */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>À propos du système</Text>
          <Text style={styles.aboutText}>
            Plateforme de recyclage des bidons agricoles avec suivi intelligent,
            traçabilité et impact environnemental.
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM NAV (UNCHANGED) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={22} color="#2ecc71" />
          <Text style={[styles.navText, { color: "#2ecc71" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <MaterialCommunityIcons name="send" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Liste</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* ================= SMALL COMPONENT ================= */
const StatCard = ({ label, value, icon, color = "#2ecc71" }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default HomeScreen;
