import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Image, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Surface } from "react-native-paper";

export default function TransferirScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  // Carregar saldo e transações
  useEffect(() => {
    const loadBalanceAndTransactions = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem("balance");
        const storedTransactions = await AsyncStorage.getItem("transactions");

        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        }
        if (storedTransactions !== null) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadBalanceAndTransactions();
  }, []);

  // Função para enviar o dinheiro
  const handleSend = async () => {
    if (!amount || !description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor válido.");
      return;
    }

    if (transferAmount > balance) {
      Alert.alert("Erro", "Você não tem saldo suficiente.");
      return;
    }

    const newBalance = balance - transferAmount;
    setBalance(newBalance);
    await AsyncStorage.setItem("balance", newBalance.toString());

    const transaction = {
      id: Date.now().toString(),
      amount: transferAmount,
      description,
      date: new Date().toLocaleDateString(),
      type: "transfer",
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setTransactionSuccess(true); // Marca como sucesso

    // Limpar os campos
    setAmount("");
    setDescription("");
  };

  if (transactionSuccess) {
    return (
      <Surface style={styles.successContainer}>
        {/* Ícone de sucesso */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
          }}
          style={styles.successIcon}
        />
        <Text style={styles.successTitle}>Transferência Realizada!</Text>
        <Text style={styles.successMessage}>Transação concluída com sucesso.</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("BankScreen")}
          style={styles.successButton}
          labelStyle={styles.successButtonText}
        >
          Voltar
        </Button>
      </Surface>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Título "Transferir Dinheiro" */}
      <Text style={styles.title}>Transferir Dinheiro</Text>

      {/* Campo de valor */}
      <TextInput
        style={styles.amountInput}
        placeholder="Digite o valor"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Campo de descrição */}
      <TextInput
        placeholder="Digite a descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.descriptionInput}
        placeholderTextColor="#ccc"
      />

      {/* Botão de envio */}
      <Button
        mode="contained"
        onPress={handleSend}
        style={styles.sendButton}
        labelStyle={styles.sendButtonText}
      >
        Transferir
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a767c6", // Cor do botão
    textAlign: "center",
    marginBottom: 20,
  },
  amountInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: "center",
  },
  descriptionInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: "center",
  },
  sendButton: {
    backgroundColor: "#a767c6", // Cor do botão
    borderRadius: 8,
    marginBottom: 30,
  },
  sendButtonText: {
    fontSize: 18,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a767c6", // Cor do botão
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  successButton: {
    backgroundColor: "#a767c6", // Cor do botão
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
  },
  successButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});