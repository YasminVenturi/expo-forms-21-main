import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CriarCaixaScreen({ navigation }) {
  const [boxName, setBoxName] = useState('');

  const handleCreateBox = async () => {
    if (!boxName) {
      alert('Digite um nome para a caixinha.');
      return;
    }

    const storedBoxes = await AsyncStorage.getItem('boxes');
    const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];

    const newBox = { name: boxName, id: Date.now().toString() };
    boxes.push(newBox);

    await AsyncStorage.setItem('boxes', JSON.stringify(boxes));

    alert(`Caixinha ${boxName} criada com sucesso!`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Criar Caixinha</Text>

      {/* Campo de nome da caixinha */}
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da caixinha"
        placeholderTextColor="#ccc"
        value={boxName}
        onChangeText={setBoxName}
      />

      {/* Botão para criar a caixinha */}
      <TouchableOpacity onPress={handleCreateBox} style={styles.createBoxButton}>
        <Text style={styles.createBoxText}>Criar Caixinha</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a767c6',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  createBoxButton: {
    backgroundColor: '#a767c6',
    borderRadius: 8,
    marginBottom: 30,
    paddingVertical: 12,
  },
  createBoxText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
