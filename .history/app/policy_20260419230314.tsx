import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

export default function PolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Politique de Confidentialité</Text>

        <Text style={styles.text}>
          Bienvenue dans PhytoCycle. Nous respectons votre vie privée et nous
          nous engageons à protéger vos données personnelles.
        </Text>

        <Text style={styles.sectionTitle}>1. Collecte des données</Text>
        <Text style={styles.text}>
          Nous collectons les informations suivantes : nom, prénom, email,
          téléphone et wilaya afin de fournir nos services.
        </Text>

        <Text style={styles.sectionTitle}>2. Utilisation des données</Text>
        <Text style={styles.text}>
          Vos données sont utilisées uniquement pour la gestion des comptes et
          des services agricoles.
        </Text>

        <Text style={styles.sectionTitle}>3. Sécurité</Text>
        <Text style={styles.text}>
          Nous protégeons vos données avec des systèmes sécurisés et Firebase
          Authentication.
        </Text>

        <Text style={styles.sectionTitle}>4. Partage</Text>
        <Text style={styles.text}>
          Nous ne partageons jamais vos données avec des tiers sans votre
          consentement.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.text}>
          Pour toute question, contactez-nous via l'application PhytoCycle.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111315",
  },
  content: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },

  sectionTitle: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },

  text: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },

  button: {
    backgroundColor: "#3E7B41",
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
