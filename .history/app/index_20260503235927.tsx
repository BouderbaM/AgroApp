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
          {/* LOGO */}
          <View style={styles.logoBox}>
            <Image
              source={require("../assets/logo.png")}
              style={{
                width: isTablet ? 200 : 140,
                height: isTablet ? 200 : 140,
              }}
              resizeMode="contain"
            />
          </View>

          {/* CARD */}
          <View style={styles.card}>
            {/* FR */}
            <Text style={styles.description}>
              Découvrez la première application mobile dédiée à la traçabilité
              et au recyclage des emballages vides de produits phytosanitaires
              en Algérie. Conçue pour les agriculteurs avec l&#39;appui des
              revendeurs et fournisseurs, PHYTOCYCLE optimise la collecte, le
              suivi et la valorisation de ces déchets, contribuant activement à
              la protection de l&#39;environnement et à une agriculture durable.
              Contribuez à une agriculture durable et à une économie circulaire
              : signalez vos emballages vides, organisez la collecte et suivez
              leur recyclage ! Rejoignez la communauté pour un secteur
              phytopharmaceutique plus vert et responsable.
            </Text>

            {/* AR */}
            <Text style={styles.arabicdescription}>
              اكتشفوا أول تطبيق محمول مخصص لتتبع وإعادة تدوير العبوات الفارغة
              للمنتجات التابعة للصحة النباتية في الجزائر. ​تم تصميم تطبيق
              phytocycle للمزارعين بدعم من البائعين والموردين، وهو يعمل على
              تحسين عمليات الجمع، المتابعة، وتثمين هذه النفايات، مما يساهم بشكل
              فعال في حماية البيئة وفي زراعة مستدامة. ​ساهموا في زراعة مستدامة
              وفي اقتصاد دائري: ​بلغوا عن عبواتكم الفارغة. ​نظموا عملية الجمع.
              ​تابعوا عملية إعادة تدويرها!​انضموا إلى المجتمع من أجل قطاع صيدلة
              نباتية أكثر خضرة
            </Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => router.push("/welcome")}
          >
            <Text style={styles.buttonText}>🚀 Commencer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ================= ECO STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1f16",
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

  logoBox: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#0f2a1e",
    borderWidth: 1,
    borderColor: "#1e3a2f",
  },

  card: {
    backgroundColor: "#0f2a1e",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e3a2f",
    marginBottom: 30,
  },

  description: {
    color: "#cbd5f5",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 15,
  },

  arabicdescription: {
    textAlign: "right",
    writingDirection: "rtl",
    color: "#94a3b8",
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IndexPage;
