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

  const totalMoney = data.reduce(
    (sum, item) => sum + Number(item.prixTotal ?? 0),
    0,
  );

  const totalItems = data.length;

  const getColor = (etat: string) => {
    switch (etat) {
      case "Bon":
        return "#22c55e";
      case "Écrasé":
        return "#f59e0b";
      case "Endommagé":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      {/* TOP */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="cube-outline" size={18} color="#4CAF50" />
          <Text style={styles.qty}>{item.quantite} bidons</Text>
        </View>

        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor: getColor(item.etat) + "25",
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
          <Ionicons name="location-outline" size={16} color="#9ca3af" />
          <Text style={styles.infoText}>{item.point_collecte}</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
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

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Collections</Text>
        <Text style={styles.headerSubtitle}>
          Suivi intelligent des collectes
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={22} color="#4CAF50" />
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Collectes</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={22} color="#4CAF50" />
          <Text style={styles.statNumber}>{totalMoney.toFixed(2)} DA</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <Ionicons name="paper-plane-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Déclaration</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/collections_list")}>
          <Ionicons name="list-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Collection</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15,
  },

  /* HEADER */
  headerBox: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
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
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.15)",
    alignItems: "center",
  },

  statNumber: {
    color: "#fff",
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
    backgroundColor: "rgba(30, 41, 59, 0.85)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
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
    color: "#9ca3af",
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
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  price: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* BOTTOM NAV */
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: "#0B1220",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },

  navText: {
    color: "#9ca3af",
    fontSize: 11,
  },
});
