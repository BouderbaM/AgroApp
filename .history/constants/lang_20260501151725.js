import { createContext, useContext, useState } from "react";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("fr");

  const t = {
    fr: {
      profile: "Profil",
      home: "Accueil",
      declarer: "Déclarer",
      list: "Liste",
      settings: "Paramètres",
      logout: "Déconnexion",
      name: "Nom",
      phone: "Téléphone",
      role: "Rôle",
      notifications: "Notifications",
      version: "Version",
      enabled: "Activées",
    },
    ar: {
      profile: "الملف الشخصي",
      home: "الرئيسية",
      declarer: "التصريح",
      list: "القائمة",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      name: "الاسم",
      phone: "الهاتف",
      role: "الدور",
      notifications: "الإشعارات",
      version: "الإصدار",
      enabled: "مفعلة",
    },
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: t[lang] }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
