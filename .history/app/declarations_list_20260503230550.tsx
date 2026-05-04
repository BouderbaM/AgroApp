import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function DeclarationsList() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "declarations"),
        where("userId", "==", user.uid),
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setData(list);
    } finally {
      setLoading(false);
    }
  };

  /* ================= KPI ================= */
  const kpi = useMemo(() => {
    return {
      total: data.length,
      good: data.filter((d) => d.etat === "Bon").length,
      revenue: data.reduce((s, i) => s + Number(i.prixTotal || 0), 0),
    };
  }, [data]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const text = `${item.nom} ${item.prenom}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchFilter = filter === "ALL" ? true : item.etat === filter;

      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  /* ================= COLORS ================= */
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

  /* ================= ACTION ================= */
  const handleCollect = async (item: any) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "collections"), {
      ...item,
      collectorUserId: user.uid,
      status: "collecté",
      createdAt: serverTimestamp(),
    });

    await deleteDoc(doc(db, "declarations", item.id));

    setData((prev) => prev.filter((d) => d.id !== item.id));
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardTop}>
        <Text style={styles.title}>📦 {item.quantite} bidons</Text>

        <View
          style={[
            styles.status,
            { backgroundColor: getColor(item.etat) + "25" },
          ]}
        >
          <Text style={{ color: getColor(item.etat), fontWeight: "700" }}>
            {item.etat}
          </Text>
        </View>
      </View>

      {/* INFO */}
      <Text style={styles.text}>
        👤 {item.nom} {item.prenom}
      </Text>

      <Text style={styles.text}>📍 {item.point_collecte}</Text>

      <Text style={styles.text}>
        💰 {Number(item.prixTotal || 0).toFixed(2)} DA
      </Text>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => handleCollect(item)}
        >
          <Ionicons name="car-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Collect</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() =>
            router.push({
              pathname: "/qr",
              params: { data: JSON.stringify(item) },
            })
          }
        >
          <Ionicons name="qr-code-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>📋 Declarations</Text>
      <Text style={styles.sub}>Enterprise Control Panel</Text>

      {/* KPI */}
      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Ionicons name="layers-outline" size={18} color="#4CAF50" />
          <Text style={styles.kpiValue}>{kpi.total}</Text>
          <Text style={styles.kpiLabel}>Total</Text>
        </View>

        <View style={styles.kpi}>
          <Ionicons name="checkmark-done-outline" size={18} color="#4CAF50" />
          <Text style={styles.kpiValue}>{kpi.good}</Text>
          <Text style={styles.kpiLabel}>Good</Text>
        </View>

        <View style={styles.kpi}>
          <Ionicons name="cash-outline" size={18} color="#4CAF50" />
          <Text style={styles.kpiValue}>{kpi.revenue.toFixed(0)}</Text>
          <Text style={styles.kpiLabel}>DA</Text>
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
      <View style={styles.filters}>
        {["ALL", "Bon", "Écrasé", "Endommagé"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filter, filter === f && styles.filterActive]}
          >
            <Text
              style={{
                color: filter === f ? "#fff" : "#94a3b8",
                fontSize: 12,
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={40} color="#64748b" />
          <Text style={styles.emptyText}>No data found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={22} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="grid-outline" size={22} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1c",
    padding: 15,
  },

  header: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
  },

  sub: {
    color: "#94a3b8",
    marginBottom: 12,
  },

  /* KPI */
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
    fontWeight: "800",
  },
  kpiLabel: {
    color: "#94a3b8",
    fontSize: 11,
  },

  /* SEARCH */
  search: {
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 10,
  },

  /* FILTER */
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  filter: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#111827",
    borderRadius: 20,
  },
  filterActive: {
    backgroundColor: "#4CAF50",
  },

  /* CARD */
  card: {
    width: "48%",
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontWeight: "800",
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  text: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 6,
  },

  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2563EB",
    padding: 6,
    borderRadius: 8,
    justifyContent: "center",
    gap: 5,
  },

  btnSecondary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 8,
    justifyContent: "center",
    gap: 5,
  },

  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
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
    backgroundColor: "#0a0f1c",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#1f2937",
    borderTopWidth: 1,
  },
});
