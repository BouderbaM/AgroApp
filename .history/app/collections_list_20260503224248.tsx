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

  // 📊 Stats
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
    <View style={styles.card}>
      {/* TOP */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="cube-outline" size={18} color="#4CAF50" />
          <Text style={styles.qty}>{item.quantite} bidons</Text>
        </View>

        <Text style={[styles.status, { color: getColor(item.etat) }]}>
          {item.etat}
        </Text>
      </View>

      {/* USER */}
      <Text style={styles.name}>
        {item.nom || "Nom inconnu"} {item.prenom || ""}
      </Text>

      <Text style={styles.phone}>📞 {item.telephone || "Non disponible"}</Text>

      {/* INFO GRID */}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🚛 Collections</Text>

      {/* 📊 STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Collectes</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalMoney.toFixed(2)} DA</Text>
          <Text style={styles.statLabel}>Total</Text>
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
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <Ionicons name="paper-plane-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Liste</Text>
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

  header: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statBox: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },

  statNumber: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
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

  status: {
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
});
