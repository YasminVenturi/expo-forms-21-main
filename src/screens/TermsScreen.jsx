import React from "react";
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function TermsScreen({ navigation }) {

  const handleContinuar = () => {
    // Navega para a tela "PerfilScreen"
    navigation.navigate("PerfilScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Termos de Uso</Text>
        <ScrollView style={styles.termsScroll}>
          <Text style={styles.termsText}>
            Ao usar este aplicativo, você concorda com os seguintes termos:
          </Text>

          <Text style={styles.termsText}>
            1. Aceitação dos Termos{"\n"}
            Ao utilizar o aplicativo, você concorda com os termos e condições aqui descritos. Caso
            não concorde com algum destes termos, por favor, não utilize o aplicativo.{"\n\n"}
            2. Funções do Aplicativo{"\n"}
            O aplicativo permite que o usuário crie uma conta, faça login, adicione ou retire fundos,
            e crie eventos associados à formatura, como "dia D" ou festas.{"\n\n"}
            3. Cadastro e Conta{"\n"}
            O usuário é responsável por fornecer informações precisas durante o cadastro. Qualquer
            uso indevido da conta é de responsabilidade do usuário.{"\n\n"}
            4. Uso dos Fundos{"\n"}
            O aplicativo permite o registro de entradas e saídas financeiras. Todas as transações
            são controladas pelo usuário e o aplicativo não realiza transferências automáticas de
            dinheiro.{"\n\n"}
            5. Alterações nos Termos{"\n"}
            Reservamo-nos o direito de alterar os termos a qualquer momento, com aviso prévio de 30
            dias. A continuidade do uso do aplicativo após essas mudanças implica aceitação das
            novas condições.
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinuar}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a767c6",
    padding: 20,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#a767c6",
  },
  termsScroll: {
    maxHeight: 300,
    marginBottom: 15,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: "#4a4a4a",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#a767c6",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
