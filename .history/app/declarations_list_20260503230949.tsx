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
  StyleSheet,
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
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
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

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setData(list);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchFilter = filter === "Tous" ? true : item.etat === filter;

      const text = (item.nom + " " + item.prenom || "").toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [data, filter, search]);

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

  /* ================= COLLECT ================= */
  const handleCollect = async (item: any) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "collections"), {
      ...item,
      collectorUserId: user.uid,
      createdAt: serverTimestamp(),
      status: "collecté",
    });

    await deleteDoc(doc(db, "declarations", item.id));

    setData((prev) => prev.filter((d) => d.id !== item.id));
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>📦 {item.quantite} bidons</Text>

        <Text
          style={[
            styles.badge,
            {
              backgroundColor: getColor(item.etat) + "25",
              color: getColor(item.etat),
            },
          ]}
        >
          {item.etat}
        </Text>
      </View>

      <Text style={styles.text}>
        👤 {item.nom} {item.prenom}
      </Text>

      <Text style={styles.text}>📍 {item.point_collecte}</Text>

      <Text style={styles.text}>
        💰 {Number(item.prixTotal ?? 0).toFixed(2)} DA
      </Text>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.collectBtn}
          onPress={() => handleCollect(item)}
        >
          <Ionicons name="car-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Collecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.qrBtn}
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
      <Text style={styles.header}>📋 Déclarations</Text>
      <Text style={styles.subHeader}>Gestion des collectes</Text>

      {/* SEARCH */}
      <TextInput
        placeholder="Search user..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* FILTERS */}
      <View style={styles.filters}>
        {["Tous", "Bon", "Écrasé", "Endommagé"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterActive]}
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
        <ActivityIndicator color="#4CAF50" size="large" />
      ) : filteredData.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={40} color="#64748b" />
          <Text style={styles.emptyText}>Aucune donnée trouvée</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* NAV */}
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
          <Ionicons name="list-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Déclaration</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/collections_list")}>
          <Ionicons name="list-outline" size={22} color="#8E949A" />
          <Text style={[styles.navText]}>Collection</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    padding: 15,
  },

  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  subHeader: {
    color: "#94a3b8",
    marginBottom: 10,
  },

  search: {
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 10,
  },

  filters: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#111827",
  },

  filterActive: {
    backgroundColor: "#4CAF50",
  },

  card: {
    width: "48%",
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  title: {
    color: "#fff",
    fontWeight: "bold",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "bold",
  },

  text: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  collectBtn: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#2563EB",
    padding: 6,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    justifyContent: "center",
  },

  qrBtn: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  empty: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    color: "#64748b",
    marginTop: 10,
  },

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
