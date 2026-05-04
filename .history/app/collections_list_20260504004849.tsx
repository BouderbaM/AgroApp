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
import { useLanguage } from "../context/LanguageContext";

export default function CollectionsPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();

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
    0,
  );

  const totalItems = data.length;

  /* ================= COLORS ================= */
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

      <Text style={styles.name}>
        {item.nom || t[lang].unknownName} {item.prenom || ""}
      </Text>

      <Text style={styles.phone}>📞 {item.phone || t[lang].noPhone}</Text>

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

      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {Number(item.prixTotal ?? 0).toFixed(2)} DA
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>♻️ {t[lang].collectionsTitle}</Text>

        <Text style={styles.headerSubtitle}>{t[lang].collectionsSubtitle}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={22} color="#2ecc71" />
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>{t[lang].collects}</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={22} color="#2ecc71" />
          <Text style={styles.statNumber}>{totalMoney.toFixed(2)} DA</Text>
          <Text style={styles.statLabel}>{t[lang].revenue}</Text>
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
          <Text style={styles.navText}>{t[lang].home}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>{t[lang].declaration}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/collections_list")}>
          <Ionicons name="leaf-outline" size={22} color="#2ecc71" />
          <Text style={[styles.navText, { color: "#2ecc71" }]}>
            {t[lang].collection}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>{t[lang].profile}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
    padding: 15,
  },

  /* HEADER */
  headerBox: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 18,
    backgroundColor: "#0f2a1e",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  headerTitle: {
    color: "#2ecc71",
    fontSize: 28,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },

  /* STATS */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#0f2a1e",
    borderWidth: 1,
    borderColor: "#1e3a2f",
    alignItems: "center",
  },

  statNumber: {
    color: "#2ecc71",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },

  /* CARD */
  card: {
    backgroundColor: "#0f2a1e",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  qty: {
    color: "#fff",
    fontWeight: "bold",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  phone: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoText: {
    color: "#cbd5f5",
    fontSize: 12,
  },

  priceContainer: {
    marginTop: 12,
    backgroundColor: "#0b1f16",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  price: {
    color: "#2ecc71",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* NAV */
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
