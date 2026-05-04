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