import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Agriculteur() {
  const router = useRouter();

  // --- States ---
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ declared: 0, confirmed: 0 });

  // --- Backend Logic ---
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // 1. جلب بيانات المستخدم (Prénom)
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();

    // 2. استرجاع عدد البيادق (Statistiques)
    // نستخدم onSnapshot لضمان جلب البيانات فور توفرها
    const declarationsRef = collection(db, "declarations");
    const q = query(declarationsRef, where("userId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.data());

        // حساب الإجمالي
        const totalDeclared = docs.length;

        // حساب المؤكدة بناءً على حالة الـ status
        const totalConfirmed = docs.filter(
          (d) => d.status === "confirmed",
        ).length;

        setStats({
          declared: totalDeclared,
          confirmed: totalConfirmed,
        });
        setLoading(false);
      },
      (error) => {
        console.error("Error in onSnapshot stats:", error);
        setLoading(false);
      },
    );

    // تنظيف الاتصال عند مغادرة الصفحة
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>EcoPhytoCycle DZ</Text>
          <Text style={styles.welcomeText}>Bienvenue,</Text>
          <Text style={styles.userName}>{user?.prenom || "Utilisateur"}</Text>
        </View>

        {/* Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statistiques du mois</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.declared}</Text>
              <Text style={styles.statLabel}>Bidons déclarés</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.confirmed}</Text>
              <Text style={styles.statLabel}>Confirmés</Text>
            </View>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.mainActionButton}
          onPress={() => router.push("/declarations_list")}
        >
          <Text style={styles.mainActionButtonText}>
            Emballages vides à collecter
          </Text>
        </TouchableOpacity>

        {/* Section: Déclarations */}
        <Text style={styles.sectionHeader}>Déclarations</Text>
        <View style={styles.listCard}>
          {stats.declared > 0 ? (
            <Text style={styles.listCardTitle}>
              Vous avez {stats.declared} déclarations
            </Text>
          ) : (
            <>
              <Text style={styles.listCardTitle}>Aucune déclaration</Text>
              <Text style={styles.listCardSub}>
                Commencez par déclarer vos bidons
              </Text>
            </>
          )}
        </View>

        {/* Section: Points de collecte */}
        <Text style={styles.sectionHeader}>Points de collecte</Text>
        <TouchableOpacity
          style={styles.listCard}
          onPress={() => router.push("/collect_points")}
        >
          <Text style={styles.listCardTitle}>
            Points de collecte disponibles
          </Text>
          <Text style={styles.listCardSub}>
            Consultez les points près de vous
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="paper-plane-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agriculteur")}
        >
          <Ionicons name="leaf" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>
            Agriculteur
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profil")}
        >
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111315" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  header: { marginBottom: 25 },
  brandTitle: { color: "#4CAF50", fontSize: 22, fontWeight: "bold" },
  welcomeText: { color: "#8E949A", fontSize: 14, marginTop: 8 },
  userName: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  card: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#26292B",
    marginBottom: 20,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 20,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statBox: { alignItems: "center" },
  statNumber: { color: "#4CAF50", fontSize: 28, fontWeight: "bold" },
  statLabel: { color: "#8E949A", fontSize: 12, marginTop: 5 },
  mainActionButton: {
    backgroundColor: "#4CAF50",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  mainActionButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  sectionHeader: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#26292B",
    marginBottom: 15,
  },
  listCardTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  listCardSub: { color: "#8E949A", fontSize: 12, marginTop: 4 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "#1A1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26292B",
    paddingBottom: Platform.OS === "ios" ? 15 : 0,
  },
  navItem: { alignItems: "center" },
  navText: { color: "#8E949A", fontSize: 11, marginTop: 4 },
});
