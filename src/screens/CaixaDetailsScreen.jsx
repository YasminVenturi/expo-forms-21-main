import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Surface } from 'react-native-paper';

export default function CaixaDetailsScreen({ route, navigation }) {
  const { box } = route.params; // Pega a caixinha que foi passada
  const [amount, setAmount] = useState('');

  // Função para adicionar valor à caixinha
  const handleAddToBox = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido.');
      return;
    }

    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];

      const updatedBoxes = boxes.map((item) => {
        if (item.id === box.id) {
          item.balance = (item.balance || 0) + parseFloat(amount);
        }
        return item;
      });

      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));

      alert(`Adicionado à caixinha: R$ ${amount}`);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar à caixinha:', error);
      alert('Erro ao adicionar à caixinha. Tente novamente.');
    }
  };

  // Função para retirar valor da caixinha
  const handleWithdrawFromBox = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido.');
      return;
    }

    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];

      const updatedBoxes = boxes.map((item) => {
        if (item.id === box.id) {
          item.balance = (item.balance || 0) - parseFloat(amount);
        }
        return item;
      });

      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));

      alert(`Retirado da caixinha: R$ ${amount}`);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao retirar da caixinha:', error);
      alert('Erro ao retirar da caixinha. Tente novamente.');
    }
  };

  return (
    <Surface style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={box.name}
          subtitle={`Saldo Atual: R$ ${box.balance || 0}`}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content>
          <Text style={styles.label}>Digite um valor:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="  "
          />
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <TouchableOpacity onPress={handleAddToBox} style={[styles.actionButton, styles.addButton]}>
            <Text style={styles.actionButtonText}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWithdrawFromBox} style={[styles.actionButton, styles.withdrawButton]}>
            <Text style={styles.actionButtonText}>Retirar</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#a547bf',
  },
  withdrawButton: {
    backgroundColor: '#d0bcff',
  },
});
