import React, { useState } from 'react';
import { Surface, Text, Button, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BoxDetailsScreen({ route, navigation }) {
  const { box } = route.params;
  const [boxAmount, setBoxAmount] = useState(box.amount);

  const handleAddMoney = async (amount) => {
    const updatedAmount = boxAmount + amount;
    setBoxAmount(updatedAmount);
    await updateBoxAmount(box.id, updatedAmount);
  };

  const handleWithdrawMoney = async (amount) => {
    const updatedAmount = boxAmount - amount;
    setBoxAmount(updatedAmount);
    await updateBoxAmount(box.id, updatedAmount);
  };

  const updateBoxAmount = async (boxId, newAmount) => {
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const boxes = JSON.parse(storedBoxes);
      const updatedBoxes = boxes.map((b) => (b.id === boxId ? { ...b, amount: newAmount } : b));
      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));
    } catch (error) {
      console.error('Erro ao atualizar a caixinha:', error);
    }
  };

  return (
    <Surface style={styles.container}>
      <Text style={styles.boxName}>{box.name}</Text>
      <Text style={styles.boxAmount}>R$ {boxAmount.toFixed(2)}</Text>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => handleAddMoney(100)} style={styles.button}>
          Adicionar R$100
        </Button>
        <Button mode="contained" onPress={() => handleWithdrawMoney(100)} style={styles.button}>
          Retirar R$100
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  boxName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  boxAmount: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#6200ee',
  },
});
