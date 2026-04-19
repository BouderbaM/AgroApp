import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../constants/firebaseConfig";

export default function Profil() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("Français");

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUser(snap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Box */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom</Text>
            <Text style={styles.infoValue}>
              {user?.prenom} {user?.nom || "..."}
            </Text>
          </View>
          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{user?.phone || "..."}</Text>
          </View>
          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.infoLabel}>Rôle</Text>
            <Text
              style={[
                styles.infoValue,
                { color: "#4CAF50", textTransform: "capitalize" },
              ]}
            >
              {user?.role || "..."}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Paramètres</Text>

        {/* Language Selector */}
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Langue</Text>
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                language === "Français" && styles.langBtnActive,
              ]}
              onPress={() => setLanguage("Français")}
            >
              <Text
                style={[
                  styles.langText,
                  language === "Français" && styles.langTextActive,
                ]}
              >
                Français
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langBtn,
                language === "العربية" && styles.langBtnActive,
              ]}
              onPress={() => setLanguage("العربية")}
            >
              <Text
                style={[
                  styles.langText,
                  language === "العربية" && styles.langTextActive,
                ]}
              >
                العربية
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Toggle */}
        <View style={styles.settingCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <View style={styles.row}>
              <Text
                style={[
                  styles.statusText,
                  { color: notificationsEnabled ? "#4CAF50" : "#8E949A" },
                ]}
              >
                {notificationsEnabled ? "Activées" : "Désactivées"}
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#2D3135", true: "#4CAF50" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.settingCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation (Mockup) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={20} color="#8E949A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/declarer")}
        >
          <Ionicons name="send-outline" size={20} color="#8E949A" />
          <Text style={styles.navText}>Déclarer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="leaf-outline" size={20} color="#8E949A" />
          <Text style={styles.navText}>Agriculteur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={20} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Profil</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#26292B",
    marginBottom: 25,
  },
  infoRow: {
    padding: 15,
    flexDirection: "column",
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "#26292B",
  },
  infoLabel: {
    color: "#8E949A",
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#26292B",
    padding: 15,
    marginBottom: 12,
  },
  settingLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  languageToggle: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderRadius: 8,
    marginTop: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#26292B",
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  langBtnActive: {
    backgroundColor: "#4CAF50",
  },
  langText: {
    color: "#8E949A",
    fontSize: 13,
  },
  langTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    marginRight: 10,
  },
  versionText: {
    color: "#8E949A",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#F44336", // لون أحمر للتنبيه عند تسجيل الخروج
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#1A1C1E",
    height: 70,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26292B",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: "#8E949A",
  },
});
