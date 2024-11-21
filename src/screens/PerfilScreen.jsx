import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Title, Paragraph, IconButton, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { getAuth } from "firebase/auth";
import { db, storage } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const PerfilScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [aboutText, setAboutText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const docRef = doc(db, "usuarios", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const userData = docSnap.data();
              setUsername(userData.nome || currentUser.displayName || "Nome de usuário");
              setEmail(userData.email || currentUser.email || "Email não disponível");
              setProfileImage(userData.profileImageUrl || null);
              setAboutText(userData.aboutText || "");
              setRecentPhotos(userData.recentPhotos || []);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      };
      loadUserData();
    }, [])
  );

  const saveUserData = async (field, value) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, "usuarios", currentUser.uid);
        await setDoc(docRef, { [field]: value }, { merge: true });
      }
    } catch (error) {
      console.error("Erro ao salvar dados no Firestore:", error);
    }
  };

  const handleAboutChange = (text) => {
    setAboutText(text);
    saveUserData("aboutText", text);
  };

  const saveAboutText = () => {
    Alert.alert("Informação salva!", "As informações do 'Sobre' foram atualizadas.");
  };

  const addRecentPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newPhotos = result.assets.map((asset) => asset.uri);
        const updatedPhotos = [...recentPhotos, ...newPhotos];

        if (updatedPhotos.length > 5) {
          updatedPhotos.splice(0, updatedPhotos.length - 5);
        }

        setRecentPhotos(updatedPhotos);
        saveUserData("recentPhotos", updatedPhotos);
      }
    } catch (error) {
      console.error("Erro ao adicionar fotos recentes:", error);
    }
  };

  const changeRecentPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const updatedPhotos = [...recentPhotos];
      updatedPhotos[selectedIndex] = result.assets[0].uri;
      setRecentPhotos(updatedPhotos);
      saveUserData("recentPhotos", updatedPhotos);
    }
  };

  const deleteRecentPhoto = async () => {
    const updatedPhotos = [...recentPhotos];
    updatedPhotos.splice(selectedIndex, 1);
    setRecentPhotos(updatedPhotos);
    saveUserData("recentPhotos", updatedPhotos);
    setIsModalVisible(false);
  };

  const openImageModal = (uri, index) => {
    setSelectedImage(uri);
    setSelectedIndex(index);
    setIsModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedIndex(null);
    setIsModalVisible(false);
  };

  const changeProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setProfileImage(selectedUri);

      const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
      const response = await fetch(selectedUri);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Erro ao fazer upload da imagem:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileImage(downloadURL);
          saveUserData("profileImageUrl", downloadURL);
        }
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => openImageModal(profileImage, null)}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image
              source={require("../../assets/img/arraia.png")}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <Title style={styles.username}>{username}</Title>
        <Paragraph style={styles.bio}>{email}</Paragraph>
      </View>

      <View style={styles.settingsButtonContainer}>
        <IconButton
          icon={() => (
            <MaterialCommunityIcons name="cog" size={24} color="#a547bf" />
          )}
          style={styles.settingsButton}
          onPress={() => navigation.navigate("ConfiguraçãoScreen")}
        />
      </View>

      <Card style={styles.infoSection}>
        <Card.Title title="Sobre" titleStyle={styles.sectionTitle} />
        <Card.Content>
          <TextInput
            style={styles.aboutInput}
            value={aboutText}
            onChangeText={handleAboutChange}
            placeholder="Escreva algo sobre você"
            multiline
          />
          <Button mode="contained" onPress={saveAboutText} style={styles.saveButton}>
            Salvar
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.gallerySection}>
        <Card.Title title="Fotos recentes" titleStyle={styles.sectionTitle} />
        <Card.Content>
          <View style={styles.gallery}>
            {recentPhotos.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => openImageModal(uri, index)}>
                <Image source={{ uri }} style={styles.galleryImage} />
              </TouchableOpacity>
            ))}
          </View>
          <Button
            mode="contained"
            onPress={addRecentPhoto}
            style={styles.addPhotoButton}
          >
            Adicionar Fotos
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("TermsScreen")}
          style={[styles.termsButton, { marginBottom: 20 }]} // Margem adicional para espaçamento
        >
          Termos
        </Button>
        <Button
          mode="contained"
          onPress={async () => {
            try {
              await auth.signOut();
              navigation.navigate("WelcomeScreen");
            } catch (error) {
              console.error("Erro ao realizar logout:", error);
            }
          }}
          style={styles.logoutButton}
        >
          Desconectar
        </Button>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
              {selectedIndex !== null && (
                <>
                  <Button
                    mode="contained"
                    onPress={changeRecentPhoto}
                    style={styles.changeProfileButton}
                  >
                    Trocar Foto
                  </Button>
                  <Button
                    mode="contained"
                    onPress={deleteRecentPhoto}
                    style={styles.deletePhotoButton}
                  >
                    Apagar Foto
                  </Button>
                </>
              )}
              {selectedIndex === null && (
                <Button
                  mode="contained"
                  onPress={changeProfileImage}
                  style={styles.changeProfileButton}
                >
                  Trocar Foto do Perfil
                </Button>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    borderRadius: 80,
    width: 160,
    height: 160,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#a547bf",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 20,
  },
  changeProfileButton: {
    backgroundColor: "#a547bf",
    borderRadius: 30,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deletePhotoButton: {
    backgroundColor: "#f44336", // Cor vermelha para exclusão
    borderRadius: 30,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoSection: {
    marginBottom: 25,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  aboutInput: {
    backgroundColor: "#f4f4f4",
    color: "#333",
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    height: 100,
  },
  saveButton: {
    backgroundColor: "#a547bf", // Cor roxa
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%", // Mesmo tamanho para manter consistência
    alignSelf: "center", // Centraliza o botão
  },
  
  gallerySection: {
    marginBottom: 25,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  gallery: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  galleryImage: {
    width: 110,
    height: 110,
    borderRadius: 15,
    margin: 5,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  settingsButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addPhotoButton: {
    backgroundColor: "#a547bf",
    marginTop: 15,
    borderRadius: 30,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fundo com opacidade para simular desfoque
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%", // Ajustando a largura para não deixar a borda branca
    padding: 0,   // Removendo qualquer preenchimento
    backgroundColor: "transparent", // Fundo transparente
    alignItems: "center",
  },
  modalImage: {
    width: "100%", // A imagem ocupa toda a largura do modal
    height: undefined, // Não fixa a altura
    aspectRatio: 1, // Mantém a proporção da imagem
    borderRadius: 15, // Borda suave
  },
  termsButton: {
    backgroundColor: "#b19cd9", // Cor lilás para o botão "Termos"
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%", // Mesma largura para ambos os botões
    alignSelf: "center", // Centraliza os botões
  },
  
  logoutButton: {
    backgroundColor: "#a547bf", // Cor roxa para o botão "Desconectar"
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%", // Mesma largura para ambos os botões
    alignSelf: "center", // Centraliza os botões
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "space-evenly", // Distribuição uniforme
  },
  termsButton: {
    backgroundColor: "#b19cd9",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%",
  },
  logoutButton: {
    backgroundColor: "#a547bf",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%",
  },
  

});

export default PerfilScreen;
