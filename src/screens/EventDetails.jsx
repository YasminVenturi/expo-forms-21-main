import React, { useState } from "react";
import { Surface, Text, Button } from "react-native-paper";
import { View, StyleSheet, Image, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";

export default function EventDetailsScreen({ route, navigation }) {
  const { event, additionalImages } = route.params;
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setIsImageModalVisible(true);
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          {/* Tornar a imagem da capa clicável para abrir o modal */}
          <TouchableWithoutFeedback onPress={() => openImageModal(event.image)}>
            <Image
              source={{ uri: event.image }}
              style={styles.image}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>
            <Text style={styles.label}>Data do Evento:</Text> {event.date}
          </Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.photosContainer}>
          {additionalImages && additionalImages.length > 0 ? (
            additionalImages.map((imageUri, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => openImageModal(imageUri)}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.additionalImage}
                />
              </TouchableWithoutFeedback>
            ))
          ) : (
            <Text style={styles.noImagesText}>Nenhuma imagem adicional disponível.</Text>
          )}
        </View>

        <Button
          onPress={() => navigation.goBack()}
          mode="contained"
          style={styles.button}
        >
          Voltar
        </Button>
      </ScrollView>

      {/* Modal para exibir a imagem ampliada */}
      <Modal
        transparent={true}
        visible={isImageModalVisible}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  scrollViewContent: {
    paddingBottom: 100, // Adiciona um pouco de espaço no final do ScrollView
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4D4D4D", // Cinza mais escuro para o título
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  photosContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  additionalImage: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImagesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  button: {
    marginTop: 16,
    borderRadius: 30,
    backgroundColor: '#A767C6',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",  // Fundo escurecido
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#555", // Cinza para diferenciar do texto principal
  },
});
