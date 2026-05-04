import { createContext, useContext, useState } from "react";
import { I18nManager } from "react-native";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("fr");

  const toggleLang = (newLang: string) => {
    setLang(newLang);
    I18nManager.forceRTL(newLang === "ar");
  };

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

  // HOME
  headerTitle: "PhytoCycle",
  headerSubtitle: "Gestion intelligente des bidons agricoles",
  roleBadge: "Agriculteur",

  total: "Total",
  good: "Bon",
  crushed: "Écrasé",
  damaged: "Endommagé",

  newDeclaration: "Nouvelle Déclaration",

  aboutTitle: "À propos du système",
  aboutText:
    "Plateforme de recyclage des bidons agricoles avec suivi intelligent, traçabilité et impact environnemental.",

  declaration: "Déclaration",
  collection: "Collection",
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

  // HOME
  headerTitle: "فيتوسيكل",
  headerSubtitle: "تسيير ذكي للعبوات الزراعية",
  roleBadge: "فلاح",

  total: "الإجمالي",
  good: "جيد",
  crushed: "مضغوط",
  damaged: "تالف",

  newDeclaration: "إضافة تصريح جديد",

  aboutTitle: "حول النظام",
  aboutText:
    "منصة لإعادة تدوير العبوات الزراعية مع تتبع ذكي وتأثير بيئي إيجابي.",

  declaration: "التصريحات",
  collection: "الجمع",
},

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
