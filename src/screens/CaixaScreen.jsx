import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Button, Text, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CaixaScreen({ navigation }) {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar as caixinhas do AsyncStorage
  const loadBoxes = async () => {
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const parsedBoxes = storedBoxes ? JSON.parse(storedBoxes) : [];
      setBoxes(parsedBoxes);
    } catch (error) {
      console.error('Erro ao carregar caixinhas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadBoxes(); // Recarrega as caixinhas quando a tela é focada
    }, [])
  );

  const formatBalance = (balance) => {
    // Se o saldo for undefined ou null, retorna 0
    if (balance === undefined || balance === null) {
      return "0.00";
    }
    return balance.toFixed(2); // Exibe o saldo com duas casas decimais
  };

  // Função para excluir uma caixinha
  const handleDeleteBox = async (boxId) => {
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];

      // Filtra a caixinha a ser excluída
      const updatedBoxes = boxes.filter((box) => box.id !== boxId);

      // Atualiza o AsyncStorage com a lista modificada
      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));

      // Atualiza o estado local
      setBoxes(updatedBoxes);
    } catch (error) {
      console.error('Erro ao excluir caixinha:', error);
    }
  };

  // Função para atualizar o saldo de uma caixinha
  const updateBoxBalance = async (boxId, newBalance) => {
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];

      // Encontra a caixinha a ser atualizada
      const updatedBoxes = boxes.map((box) => {
        if (box.id === boxId) {
          box.balance = newBalance;
        }
        return box;
      });

      // Atualiza o AsyncStorage com os novos saldos
      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));

      // Atualiza o estado local
      setBoxes(updatedBoxes);
    } catch (error) {
      console.error('Erro ao atualizar o saldo da caixinha:', error);
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {boxes.length === 0 ? (
          <Text style={styles.noBoxesText}>Nenhuma caixinha encontrada. Adicione novas caixinhas!</Text>
        ) : (
          boxes.map((box) => (
            <Card key={box.id} style={styles.card}>
              <Card.Title
                title={box.name}
                subtitle={`Saldo: R$ ${formatBalance(box.balance)}`}
                titleStyle={styles.cardTitle}
                subtitleStyle={styles.cardSubtitle}
              />
              <Card.Actions style={styles.cardActions}>
                <Button
                  onPress={() => navigation.navigate('CaixaDetailsScreen', { box, updateBoxBalance })}
                  mode="contained"
                  style={styles.detailsButton}
                  labelStyle={styles.buttonText}
                >
                  Ver Detalhes
                </Button>
                <Button
                  onPress={() => handleDeleteBox(box.id)}
                  mode="contained"
                  style={styles.deleteButton}
                  labelStyle={styles.buttonText}
                >
                  Excluir
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Botão para criar uma nova caixinha */}
      <Button
        onPress={() => navigation.navigate('CriarCaixaScreen')}
        mode="contained"
        style={styles.createBoxButton}
        labelStyle={styles.createBoxText}
      >
        + Criar Nova Caixinha
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    paddingBottom: 80,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  noBoxesText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#a547bf',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#d0bcff',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 12,
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  createBoxButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#a547bf',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
  },
  createBoxText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
