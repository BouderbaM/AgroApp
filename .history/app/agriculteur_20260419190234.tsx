import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Agriculteur() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ declared: 0, confirmed: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // 1. جلب بيانات المستخدم
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        // 2. جلب الإحصائيات (البيادق المعلنة والمؤكدة)
        const declarationsRef = collection(db, "declarations");

        // استعلام الإجمالي (Declared)
        const qDeclared = query(
          declarationsRef,
          where("userId", "==", currentUser.uid),
        );
        const snapDeclared = await getCountFromServer(qDeclared);

        // استعلام المؤكدة (Confirmed)
        const qConfirmed = query(
          declarationsRef,
          where("userId", "==", currentUser.uid),
          where("status", "==", "confirmed"),
        );
        const snapConfirmed = await getCountFromServer(qConfirmed);

        setStats({
          declared: snapDeclared.data().count,
          confirmed: snapConfirmed.data().count,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header: Logo & Welcome */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>EcoPhytoCycle DZ</Text>
          <Text style={styles.welcomeText}>Bienvenue,</Text>
          <Text style={styles.userName}>{user?.prenom || "Utilisateur"}</Text>
        </View>

        {/* Statistics Card (Statistiques du mois) */}
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

        {/* Large Action Button */}
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
            <>
              <Text style={styles.listCardTitle}>
                Vous avez {stats.declared} déclarations
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/declarations_list")}
              >
                <Text style={styles.linkText}>Voir les détails</Text>
              </TouchableOpacity>
            </>
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

        {/* زر تسجيل الخروج للراحة */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
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

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="leaf" size={22} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>
            Agriculteur
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={22} color="#8E949A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (إبقاء الستايلات السابقة كما هي)
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
  linkText: {
    color: "#4CAF50",
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutButton: { marginTop: 10, alignItems: "center" },
  logoutText: { color: "#ff5252", fontSize: 14 },
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
  },
  navItem: { alignItems: "center" },
  navText: { color: "#8E949A", fontSize: 11, marginTop: 4 },
});
