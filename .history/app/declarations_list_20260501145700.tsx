import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import { auth, db } from "../constants/firebaseConfig";

export default function DeclarationsList() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    fetchDeclarations();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, data]);

  // ================= FETCH =================
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

      const list: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);
      setFiltered(list); // initial
    } catch (error) {
      console.log("Firestore error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const applyFilter = () => {
    if (filter === "Tous") {
      setFiltered(data);
    } else {
      setFiltered(data.filter((item) => item.etat === filter));
    }
  };

  // ================= COLORS =================
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

  // ================= ITEM =================
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>📦 {item.quantite} bidons</Text>

        <Text style={[styles.status, { color: getColor(item.etat) }]}>
          {item.etat}
        </Text>
      </View>

      <Text style={styles.text}>📍 {item.point_collecte}</Text>
      <Text style={styles.text}>
        📅{" "}
        {item.date_collecte?.seconds
          ? new Date(item.date_collecte.seconds * 1000).toLocaleDateString()
          : item.date_collecte}
      </Text>
      {/* QR BUTTON */}
      <TouchableOpacity
        style={styles.qrBtn}
        onPress={() =>
          router.push({
            pathname: "/qr",
            params: {
              data: JSON.stringify({
                id: item.id,
                quantite: item.quantite,
                etat: item.etat,
                point: item.point_collecte,
                date: item.date_collecte,
              }),
            },
          })
        }
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>🔳 Voir QR</Text>
      </TouchableOpacity>
    </View>
  );

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📋 Déclarations</Text>

      {/* FILTERS */}
      <View style={styles.filters}>
        {["Tous", "Bon", "Écrasé", "Endommagé"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              filter === f && { backgroundColor: "#4CAF50" },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator color="#4CAF50" size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.rowWrap}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* ================= BOTTOM NAV ================= */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarer")}>
          <Ionicons name="paper-plane-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity>
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
    backgroundColor: "#111315",
    padding: 15,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#1A1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2d3035",
  },
  rowWrap: {
    justifyContent: "space-between",
  },

  navText: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },

  header: {
    fontSize: 22,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 10,
  },

  filters: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
  },

  filterBtn: {
    backgroundColor: "#1A1C1E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
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

  qrBtn: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
});
