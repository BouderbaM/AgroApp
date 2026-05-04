return (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.logoText}>PhytoCycle</Text>
          <Text style={styles.subtitle}>Créer un compte 🌱</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* ROLE */}
          <SelectBox
            label="Rôle *"
            value={roles.find((r) => r.value === form.role)?.label}
            placeholder="Sélectionnez un rôle"
            onPress={() => setShowRole(true)}
          />

          {/* RAISON SOCIALE */}
          <Text style={styles.label}>Raison sociale</Text>
          <TextInput
            style={styles.input}
            placeholder="Optionnel"
            placeholderTextColor="#6b7280"
            value={form.raisonSociale}
            onChangeText={(text) => setForm({ ...form, raisonSociale: text })}
          />

          {/* PRENOM */}
          <Text style={styles.label}>Prénom *</Text>
          <TextInput
            style={styles.input}
            value={form.prenom}
            onChangeText={(text) => setForm({ ...form, prenom: text })}
          />

          {/* NOM */}
          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            value={form.nom}
            onChangeText={(text) => setForm({ ...form, nom: text })}
          />

          {/* PHONE */}
          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />

          {/* WILAYA */}
          <SelectBox
            label="Wilaya *"
            value={wilayas.find((w) => w.value === form.wilaya)?.label}
            placeholder="Sélectionnez une wilaya"
            onPress={() => setShowWilaya(true)}
          />

          {/* COMMUNE */}
          <Text style={styles.label}>Commune *</Text>
          <TextInput
            style={styles.input}
            value={form.commune}
            onChangeText={(text) => setForm({ ...form, commune: text })}
          />

          {/* ADRESSE */}
          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={styles.input}
            value={form.adresse}
            onChangeText={(text) => setForm({ ...form, adresse: text })}
          />

          {/* POLICY */}
          <View style={styles.policyCard}>
            <Switch value={acceptPolicy} onValueChange={setAcceptPolicy} />
            <Text style={styles.policyText}>J'accepte la politique</Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginText}>
              {loading ? "Chargement..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.link}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
return (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.logoText}>PhytoCycle</Text>
          <Text style={styles.subtitle}>Créer un compte 🌱</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* ROLE */}
          <SelectBox
            label="Rôle *"
            value={roles.find((r) => r.value === form.role)?.label}
            placeholder="Sélectionnez un rôle"
            onPress={() => setShowRole(true)}
          />

          {/* RAISON SOCIALE */}
          <Text style={styles.label}>Raison sociale</Text>
          <TextInput
            style={styles.input}
            placeholder="Optionnel"
            placeholderTextColor="#6b7280"
            value={form.raisonSociale}
            onChangeText={(text) => setForm({ ...form, raisonSociale: text })}
          />

          {/* PRENOM */}
          <Text style={styles.label}>Prénom *</Text>
          <TextInput
            style={styles.input}
            value={form.prenom}
            onChangeText={(text) => setForm({ ...form, prenom: text })}
          />

          {/* NOM */}
          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            value={form.nom}
            onChangeText={(text) => setForm({ ...form, nom: text })}
          />

          {/* PHONE */}
          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />

          {/* WILAYA */}
          <SelectBox
            label="Wilaya *"
            value={wilayas.find((w) => w.value === form.wilaya)?.label}
            placeholder="Sélectionnez une wilaya"
            onPress={() => setShowWilaya(true)}
          />

          {/* COMMUNE */}
          <Text style={styles.label}>Commune *</Text>
          <TextInput
            style={styles.input}
            value={form.commune}
            onChangeText={(text) => setForm({ ...form, commune: text })}
          />

          {/* ADRESSE */}
          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={styles.input}
            value={form.adresse}
            onChangeText={(text) => setForm({ ...form, adresse: text })}
          />

          {/* POLICY */}
          <View style={styles.policyCard}>
            <Switch value={acceptPolicy} onValueChange={setAcceptPolicy} />
            <Text style={styles.policyText}>J'accepte la politique</Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginText}>
              {loading ? "Chargement..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.link}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
