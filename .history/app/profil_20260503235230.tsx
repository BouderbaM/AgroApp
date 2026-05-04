import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  I18nManager,
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
  const [lang, setLang] = useState("fr");

  /* ================= TRANSLATE ================= */
  const t = {
    fr: {
      profile: "Profil",
      name: "Nom",
      phone: "Téléphone",
      role: "Rôle",
      settings: "Paramètres",
      notifications: "Notifications",
      version: "Version",
      logout: "Déconnexion",
      enabled: "Activées",
    },
    ar: {
      profile: "الملف الشخصي",
      name: "الاسم",
      phone: "الهاتف",
      role: "الدور",
      settings: "الإعدادات",
      notifications: "الإشعارات",
      version: "الإصدار",
      logout: "تسجيل الخروج",
      enabled: "مفعلة",
    },
  };

  /* ================= RTL ================= */
  useEffect(() => {
    I18nManager.forceRTL(lang === "ar");
  }, [lang]);

  /* ================= USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setUserData(snap.data());
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  const rtl = lang === "ar" ? { textAlign: "right" } : {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={[styles.title, rtl]}>♻️ {t[lang].profile}</Text>
        </View>

        {/* USER CARD */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, rtl]}>{t[lang].name}</Text>
            <Text style={[styles.value, rtl]}>{userData?.nom || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, rtl]}>{t[lang].phone}</Text>
            <Text style={[styles.value, rtl]}>{userData?.phone || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, rtl]}>{t[lang].role}</Text>
            <Text style={[styles.value, rtl]}>{userData?.role || "—"}</Text>
          </View>
        </View>

        {/* SETTINGS */}
        <Text style={[styles.sectionTitle, rtl]}>{t[lang].settings}</Text>

        <View style={styles.card}>
          {/* LANG */}
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, lang === "fr" && styles.langActive]}
              onPress={() => setLang("fr")}
            >
              <Text style={styles.langText}>FR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langBtn, lang === "ar" && styles.langActive]}
              onPress={() => setLang("ar")}
            >
              <Text style={styles.langText}>AR</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, rtl]}>{t[lang].notifications}</Text>
            <Text style={styles.green}>{t[lang].enabled}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, rtl]}>{t[lang].version}</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>{t[lang].logout}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔥 BOTTOM NAV (UNCHANGED) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/declarations_list")}>
          <Ionicons name="list-outline" size={22} color="#94a3b8" />
          <Text style={styles.navText}>Déclaration</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/collections_list")}>
          <Ionicons name="leaf-outline" size={22}  />
          <Text style={styles.navText}>Collection</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profil")}>
          <Ionicons name="person-outline" size={22} color="#94a3b8" />
          <Text style={[styles.navText, { color: "#2ecc71" }]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ECO ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
  },

  scroll: {
    padding: 15,
    paddingBottom: 120,
  },

  headerBox: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#0f2a1e",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  title: {
    color: "#2ecc71",
    fontSize: 24,
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#0f2a1e",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#94a3b8",
    fontSize: 13,
  },

  value: {
    color: "#fff",
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#1e3a2f",
    marginVertical: 10,
  },

  green: {
    color: "#2ecc71",
    fontWeight: "bold",
  },

  langRow: {
    flexDirection: "row",
    gap: 10,
  },

  langBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#081812",
    alignItems: "center",
  },

  langActive: {
    backgroundColor: "#2ecc71",
  },

  langText: {
    color: "#fff",
    fontWeight: "bold",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
    backgroundColor: "#081812",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1e3a2f",
  },

  navText: {
    color: "#94a3b8",
    fontSize: 11,
  },
});
