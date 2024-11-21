import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, TextInput, Alert, Text } from "react-native";
import { Button, Surface } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../config/firebase"; // Ajuste o caminho conforme necessário
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EventsScreen({ navigation }) {
  const [eventName, setEventName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState([]);
  const [eventDate, setEventDate] = useState(""); // Campo para a data do evento

  // Função para selecionar imagem de capa
  const pickCoverImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão para acessar a galeria é necessária!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  // Função para selecionar imagens adicionais
  const pickGalleryImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão para acessar a galeria é necessária!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setGallery([...gallery, result.assets[0].uri]);
  };

  // Função para upload de imagem
  const uploadImage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  // Função para formatar a data automaticamente
  const formatDate = (text) => {
    const cleaned = text.replace(/\D/g, ""); // Remove tudo que não for número
    let formattedDate = cleaned;

    if (cleaned.length > 2 && cleaned.length <= 4) {
      formattedDate = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formattedDate = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }

    setEventDate(formattedDate);
  };

  // Função para criar o evento
  const handleSubmit = async () => {
    if (!eventName.trim() || !coverImage || !description.trim() || !eventDate.trim()) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    // Validação do formato da data
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(eventDate)) {
      Alert.alert("Erro", "Insira a data no formato correto.");
      return;
    }

    try {
      const coverImageUrl = await uploadImage(coverImage, `events/${eventName}/coverImage`);

      // Upload das imagens adicionais
      const galleryUrls = await Promise.all(
        gallery.map((uri, index) => uploadImage(uri, `events/${eventName}/gallery/${index}`))
      );

      // Dados do evento
      // Dentro da função handleSubmit da EventsScreen:
      const newEvent = {
        title: eventName,
        subtitle: "Novo Evento",
        image: coverImageUrl,
        date: eventDate,
        description,
        icon: "party-popper",
        additionalImages: galleryUrls,
        timestamp: new Date(), // Adiciona o timestamp para ordenação
      };
      // Adiciona ao Firestore
      await addDoc(collection(db, "events"), newEvent);
      Alert.alert("Sucesso", "Evento criado com sucesso!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Erro ao salvar o evento no Firestore:", error);
      Alert.alert("Erro", "Não foi possível salvar o evento.");
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Button mode="contained" onPress={pickCoverImage} style={styles.imageButton}>
          <Text style={{ color: "#fff" }}>Selecionar Imagem de Capa</Text>
        </Button>
        <View style={styles.coverImageContainer}>
          {coverImage && <Image source={{ uri: coverImage }} style={styles.coverImage} />}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nome do Evento"
          value={eventName}
          onChangeText={setEventName}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Descrição do Evento"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Data do Evento:</Text>
          <TextInput
            style={styles.inputDate}
            placeholder="DD/MM/AAAA"
            value={eventDate}
            onChangeText={formatDate}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        <Button mode="contained" onPress={pickGalleryImage} style={styles.galleryButton}>
          Adicionar Fotos à Galeria
        </Button>
        <View style={styles.galleryContainer}>
          {gallery.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.galleryImage} />
          ))}
        </View>
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Criar Evento
        </Button>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#A767C6",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F4F4F8",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    color: "#333333",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },
  inputDate: {
    flex: 1,
    backgroundColor: "#F4F4F8",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    color: "#333333",
  },
  imageButton: {
    backgroundColor: "#A767C6",
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    alignItems: "center",
  },
  coverImageContainer: {
    backgroundColor: "#EADCF3",
    borderRadius: 10,
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  galleryButton: {
    backgroundColor: "#C1A4D4",
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  submitButton: {
    backgroundColor: "#A767C6",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
});
