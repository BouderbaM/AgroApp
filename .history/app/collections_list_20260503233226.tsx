import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../constants/firebaseConfig";

export default function CollectionsPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "collections"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= KPI ================= */
  const totalMoney = data.reduce(
    (sum, item) => sum + Number(item.prixTotal ?? 0),
    0
  );

  const totalItems = data.length;

  /* ================= COLORS ECO ================= */
  const getColor = (etat: string) => {
    switch (etat) {
      case "Bon":
        return "#2ecc71";
      case "Écrasé":
        return "#f59e0b";
      case "Endommagé":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      
      {/* TOP */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="cube-outline" size={18} color="#2ecc71" />
          <Text style={styles.qty}>{item.quantite} bidons</Text>
        </View>

        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor: getColor(item.etat) + "20",
              color: getColor(item.etat),
            },
          ]}
        >
          {item.etat}
        </Text>
      </View>

      {/* USER */}
      <Text style={styles.name}>
        {item.nom || "Nom inconnu"} {item.prenom || ""}
      </Text>

      <Text style={styles.phone}>📞 {item.phone || "Non disponible"}</Text>

      {/* INFO */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Ionicons name="location-outline" size={16} color="#94a3b8" />
          <Text style={styles.infoText}>{item.point_collecte}</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
          <Text style={styles.infoText}>{item.date_collecte}</Text>
        </View>
      </View>

      {/* PRICE */}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {Number(item.prixTotal ?? 0).toFixed(2)} DA
        </Text>
      </View>
    </TouchableOpacity>
  );

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>♻️ Collections</Text>
        <Text style={styles.headerSubtitle}>
          Suivi intelligent du recyclage des bidons agricoles
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={22} color="#2ecc71" />
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Collectes</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={22} color="#2ecc71" />
          <Text style={styles.statNumber}>
            {totalMoney.toFixed(2)} DA
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <Ionicons name="paper-plane-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Déclaration</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/collections_list")}>
          <Ionicons name="leaf-outline" size={22} color="#2ecc71" />
          <Text style={[styles.navText, { color: "#2ecc71" }]}>
            Collection
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}