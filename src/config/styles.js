import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a547bf",
  },
  innerContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignItems: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "#CF9AE9",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#d9d9d9",
    width: "100%",
    color: "black",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center", // Centraliza os botões
    justifyContent: "space-between", // Adiciona espaçamento entre os elementos
  },
  termsButton: {
    backgroundColor: "#a547bf", // Cor para o botão de Termos
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15, // Pequeno espaçamento para consistência
    width: "70%", // Ajusta o tamanho do botão
  },
  logoutButton: {
    backgroundColor: "#4E0D8A", // Cor para o botão de Logout
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15, // Espaçamento superior consistente
    width: "70%", // Ajusta o tamanho do botão
  },
  
  img: {
    alignItems: "center",
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  ContainerForm: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 0,
    width: "100%",
    paddingHorizontal: 60,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  Containerlogo: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  Button: {
    color: "#FFF",
  },
  text: {
    color: "black",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 0,
  },
  centerImage: {
    width: 400, // Ajuste para o tamanho da imagem
    height: 400,
    resizeMode: "contain",
    marginBottom: 0, // Espaço entre a imagem e o botão
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 0, // Espaço entre o título e a imagem
  },
  primaryButton: {
    backgroundColor: "#A767C6",
    paddingVertical: 10,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  linkButton: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  termsText: {
    fontSize: 12,
    color: "#6C4DBE",
  },
  loginLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#4E0D8A",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a767c6", // Cor roxa para o título
  },
  inputContainer: {
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#a547bf", // Cor roxa para os botões
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
});
