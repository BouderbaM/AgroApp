import { Platform } from "react-native";

/* 🎨 COLORS */
export const Colors = {
  light: {
    background: "#F5F5F5", // gris clair
    card: "#FFFFFF", // cards
    primary: "#4CAF50", // vert
    text: "#1A1A1A", // noir
    subText: "#6B7280", // gris
    border: "#E5E7EB", // border léger
    icon: "#6B7280",

    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",

    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#4CAF50",
  },

  dark: {
    background: "#121414",
    card: "#1C1E21",
    primary: "#4CAF50",
    text: "#FFFFFF",
    subText: "#9CA3AF",
    border: "#2D3035",
    icon: "#9CA3AF",

    success: "#22C55E",
    warning: "#FACC15",
    danger: "#F87171",

    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#4CAF50",
  },
};

/* 🔤 FONTS */
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    serif: "Georgia, Times New Roman, serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
});
