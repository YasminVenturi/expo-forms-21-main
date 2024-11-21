import React, { useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";

export default function TermsScreen({ navigation }) {
  const [termosAceitos, setTermosAceitos] = useState(false);

  const handleAceitarTermos = () => {
    if (termosAceitos) {
      navigation.goBack();
    } else {
      Alert.alert("Atenção", "Você precisa aceitar os termos para continuar.");
    }
  };

  const openTermsScreen = () => {
    navigation.navigate("TermsScreen");
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
            novas condições.{"\n\n"}
            Política de Privacidade{"\n\n"}
            1. Coleta de Dados Pessoais{"\n"}
            Coletamos informações como nome, e-mail, e detalhes financeiros para a criação de conta
            e o uso das funcionalidades do aplicativo. Essas informações são necessárias para a
            execução dos serviços.{"\n\n"}
            2. Uso dos Dados{"\n"}
            Os dados pessoais coletados serão usados para criar e gerenciar a conta do usuário, bem
            como permitir o uso de funcionalidades como adicionar e retirar fundos e organizar
            eventos.{"\n\n"}
            3. Compartilhamento de Dados{"\n"}
            Os dados pessoais não serão compartilhados com terceiros, exceto quando exigido por
            lei.{"\n\n"}
            4. Segurança dos Dados{"\n"}
            Implementamos medidas de segurança para proteger as informações pessoais contra acesso
            não autorizado, alteração ou divulgação.{"\n\n"}
            5. Retenção de Dados{"\n"}
            Os dados pessoais serão mantidos enquanto o usuário tiver uma conta ativa no aplicativo
            ou pelo tempo necessário para cumprir obrigações legais.{"\n\n"}
            6. Direitos do Usuário (Conformidade com a LGPD){"\n"}
            De acordo com a LGPD, o usuário tem o direito de acessar, corrigir, excluir ou solicitar
            a portabilidade de seus dados pessoais. O usuário também pode revogar seu consentimento
            a qualquer momento, o que pode resultar na limitação de funcionalidades do aplicativo.{"\n\n"}
            7. Contato{"\n"}
            Para exercer seus direitos de privacidade ou para qualquer questão relativa ao
            tratamento de dados, entre em contato conosco pelo [inserir e-mail de contato].{"\n\n"}
          </Text>
        </ScrollView>

        {/* Checkbox e botão */}
        <View style={styles.termsContainer}>
          <Checkbox
            status={termosAceitos ? "checked" : "unchecked"}
            onPress={() => setTermosAceitos(!termosAceitos)}
            color="#a767c6"
          />
          <Text style={styles.termsCheckboxText}>Eu concordo com os Termos de Uso</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: termosAceitos ? "#a767c6" : "#ddd" },
          ]}
          onPress={handleAceitarTermos}
          disabled={!termosAceitos}
        >
          <Text
            style={[
              styles.buttonText,
              { color: termosAceitos ? "#ffffff" : "#aaa" },
            ]}
          >
            Aceitar e Continuar
          </Text>
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  termsCheckboxText: {
    fontSize: 16,
    color: "#4a4a4a",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
