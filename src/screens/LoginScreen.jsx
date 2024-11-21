import React, { useState } from "react";
import { View, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesome } from "react-native-vector-icons";
import { auth } from "../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Controle da visibilidade da senha
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Para exibir mensagens de erro

  async function realizaLogin() {
    setErrorMessage(""); // Limpa mensagens anteriores

    if (!email.trim() || !senha.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setLoading(false);
      navigation.navigate("HomeScreen");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrorMessage("Credenciais incorretas. Verifique seu email e senha.");
      } else {
        setErrorMessage("Senha incorreta. Por favor, tente novamente.");
      }
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigation.navigate("HomeScreen");
    } catch (error) {
      Alert.alert("Erro de Login com Google", "Não foi possível logar.");
    }
  }

  return (
    <Surface style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#A767C6" />}
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword} // Alterna visibilidade da senha
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"} // Ícone do "olhinho"
              onPress={() => setShowPassword(!showPassword)} // Alterna visibilidade
              style={styles.eyeIcon}
            />
          }
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Button mode="contained" onPress={realizaLogin} style={styles.button}>
          Logar
        </Button>

        <Text style={styles.socialText}>Ou entre com</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <FontAwesome name="google" size={24} color="#A767C6" />
          </TouchableOpacity>
        </View>

        <Text style={styles.registerText}>
          Não tem uma conta?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            Cadastre-se
          </Text>
        </Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A767C6",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#A767C6",
  },
  socialText: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
    color: "#555",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
  },
  registerText: {
    textAlign: "center",
    marginTop: 15,
    color: "#555",
  },
  linkText: {
    color: "#A767C6",
    textDecorationLine: "underline",
  },
  eyeIcon: {
    tintColor: "#666666", // Cor do ícone
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});
