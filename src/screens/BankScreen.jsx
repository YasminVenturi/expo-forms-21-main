import React, { useState, useCallback } from "react";
import { Surface, Text, Button } from "react-native-paper";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { db, auth, storage } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function BankScreen({ navigation }) {
  const [balance, setBalance] = useState(1356.0);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("Usuário");
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://via.placeholder.com/50"
  );
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Função para carregar saldo do AsyncStorage
  const loadBalance = async () => {
    const storedBalance = await AsyncStorage.getItem("balance");
    if (storedBalance !== null) {
      setBalance(parseFloat(storedBalance));
    }
  };

  // Função para carregar histórico de transações
  // Função para carregar histórico de transações
const loadTransactions = async () => {
  try {
    const storedTransactions = await AsyncStorage.getItem("transactions");
    if (storedTransactions !== null) {
      const transactionsData = JSON.parse(storedTransactions);
      setTransactions(transactionsData.reverse()); // Inverte a ordem aqui
    }
  } catch (error) {
    console.error("Erro ao carregar histórico de transações:", error);
  }
};


  // Função para carregar dados do usuário autenticado no Firestore
  const loadUserData = async () => {
    if (!auth.currentUser) {
      console.error("Usuário não autenticado.");
      return;
    }

    try {
      const userDoc = doc(db, "usuarios", auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        console.warn(
          "Documento do usuário não encontrado no Firestore. Criando documento padrão..."
        );
        await setDoc(userDoc, {
          nome: auth.currentUser.displayName || "Usuário",
          email: auth.currentUser.email || "",
          profileImageUrl: "https://via.placeholder.com/50",
          createdAt: new Date(),
        });
        setUserName("Usuário");
        setProfileImageUrl("https://via.placeholder.com/50");
      } else {
        const data = userSnap.data();
        setUserName(data.nome || "Usuário");
        const imageUrl =
          data.profileImageUrl || "https://via.placeholder.com/50";
        setProfileImageUrl(imageUrl);
        console.log("Imagem de perfil carregada:", imageUrl); // Para debug
      }
    } catch (error) {
      console.error("Erro ao carregar dados do Firestore:", error);
    }
  };

  // Função para carregar dados ao iniciar a tela
  useFocusEffect(
    useCallback(() => {
      loadBalance();
      loadTransactions();
      loadUserData();
    }, [])
  );

  // Função para selecionar nova foto de perfil
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newProfileImage = result.uri;
      setProfileImageUrl(newProfileImage);

      try {
        const storageRef = ref(
          storage,
          `profileImages/${auth.currentUser.uid}`
        );
        const response = await fetch(newProfileImage);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Erro ao fazer upload da imagem:", error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(storageRef);
              const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
              await setDoc(
                userDocRef,
                {
                  profileImageUrl: downloadURL,
                },
                { merge: true }
              );
              setProfileImageUrl(downloadURL);
              console.log("Foto de perfil atualizada no Firestore");
            } catch (error) {
              console.error("Erro ao obter a URL da imagem:", error);
            }
          }
        );
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }
  };

  // Função para selecionar transações para excluir
  const toggleTransactionSelection = (transactionId) => {
    setSelectedTransactions((prevSelectedTransactions) => {
      if (prevSelectedTransactions.includes(transactionId)) {
        return prevSelectedTransactions.filter(
          (id) => id !== transactionId
        );
      } else {
        return [...prevSelectedTransactions, transactionId];
      }
    });
  };

  // Função para excluir transações selecionadas
  const deleteSelectedTransactions = async () => {
    const updatedTransactions = transactions.filter(
      (transaction) => !selectedTransactions.includes(transaction.id)
    );
    setTransactions(updatedTransactions);
    setSelectedTransactions([]);

    // Atualizar o AsyncStorage
    await AsyncStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  // Função para renderizar as transações
  const renderTransactionItem = ({ item }) => {
    const isBoxTransaction = item.source === "caixa";
    const isAddTransaction = item.type === "add" || item.type === "deposit";

    const amountColor = isBoxTransaction
      ? "#800080" // Roxo para transações de caixinha
      : isAddTransaction
      ? "#388e3c" // Verde para adições
      : "#d32f2f"; // Vermelho para transferências

    const sign = isAddTransaction ? "+" : "-";

    return (
      <TouchableOpacity
        onPress={() => toggleTransactionSelection(item.id)}
        style={[
          styles.transactionContainer,
          selectedTransactions.includes(item.id) && styles.selectedTransaction,
        ]}
      >
        <View style={styles.transactionRow}>
          <Text style={styles.transactionDate}>{item.date}</Text>
          <Text style={styles.transactionType}>
            {item.source === "caixa" ? "Caixinha" : "Pix"}
          </Text>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {sign} R$ {item.amount.toFixed(2)}
          </Text>
        </View>
        {item.description && (
          <Text style={styles.transactionDescription}>{item.description}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bem-vindo(a)</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate("RecberDinheiroScreen");
              const valorAdicionado = 50.0; // Exemplo de valor
              const descricao = "Dinheiro extra"; // Exemplo de descrição
              addMoneyToBank(valorAdicionado, descricao);
            }}
          >
            <MaterialCommunityIcons name="plus-box" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Adicionar Ganho</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("CaixaScreen")}
          >
            <MaterialCommunityIcons
              name="cash-multiple"
              size={28}
              color="#fff"
            />
            <Text style={styles.actionLabel}>Caixinhas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("TransferirScreen")}
          >
            <MaterialCommunityIcons
              name="arrow-right-bold"
              size={28}
              color="#fff"
            />
            <Text style={styles.actionLabel}>Transferência</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>
              Nenhuma transação encontrada.
            </Text>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>

        {selectedTransactions.length > 0 && (
          <Button
            mode="contained"
            color="#f44336"
            style={styles.deleteButton}
            onPress={deleteSelectedTransactions}
          >
            Apagar Transações Selecionadas
          </Button>
        )}
      </ScrollView>
    </Surface>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollViewContent: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#a767c6",
    padding: 20,
    borderRadius: 15,
  },
  welcomeText: { color: "#FFFFFF", fontSize: 14 },
  userName: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  profilePicture: { width: 50, height: 50, borderRadius: 25 },
  balanceContainer: {
    alignItems: "center",
    backgroundColor: "#EFEFF0",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  balanceLabel: { fontSize: 16, color: "#a767c6" },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a767c6",
    marginTop: 10,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    width: "30%",
    height: 80,
    backgroundColor: "#a767c6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  actionLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  transactionsContainer: { marginTop: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  transactionContainer: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1, // Sutil sombra
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  transactionDate: { fontSize: 12, color: "#666666" },
  transactionType: { fontSize: 14, fontWeight: "bold", color: "#333333" },
  transactionAmount: { fontSize: 14, fontWeight: "bold" },
  transactionDescription: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
    fontStyle: "italic",
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#a767c6",
  }
});
