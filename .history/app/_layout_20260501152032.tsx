import { Stack } from "expo-router";
import { LangProvider } from "../constants/lang";

export default function Layout() {
  return (
    <LangProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LangProvider>
  );
}
