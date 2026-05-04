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

  // ✅ RTL CONTROL
  useEffect(() => {
    const isRTL = lang === "ar";
    I18nManager.forceRTL(isRTL);
  }, [lang]);

  // USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return setLoading(false);

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.log(error);
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
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const rtlStyle = lang === "ar" ? { textAlign: "right" } : {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TITLE */}
        <Text style={[styles.mainTitle, rtlStyle]}>{t[lang].profile}</Text>

        {/* CARD */}
        <View style={styles.infoCard}>
          {/* NAME */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, rtlStyle]}>{t[lang].name}</Text>

            <Text
              style={[
                styles.infoValue,
                rtlStyle,
                lang === "ar" && {
                  writingDirection: "rtl",
                  textAlign: "right",
                },
              ]}
            >
              {userData?.nom || "غير مسجل"}
            </Text>
          </View>

          {/* PHONE */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, rtlStyle]}>{t[lang].phone}</Text>

            <Text
              style={[
                styles.infoValue,
                lang === "ar" && {
                  textAlign: "right",
                  writingDirection: "rtl",
                },
              ]}
            >
              {userData?.phone || userData?.telephone || "غير مسجل"}
            </Text>
          </View>

          {/* ROLE */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, rtlStyle]}>{t[lang].role}</Text>

            <Text
              style={[
                styles.infoValue,
                lang === "ar" && {
                  textAlign: "right",
                  writingDirection: "rtl",
                },
              ]}
            >
              {userData?.role || "غير مسجل"}
            </Text>
          </View>
        </View>

        {/* SETTINGS */}
        <Text style={[styles.sectionTitle, rtlStyle]}>{t[lang].settings}</Text>

        <View style={styles.settingsContainer}>
          {/* LANGUAGE */}
          <View style={styles.settingBlock}>
            <Text style={[styles.settingLabel, rtlStyle]}>Langue</Text>

            <View style={styles.languageToggle}>
              <TouchableOpacity
                style={[
                  styles.langOption,
                  lang === "fr" && styles.langOptionActive,
                ]}
                onPress={() => setLang("fr")}
              >
                <Text style={styles.langTextActive}>Français</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.langOption,
                  lang === "ar" && styles.langOptionActive,
                ]}
                onPress={() => setLang("ar")}
              >
                <Text style={styles.langTextActive}>العربية</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* NOTIFICATIONS */}
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={[styles.settingLabel, rtlStyle]}>
              {t[lang].notifications}
            </Text>
            <Text style={styles.statusGreen}>{t[lang].enabled}</Text>
          </View>

          {/* VERSION */}
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={[styles.settingLabel, rtlStyle]}>
              {t[lang].version}
            </Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>{t[lang].logout}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAV */}
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

           <TouchableOpacity onPress={() => router.push("/declarations_list")}>
                  <Ionicons name="list-outline" size={22} color="#4CAF50" />
                  <Text style={[styles.navText, { color: "#4CAF50" }]}>Liste</Text>
                </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
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
    paddingBottom: 120, // 🔥 مهم حتى لا يغطيه bottom nav
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
    borderTopColor: "#26292B",
    paddingBottom: 5, // 🔥 تحسين للأجهزة
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    color: "#8E949A",
    fontSize: 11,
    marginTop: 4,
  },
});
