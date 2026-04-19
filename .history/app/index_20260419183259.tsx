import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const IndexPage = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* ضبط لون شريط الحالة العلوي ليتناسب مع الخلفية الداكنة */}
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.brandName}>EcoPhytoCycle</Text>
          <Text style={styles.countryCode}>DZ</Text>
        </View>

        {/* Description Section */}
        <Text style={styles.description}>
          Découvrez la première application mobile dédiée à la traçabilité et au
          recyclage des emballages vides de produits phytosanitaires en Algérie
        </Text>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push("/welcome")}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121414", // لون الخلفية الداكن كما في الصورة
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  brandName: {
    color: "#4caf50",
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  countryCode: {
    color: "#4caf50",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -5,
  },
  description: {
    color: "#a0a0a0",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 40,
    maxWidth: "90%",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 30, // حواف دائرية بالكامل كما في الصورة
    elevation: 3, // ظل خفيف للأندرويد
    shadowColor: "#000", // ظل للآيفون
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default IndexPage;
