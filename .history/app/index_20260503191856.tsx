import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const IndexPage = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width > 768;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.content, { maxWidth: isTablet ? 700 : "100%" }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={[
                styles.logo,
                {
                  width: isTablet ? 200 : 140,
                  height: isTablet ? 200 : 140,
                },
              ]}
              resizeMode="contain"
            />
          </View>

          {/* FR TEXT */}
          <Text style={[styles.description, { fontSize: isTablet ? 16 : 14 }]}>
            Découvrez la première application mobile dédiée à la traçabilité et
            au recyclage des emballages vides de produits phytosanitaires en
            Algérie. PHYTOCYCLE optimise la collecte, le suivi et la
            valorisation de ces déchets, contribuant activement à la protection
            de l'environnement et à une agriculture durable.
          </Text>

          {/* AR TEXT */}
          <Text
            style={[styles.arabicdescription, { fontSize: isTablet ? 18 : 15 }]}
          >
            اكتشفوا أول تطبيق محمول مخصص لتتبع وإعادة تدوير العبوات الفارغة
            للمنتجات التابعة للصحة النباتية في الجزائر. يساهم التطبيق في تحسين
            الجمع والمتابعة وإعادة التدوير.
          </Text>

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                paddingHorizontal: isTablet ? 60 : 40,
                paddingVertical: isTablet ? 18 : 14,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push("/welcome")}
          >
            <Text style={[styles.buttonText, { fontSize: isTablet ? 18 : 16 }]}>
              Commencer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121414",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  logoContainer: {
    marginBottom: 30,
  },

  logo: {},

  description: {
    color: "#a0a0a0",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },

  arabicdescription: {
    textAlign: "right",
    writingDirection: "rtl",
    color: "#a0a0a0",
    lineHeight: 24,
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#4caf50",
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default IndexPage;
