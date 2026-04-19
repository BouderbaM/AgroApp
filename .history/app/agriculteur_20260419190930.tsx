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
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // 1. جلب بيانات المزارع (الاسم واللقب)
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        // 2. جلب إحصائيات البيادق (Counts)
        const declarationsRef = collection(db, "declarations");

        // إجمالي المصرح بها
        const qTotal = query(
          declarationsRef,
          where("userId", "==", currentUser.uid),
        );
        const snapTotal = await getCountFromServer(qTotal);

        // المؤكدة فقط
        const qConfirmed = query(
          declarationsRef,
          where("userId", "==", currentUser.uid),
          where("status", "==", "confirmed"),
        );
        const snapConfirmed = await getCountFromServer(qConfirmed);

        setStats({
          declared: snapTotal.data().count,
          confirmed: snapConfirmed.data().count,
        });
      } catch (error) {
        console.error("Erreur Firebase:", error);
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
      console.error("Erreur Logout:", error);
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
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeText}>Bienvenue,</Text>
              <Text style={styles.userName}>
                {user?.prenom} {user?.nom || "Agriculteur"}
              </Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={24} color="#ff5252" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statistiques du mois</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.declared}</Text>
              <Text style={styles.statLabel}>Bidons déclarés</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.confirmed}</Text>
              <Text style={styles.statLabel}>Confirmés</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.mainActionButton}
          onPress={() => router.push("/declarations_list")}
        >
          <Text style={styles.mainActionButtonText}>
            Emballages vides à collecter
          </Text>
        </TouchableOpacity>

        {/* Sections List */}
        <Text style={styles.sectionHeader}>Déclarations</Text>
        <TouchableOpacity
          style={styles.listCard}
          onPress={() => router.push("/declarations_list")}
        >
          <View style={styles.listCardContent}>
            <View>
              <Text style={styles.listCardTitle}>
                {stats.declared > 0
                  ? `Vous avez ${stats.declared} déclarations`
                  : "Aucune déclaration"}
              </Text>
              <Text style={styles.listCardSub}>
                {stats.declared > 0
                  ? "Appuyez pour voir les détails"
                  : "Commencez par déclarer vos bidons"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Points de collecte</Text>
        <TouchableOpacity
          style={styles.listCard}
          onPress={() => router.push("/collect_points")}
        >
          <View style={styles.listCardContent}>
            <View>
              <Text style={styles.listCardTitle}>
                Points de collecte disponibles
              </Text>
              <Text style={styles.listCardSub}>
                Consultez les points près de vous
              </Text>
            </View>
            <Ionicons name="map-outline" size={20} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home-outline" size={24} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="paper-plane-outline" size={24} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>
            Agriculteur
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#8E949A" />
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 25,
  },
  brandTitle: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
  },
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  welcomeText: {
    color: "#8E949A",
    fontSize: 14,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutIcon: {
    padding: 5,
  },
  card: {
    backgroundColor: "#1A1C1E",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#26292B",
    marginBottom: 25,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 20,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#26292B",
  },
  statNumber: {
    color: "#4CAF50",
    fontSize: 32,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#8E949A",
    fontSize: 12,
    marginTop: 5,
  },
  mainActionButton: {
    backgroundColor: "#4CAF50",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#4CAF50",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mainActionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  listCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#26292B",
    marginBottom: 15,
  },
  listCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listCardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  listCardSub: {
    color: "#8E949A",
    fontSize: 13,
    marginTop: 4,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#1A1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26292B",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#8E949A",
    fontSize: 11,
    marginTop: 5,
  },
});
