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
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="cube-outline" size={18} color="#4CAF50" />
          <Text style={styles.qty}>{item.quantite}</Text>
        </View>

        <Text style={[styles.status, { color: getColor(item.etat) }]}>
          {item.etat}
        </Text>
      </View>

      {/* USER */}
      <View style={styles.row}>
        <Ionicons name="person-outline" size={16} color="#9ca3af" />
        <Text style={styles.text}>
          {item.nom || "Nom inconnu"} {item.prenom || ""}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="call-outline" size={16} color="#9ca3af" />
        <Text style={styles.text}>{item.telephone || "Non disponible"}</Text>
      </View>

      {/* LOCATION */}
      <View style={styles.row}>
        <Ionicons name="location-outline" size={16} color="#9ca3af" />
        <Text style={styles.text}>{item.point_collecte}</Text>
      </View>

      {/* DATE */}
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
        <Text style={styles.text}>{item.date_collecte}</Text>
      </View>

      {/* PRICE */}
      <View style={styles.priceBox}>
        <Ionicons name="cash-outline" size={18} color="#4CAF50" />
        <Text style={styles.price}>
          {Number(item.prixTotal ?? 0).toFixed(2)} DA
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Ionicons
          name="checkmark-done-circle-outline"
          size={16}
          color="#22c55e"
        />
        <Text style={styles.footerText}>Collecté</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🚛 Collections</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15,
  },

  title: {
    color: "#4CAF50",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#334155",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  qty: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  status: {
    fontWeight: "bold",
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  text: {
    color: "#cbd5f5",
    fontSize: 13,
  },

  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 10,
  },

  price: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },

  footerText: {
    color: "#22c55e",
    fontSize: 12,
  },
});
