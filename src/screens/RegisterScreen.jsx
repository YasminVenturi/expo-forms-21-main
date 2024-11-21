import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator, Image, TouchableOpacity, ScrollView } from "react-native";
import { Button, Surface, Text, TextInput, Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet } from "react-native";
import { auth, db, storage } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesome } from "react-native-vector-icons";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [escola, setEscola] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para escolher uma imagem.");
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Atualiza informações no Firestore caso necessário
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: user.displayName || "",
        email: user.email,
        escola: "",
        termosAceitos: true,
        profileImage: user.photoURL || null,
        createdAt: new Date(),
      });

      navigation.navigate("HomeScreen");
    } catch (error) {
      Alert.alert("Erro de Login com Google", "Não foi possível cadastrar.");
    }
  }

  const handleRegister = async () => {
    setErrorMessage(""); // Limpa mensagens anteriores

    if (!termosAceitos) {
      setErrorMessage("Você deve aceitar os Termos & Serviços.");
      return;
    }
    if (!nome || !email || !senha || !repetirSenha || !escola) {
      setErrorMessage("Todos os campos devem ser preenchidos.");
      return;
    }
    if (senha !== repetirSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      let photoURL = null;

      // Upload da imagem para Firebase Storage
      if (profileImage) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      // Atualizar o perfil do usuário no Firebase Authentication
      await updateProfile(user, {
        displayName: nome,
        photoURL: photoURL,
      });

      // Salvar dados no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
        escola,
        termosAceitos,
        profileImage: photoURL,
        createdAt: new Date(),
      });

      setLoading(false);
      Alert.alert("Sucesso", "Registro realizado com sucesso!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      setLoading(false);
      setErrorMessage("Erro ao realizar registro. Tente novamente.");
    }
  };

  return (
    <Surface style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#A767C6" />}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Cadastrar</Text>

        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <TextInput
          placeholder="Repetir Senha"
          value={repetirSenha}
          onChangeText={setRepetirSenha}
          secureTextEntry={!showRepeatPassword}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showRepeatPassword ? "eye-off" : "eye"}
              onPress={() => setShowRepeatPassword(!showRepeatPassword)}
            />
          }
        />
        <TextInput placeholder="Escola" value={escola} onChangeText={setEscola} style={styles.input} />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Button mode="contained" onPress={pickImage} style={styles.lightPurpleButton}>
          Escolher Imagem de Perfil
        </Button>

        {profileImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: profileImage }} style={styles.imagePreview} />
          </View>
        )}

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={termosAceitos ? "checked" : "unchecked"}
            onPress={() => setTermosAceitos(!termosAceitos)}
          />
          <Text style={styles.checkboxText}>
            Sim, eu concordo com{" "}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("TermsScreen")}
            >
              Termos de Uso
            </Text>
          </Text>
        </View>

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Cadastrar
        </Button>

        <Text style={styles.socialText}>Ou cadastrar com</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <FontAwesome name="google" size={24} color="#A767C6" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
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
  lightPurpleButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#C59AE5",
  },
  linkText: {
    color: "#A767C6",
    textDecorationLine: "underline",
  },
  checkboxText: {
    marginLeft: 10,
    color: "#A767C6",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  imagePreviewContainer: {
    alignSelf: "center",
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A767C6",
    marginTop: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  socialText: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
    color: "#767676",
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
});
