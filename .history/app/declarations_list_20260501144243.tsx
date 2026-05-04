import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function DeclarationsList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const fetchDeclarations = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "declarations"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setData(list);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (etat: string) => {
    switch (etat) {
      case "Bon":
        return "#4CAF50";
      case "Écrasé":
        return "#FFC107";
      case "Endommagé":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>📦 {item.quantite} bidons</Text>
        <Text style={[styles.status, { color: getColor(item.etat) }]}>
          {item.etat}
        </Text>
      </View>

      <Text style={styles.text}>📍 {item.point_collecte}</Text>
      <Text style={styles.text}>📅 {item.date_collecte}</Text>

      <Text style={styles.small}>Contenance: {item.contenance}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📋 Mes Déclarations</Text>

      {loading ? (
        <ActivityIndicator color="#4CAF50" size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
    padding: 15,
  },

  header: {
    fontSize: 22,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1A1C1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2d2f33",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    fontWeight: "bold",
  },

  text: {
    color: "#9CA3AF",
    marginTop: 5,
  },

  small: {
    color: "#6B7280",
    marginTop: 3,
    fontSize: 12,
  },
});
