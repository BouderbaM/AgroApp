import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
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
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Description Section */}
        <Text style={styles.description}>
          Découvrez la première application mobile dédiée à la traçabilité et au
          recyclage des emballages vides de produits phytosanitaires en Algérie.
          Conçue pour les agriculteurs avec l&#39;appui des revendeurs et
          fournisseurs, PHYTOCYCLE optimise la collecte, le suivi et la
          valorisation de ces déchets, contribuant activement à la protection de
          l&#39;environnement et à une agriculture durable. Contribuez à une
          agriculture durable et à une économie circulaire : signalez vos
          emballages vides, organisez la collecte et suivez leur recyclage !
          Rejoignez la communauté pour un secteur phytopharmaceutique plus vert
          et responsable.
        </Text>
        {/* Description Section */}
        <Text style={styles.arabicdescription}>
          phytocycle ​اكتشفوا أول تطبيق محمول مخصص لتتبع وإعادة تدوير العبوات
          الفارغة للمنتجات التابعة للصحة النباتية في الجزائر. ​تم تصميم تطبيق
          phytocycle للمزارعين بدعم من البائعين والموردين، وهو يعمل على تحسين
          عمليات الجمع، المتابعة، وتثمين هذه النفايات، مما يساهم بشكل فعال في
          حماية البيئة وفي زراعة مستدامة. ​ساهموا في زراعة مستدامة وفي اقتصاد
          دائري: ​بلغوا عن عبواتكم الفارغة. ​نظموا عملية الجمع. ​تابعوا عملية
          إعادة تدويرها! ​انضموا إلى المجتمع من أجل قطاع صيدلة نباتية أكثر خضرة
          ومسؤولية.
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
    backgroundColor: "#121414",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30, // مسافة بين اللوجو والنص
  },
  logo: {
    width: 150, // يمكنك تعديل العرض حسب الرغبة
    height: 150, // يمكنك تعديل الطول حسب الرغبة
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
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
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
