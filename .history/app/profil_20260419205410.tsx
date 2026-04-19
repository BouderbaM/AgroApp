import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
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
        {/* Header Section */}
        <Text style={styles.mainTitle}>Profil</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom</Text>
            {/* نستخدم || "—" لكي يظهر خط في حال كان الحقل فارغاً في قاعدة البيانات */}
            <Text style={styles.infoValue}>{userData?.nom || "غير مسجل"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>
              {userData?.phone || userData?.telephone || "غير مسجل"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rôle</Text>
            <Text style={styles.infoValue}>{userData?.role || "غير مسجل"}</Text>
          </View>
        </View>
        {/* Parameters Section */}
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <View style={styles.settingsContainer}>
          {/* Language Selection */}
          <View style={styles.settingBlock}>
            <Text style={styles.settingLabel}>Langue</Text>
            <View style={styles.languageToggle}>
              <TouchableOpacity
                style={[styles.langOption, styles.langOptionActive]}
              >
                <Text style={styles.langTextActive}>Français</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langOption}>
                <Text style={styles.langTextInactive}>العربية</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications Row */}
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.statusGreen}>Activées</Text>
          </View>

          {/* Version Row */}
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: "#111315", // اللون الخلفي الداكن جداً كما في الصورة
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50", // الأخضر الفاتح للعنوان الرئيسي
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 25,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#1A1C1E", // لون البطاقة الداكن
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: "#26292B",
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    color: "#8E949A", // الرمادي للنصوص الوصفية
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  settingsContainer: {
    backgroundColor: "#1A1C1E",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#26292B",
  },
  settingBlock: {
    marginBottom: 10,
  },
  settingLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  languageToggle: {
    flexDirection: "row",
    backgroundColor: "#0D0F10",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#2D3135",
  },
  langOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  langOptionActive: {
    backgroundColor: "#4CAF50",
  },
  langTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  langTextInactive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  statusGreen: {
    color: "#4CAF50",
    fontSize: 14,
  },
  versionText: {
    color: "#8E949A",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#26292B",
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: "#EF5350", // اللون الأحمر للزر
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
