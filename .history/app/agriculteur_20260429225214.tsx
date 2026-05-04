import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function AgriculteurDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📊 stats
  const [stats, setStats] = useState({
    total: 0,
    bon: 0,
    ecrase: 0,
    attente: 0,
  });

  // 🔥 FETCH DATA FROM FIREBASE
  const fetchData = async () => {
    try {
      const user = auth.currentUser;

      const q = query(
        collection(db, "declarations"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);

      // 📊 calculate stats
      let total = list.length;
      let bon = list.filter((i) => i.etat === "Bon").length;
      let ecrase = list.filter((i) => i.etat === "Écrasé").length;
      let attente = list.filter((i) => i.status === "en attente").length;

      setStats({ total, bon, ecrase, attente });

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📦 CARD UI
  const Card = ({ title, value, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  // 📋 ITEM UI
  const Item = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        {item.quantite} bidons - {item.contenance}
      </Text>
      <Text style={{ color: "#8E949A" }}>
        {item.etat} • {item.point_collecte}
      </Text>
      <Text style={{ color: "#4CAF50" }}>{item.date_collecte}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🌾 Dashboard Agriculteur</Text>

      {/* 📊 CARDS */}
      <View style={styles.grid}>
        <Card title="Total" value={stats.total} color="#2196F3" />
        <Card title="Bon" value={stats.bon} color="#4CAF50" />
        <Card title="Écrasé" value={stats.ecrase} color="#F44336" />
        <Card title="En attente" value={stats.attente} color="#FFC107" />
      </View>

      {/* 📋 LIST */}
      <Text style={styles.subtitle}>📦 Dernières déclarations</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={Item}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
    padding: 15,
  },

  title: {
    color: "#4CAF50",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#fff",
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#1A1C1E",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },

  cardTitle: {
    color: "#8E949A",
    fontSize: 12,
  },

  cardValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  item: {
    backgroundColor: "#1A1C1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
});
