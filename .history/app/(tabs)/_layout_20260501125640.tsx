import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  // 👇 هذا هو المهم
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary, // بدل tint
        tabBarInactiveTintColor: theme.tabIconDefault,

        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },

        headerStyle: {
          backgroundColor: theme.background,
        },

        headerTintColor: theme.text,

        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
