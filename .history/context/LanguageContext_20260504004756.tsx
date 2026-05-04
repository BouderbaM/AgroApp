import React, { createContext, useContext, useState } from "react";
import { I18nManager } from "react-native";

/* ================= CONTEXT ================= */
const LanguageContext = createContext(null);

/* ================= PROVIDER ================= */
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("fr");

  const toggleLang = (newLang) => {
    setLang(newLang);

    const isRTL = newLang === "ar";

    I18nManager.forceRTL(isRTL);

    // ⚠️ مهم في بعض الحالات (Expo)
    // I18nManager.allowRTL(isRTL);
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
      declarerTitle: "Déclaration des bidons",
      declarerSubtitle: "Système intelligent de recyclage agricole",

      quantity: "Quantité",
      contenance: "Contenance",
      state: "État",
      collectPoint: "Point de collecte",
      date: "Date",

      chooseDate: "Choisir une date",
      gps: "Position GPS",
      confirm: "Confirmer la déclaration",

      totalEstimated: "Total estimé",
      declarationsTitle: "Déclarations",
      declarationsSubtitle: "Gestion des collectes",

      searchPlaceholder: "Rechercher un utilisateur...",

      all: "Tous",
      good: "Bon",
      crushed: "Écrasé",
      damaged: "Endommagé",

      collect: "Collecter",
      qr: "QR",

      noData: "Aucune donnée trouvée",
      collectionsTitle: "Collections",
      collectionsSubtitle:
        "Suivi intelligent du recyclage des bidons agricoles",

      collects: "Collectes",
      revenue: "Revenus",

      noPhone: "Non disponible",
      unknownName: "Nom inconnu",
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
      declarerTitle: "تصريح العبوات",
      declarerSubtitle: "نظام ذكي لإعادة التدوير الزراعي",

      quantity: "الكمية",
      contenance: "السعة",
      state: "الحالة",
      collectPoint: "نقطة الجمع",
      date: "التاريخ",

      chooseDate: "اختر التاريخ",
      gps: "الموقع الجغرافي",
      confirm: "تأكيد التصريح",

      totalEstimated: "المجموع التقريبي",
      declarationsTitle: "التصريحات",
      declarationsSubtitle: "إدارة عمليات الجمع",

      searchPlaceholder: "ابحث عن مستخدم...",

      all: "الكل",
      good: "جيد",
      crushed: "مضغوط",
      damaged: "تالف",

      collect: "جمع",
      qr: "رمز",

      noData: "لا توجد بيانات",
      collectionsTitle: "الجمع",
      collectionsSubtitle: "متابعة ذكية لإعادة تدوير العبوات الزراعية",

      collects: "العمليات",
      revenue: "الأرباح",

      noPhone: "غير متوفر",
      unknownName: "اسم غير معروف",

      home: "الرئيسية",
      declaration: "التصريحات",
      collection: "الجمع",
      profile: "الملف الشخصي",
    },
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
