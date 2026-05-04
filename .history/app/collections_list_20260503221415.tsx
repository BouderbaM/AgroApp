import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
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

export default function CollectionsList() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<any>({});

  // ================= FETCH USER =================
  const getUserData = async (userId: string) => {
    if (usersMap[userId]) return;

    try {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUsersMap((prev: any) => ({
          ...prev,
          [userId]: snap.data(),
        }));
      }
    } catch (error) {
      console.log("User fetch error:", error);
    }
  };

  // ================= FETCH COLLECTIONS =================
  const fetchCollections = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) return;

      // ✅ التصحيح هنا
      const q = query(
        collection(db, "collections"),
        where("collectorUserId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);

      // تحميل بيانات المستخدمين
      list.forEach((item: any) => {
        if (item.userId) {
          getUserData(item.userId);
        }
      });
    } catch (error) {
      console.log("Firestore error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

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
  const renderItem = ({ item }: any) => {
    const user = usersMap[item.userId];

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>📦 {item.quantite} bidons</Text>

          <Text style={[styles.status, { color: getColor(item.etat) }]}>
            {item.etat}
          </Text>
        </View>

        {/* 👤 USER */}
        <Text style={styles.text}>
          👤 {user?.nom || "..."} {user?.prenom || ""}
        </Text>

        <Text style={styles.text}>
          📞 {user?.phone || "Non disponible"}
        </Text>

        {/* 📍 */}
        <Text style={styles.text}>📍 {item.point_collecte}</Text>

        {/* 📅 */}
        <Text style={styles.text}>📅 {item.date_collecte}</Text>

        {/* 💰 */}
        <Text style={styles.text}>
          💰 {Number(item.prixTotal ?? 0).toFixed(2)} DA
        </Text>

        {/* 🚛 */}
        <Text style={styles.text}>
          🚛 Collecté:{" "}
          {item.createdAt?.seconds
            ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
            : "—"}
        </Text>
      </View>
    );
  };

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🚛 Collections</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={data}
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
          <Ionicons name="paper-plane-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Déclarations</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="cube-outline" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>
            Collections
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ================= STYLE =================
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
    marginBottom: 10,
  },

  rowWrap: {
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#1A1C1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2d2f33",
    width: "48%",
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

  navText: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});
