import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../constants/firebaseConfig";

export default function CollectionsPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

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
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     KPIs (Enterprise metrics)
  ========================== */
  const totalMoney = useMemo(
    () => data.reduce((s, i) => s + Number(i.prixTotal || 0), 0),
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.nom?.toLowerCase().includes(search.toLowerCase()) ||
        item.prenom?.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === "ALL" ? true : item.etat === filter;

      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  const getColor = (etat: string) => {
    switch (etat) {
      case "Bon":
        return "#22c55e";
      case "Écrasé":
        return "#f59e0b";
      case "Endommagé":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  /* =========================
     CARD
  ========================== */
  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.row}>
          <Ionicons name="cube-outline" size={18} color="#4CAF50" />
          <Text style={styles.qty}>{item.quantite} bidons</Text>
        </View>

        <Text
          style={[
            styles.badge,
            { backgroundColor: getColor(item.etat) + "25", color: getColor(item.etat) },
          ]}
        >
          {item.etat}
        </Text>
      </View>

      <Text style={styles.name}>
        {item.nom} {item.prenom}
      </Text>

      <Text style={styles.sub}>📞 {item.phone}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          📍 {item.point_collecte}
        </Text>
        <Text style={styles.meta}>
          📅 {item.date_collecte}
        </Text>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.price}>
          {Number(item.prixTotal || 0).toFixed(2)} DA
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <Text style={styles.title}>Collections Dashboard</Text>
      <Text style={styles.subtitle}>
        Real-time monitoring system
      </Text>

      {/* KPI */}
      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Ionicons name="layers-outline" size={22} color="#4CAF50" />
          <Text style={styles.kpiValue}>{data.length}</Text>
          <Text style={styles.kpiLabel}>Total</Text>
        </View>

        <View style={styles.kpi}>
          <Ionicons name="cash-outline" size={22} color="#4CAF50" />
          <Text style={styles.kpiValue}>
            {totalMoney.toFixed(2)}
          </Text>
          <Text style={styles.kpiLabel}>Revenue</Text>
        </View>

        <View style={styles.kpi}>
          <Ionicons name="checkmark-done-outline" size={22} color="#4CAF50" />
          <Text style={styles.kpiValue}>
            {data.filter(d => d.etat === "Bon").length}
          </Text>
          <Text style={styles.kpiLabel}>Good</Text>
        </View>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Search user..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* FILTER */}
      <View style={styles.filterRow}>
        {["ALL", "Bon", "Écrasé", "Endommagé"].map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}>
            <Text
              style={[
                styles.filterBtn,
                filter === f && styles.filterActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : filteredData.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={40} color="#64748b" />
          <Text style={styles.emptyText}>No data found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="analytics-outline" size={22} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    padding: 15,
  },

  /* HEADER */
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 15,
  },

  /* KPI */
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  kpi: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  kpiValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  kpiLabel: {
    color: "#94a3b8",
    fontSize: 11,
  },

  /* SEARCH */
  search: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  /* FILTER */
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  filterBtn: {
    color: "#94a3b8",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#111827",
    overflow: "hidden",
  },
  filterActive: {
    color: "#4CAF50",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },

  /* CARD */
  card: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qty: {
    color: "#fff",
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  sub: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    color: "#94a3b8",
    fontSize: 11,
  },
  priceBox: {
    marginTop: 10,
    backgroundColor: "#0b1220",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  price: {
    color: "#4CAF50",
    fontWeight: "bold",
  },

  /* EMPTY */
  empty: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#64748b",
    marginTop: 10,
  },

  /* NAV */
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#0b1220",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },
});