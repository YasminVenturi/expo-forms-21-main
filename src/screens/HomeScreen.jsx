import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Surface, Text, Card, IconButton } from 'react-native-paper';
import { db } from "../config/firebase";
import { query, collection, getDocs, doc, deleteDoc, orderBy } from "firebase/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  // Função para buscar eventos do Firestore
  const fetchEvents = async () => {
    try {
      // Adiciona a ordenação por timestamp
      const eventsCollection = query(collection(db, "events"), orderBy("timestamp", "desc"));
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  // Função para excluir o evento sem confirmação
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o evento.");
    }
  };

  // Função para navegar para a tela de detalhes do evento
  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', {
      event,
      additionalImages: event.additionalImages || [],
    });
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Button
          onPress={() => navigation.navigate("HomeScreen")}
          mode="text"
          style={styles.initialButton}
          labelStyle={styles.initialButtonText}
        >
          Inicial
        </Button>
        <Button
          onPress={() => navigation.navigate("PerfilScreen")}
          mode="contained"
          style={styles.profileButton}
        >
          <MaterialCommunityIcons name="account" size={24} color="#a547bf" />
        </Button>
      </View>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Eventos Imperdíveis</Text>
        </View>

        {events.length === 0 ? (
          <Text style={styles.noEventsText}>Nenhum evento disponível. Adicione novos eventos!</Text>
        ) : events.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <Card.Cover source={{ uri: event.image }} style={styles.cardImage} />
            <Card.Title
              title={event.title}
              subtitle={`Data do Evento: ${event.date}`} // Data do evento no lugar do subtítulo
              titleStyle={styles.eventTitle}
              subtitleStyle={styles.eventSubtitle}
            />
            <Card.Content>
              <Text style={styles.eventDescription}>
                {event.description.substring(0, 30)}...
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                onPress={() => handleEventPress(event)}
                mode="contained"
                contentStyle={styles.actionButtonContent}
                labelStyle={styles.actionButtonText}
                style={styles.actionButton}
              >
                Ver Detalhes
              </Button>
              <Button
                onPress={() => handleDeleteEvent(event.id)}
                mode="contained"
                contentStyle={styles.deleteButtonContent}
                labelStyle={styles.actionButtonText}
                style={styles.deleteButton}
              >
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate("EventsScreen")} mode="contained" style={styles.button}>
          <MaterialCommunityIcons name="calendar" size={24} color="#a547bf" />
        </Button>
        <Button onPress={() => navigation.navigate("HomeScreen")} mode="contained" style={styles.button}>
          <MaterialCommunityIcons name="home" size={24} color="#a547bf" />
        </Button>
        <Button onPress={() => navigation.navigate("BankScreen")} mode="contained" style={styles.button}>
          <MaterialCommunityIcons name="bank" size={24} color="#a547bf" />
        </Button>
      </View>
    </Surface>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 60, 
  },
  initialButton: {
    backgroundColor: 'transparent',
  },
  initialButtonText: {
    fontSize: 18,
    color: '#a547bf',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 5, 
  },  
  innerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 60,
  },
  subtitleContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a547bf',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    margin: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  eventCard: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 6,
    backgroundColor: '#ffffff',
    width: '95%', // Define a largura do card como 95% da tela
    alignSelf: 'center', // Centraliza o card horizontalmente
    padding: 10, // Adiciona espaço interno
  },
  cardImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 200, // Aumente a altura da imagem
    resizeMode: 'cover', // Ajusta a imagem para cobrir todo o espaço
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flex: 1,
    marginHorizontal: 5,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  
  actionButton: {
    backgroundColor: '#a547bf',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 5, // Ajusta o espaçamento interno
  },
  
  deleteButton: {
    backgroundColor: '#d0bcff', // Nova cor roxo claro
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  
  actionButtonContent: {
    height: 40,
  },
  
  deleteButtonContent: {
    height: 40,
  },
  
  actionButtonText: {
    fontSize: 12, // Diminuído de 14 para 12
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4D4D4D", // Cinza mais escuro para o título
  },
  
  eventSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6D6D6D", // Cinza mais escuro para o texto "Novo Evento"
  },  
  label: {
    fontWeight: "bold",
    color: "#555", // Cinza para diferenciar do texto principal
  },
});
