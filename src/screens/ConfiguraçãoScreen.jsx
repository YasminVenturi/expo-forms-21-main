import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Alert, Text, View } from "react-native";
import { Button, TextInput, Title, Card, Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { getAuth, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#000000",
    placeholder: "#666666",
    primary: "#a547bf",
    background: "#f8f8f8",
  },
};

const ConfiguraçãoScreen = ({ navigation }) => {
  const auth = getAuth();
  const [username, setUsername] = useState(auth.currentUser?.displayName || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveProfile = async () => {
    setErrorMessage("");

    if (!password.trim()) {
      setErrorMessage("Você precisa informar sua senha atual para alterar o nome.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updateProfile(auth.currentUser, { displayName: username });

      const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
      await setDoc(userDocRef, { nome: username }, { merge: true });

      setUsername(auth.currentUser.displayName); // Atualiza o estado local
      Alert.alert("Sucesso", "Seu nome foi atualizado com sucesso!");
      navigation.navigate("PerfilScreen", { updatedUsername: username });
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error.message);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Senha incorreta. Por favor, tente novamente.");
      } else {
        setErrorMessage("Ocorreu um erro ao atualizar o perfil.");
      }
    }
  };

  useEffect(() => {
    return () => setErrorMessage(""); // Reset ao sair da tela
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Atualizar Nome</Title>
          <TextInput
            label="Nome"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            label="Senha Atual"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <Button mode="contained" style={styles.buttonPrimary} onPress={handleSaveProfile}>
            Salvar Nome
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#a547bf",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  buttonPrimary: {
    backgroundColor: "#a547bf",
    marginTop: 10,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ConfiguraçãoScreen;
