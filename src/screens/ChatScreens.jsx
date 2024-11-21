
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

const botResponses = {
  "oi": "Olá! Como posso te ajudar?",
  "tudo bem?": "Estou bem, obrigado por perguntar!",
  "qual seu nome?": "Eu sou um chatbot de exemplo!",
  "default": "Desculpe, não entendi sua mensagem.",
};

const ChatScreen = ({ route }) => {
  const { userName } = route.params; 
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: inputMessage }];
    setMessages(newMessages);

    const botReply = botResponses[inputMessage.toLowerCase()] || botResponses['default'];

    setTimeout(() => {
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    }, 1000); 
    setInputMessage('');
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Digite sua mensagem..."
        />
        <Button title="Enviar" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0a5a1',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ChatScreen;
