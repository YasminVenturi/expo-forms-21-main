import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaixaDetailsScreen({ route, navigation }) {
  const { box } = route.params;
  const [amount, setAmount] = useState('');

  const handleAddToBox = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido.');
      return;
    }

    const balance = await AsyncStorage.getItem('balance');
    const updatedBalance = parseFloat(balance) - parseFloat(amount);
    await AsyncStorage.setItem('balance', updatedBalance.toString());

    const newTransaction = {
      amount: parseFloat(amount),
      type: 'subtract',
      source: 'caixa',
      date: new Date().toLocaleString(),
    };

    const storedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));

    alert(`Adicionado à caixinha: R$ ${amount}`);
    navigation.goBack();
  };

  const handleWithdrawFromBox = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido.');
      return;
    }

    const balance = await AsyncStorage.getItem('balance');
    const updatedBalance = parseFloat(balance) + parseFloat(amount);
    await AsyncStorage.setItem('balance', updatedBalance.toString());

    const newTransaction = {
      amount: parseFloat(amount),
      type: 'add',
      source: 'caixa',
      date: new Date().toLocaleString(),
    };

    const storedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));

    alert(`Retirado da caixinha: R$ ${amount}`);
    navigation.goBack();
  };

  const handleDeleteBox = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Você tem certeza de que deseja excluir a caixinha "${box.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedBoxes = await AsyncStorage.getItem('boxes');
              const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
              const updatedBoxes = boxes.filter((item) => item.id !== box.id);

              await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));
              alert(`Caixinha "${box.name}" excluída com sucesso!`);

              // Retorna à tela anterior, atualizando a lista de caixinhas
              navigation.navigate('CaixaScreen', { reload: true });
            } catch (error) {
              console.error('Erro ao excluir caixinha:', error);
              alert('Erro ao excluir a caixinha. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Caixinha: {box.name}</Text>
      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddToBox} style={[styles.actionButton, styles.addButton]}>
          <Text style={styles.actionButtonText}>Adicionar à Caixinha</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleWithdrawFromBox} style={[styles.actionButton, styles.withdrawButton]}>
          <Text style={styles.actionButtonText}>Retirar da Caixinha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ajusta os botões para ficarem afastados
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    width: '48%', // Para garantir que os botões não fiquem muito largos
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#a445bd',
  },
  withdrawButton: {
    backgroundColor: '#a445bd',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
});
