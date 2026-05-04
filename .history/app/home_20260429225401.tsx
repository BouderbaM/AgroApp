import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
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

import { auth, db } from "../constants/firebaseConfig";

const AgriculteurDashboard = () => {
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    bon: 0,
    ecrase: 0,
    attente: 0,
  });

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, "declarations");

      // 📊 stats
      const qTotal = query(ref, where("userId", "==", user.uid));
      const qBon = query(
        ref,
        where("userId", "==", user.uid),
        where("etat", "==", "Bon")
      );
      const qEcrase = query(
        ref,
        where("userId", "==", user.uid),
        where("etat", "==", "Écrasé")
      );
      const qAttente = query(
        ref,
        where("userId", "==", user.uid),
        where("status", "==", "en attente")
      );

      const [t, b, e, a] = await Promise.all([
        getCountFromServer(qTotal),
        getCountFromServer(qBon),
        getCountFromServer(qEcrase),
        getCountFromServer(qAttente),
      ]);

      setStats({
        total: t.data().count,
        bon: b.data().count,
        ecrase: e.data().count,
        attente: a.data().count,
      });

      // 📋 last declarations
      const snap = await getDocs(qTotal);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setList(data.slice(0, 5)); // آخر 5 فقط
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const StatRow = ({ label, value, color }) => (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>PhytoCycle</Text>

          <Text style={styles.welcomeUser}>
            Bienvenue, {auth.currentUser?.email?.split("@")[0]}
          </Text>

          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Agriculteur</Text>
          </View>
        </View>

        {/* STATS CARD */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Dashboard Agricole</Text>
            {loading && <ActivityIndicator color="#4caf50" />}
          </View>

          <StatRow label="Total" value={stats.total} color="#4caf50" />
          <StatRow label="Bon" value={stats.bon} color="#4caf50" />
          <StatRow label="Écrasé" value={stats.ecrase} color="#f44336" />
          <StatRow label="En attente" value={stats.attente} color="#ffc107" />
        </View>

        {/* LIST */}
        <Text style={styles.listTitle}>Dernières déclarations</Text>

        {list.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemText}>
              {item.quantite} bidons - {item.contenance}
            </Text>
            <Text style={styles.itemSub}>
              {item.etat} • {item.point_collecte}
            </Text>
          </View>
        ))}

        {/* ACTIONS */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/declarer")}
        >
          <Text style={styles.primaryButtonText}>Nouvelle déclaration</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <MaterialCommunityIcons name="send" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="leaf" size={24} color="#4caf50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AgriculteurDashboard;