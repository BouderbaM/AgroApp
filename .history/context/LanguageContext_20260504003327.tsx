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

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
