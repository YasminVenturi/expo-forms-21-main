import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../config/styles';

export default function WelcomeScreen({ navigation }) {
 const scaleValue = useRef(new Animated.Value(1)).current;

 useEffect(() => {
  
  const animateImage = () => {
   Animated.sequence([
    Animated.timing(scaleValue, {
     toValue: 1.2, 
     duration: 2500, 
     useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
     toValue: 1, 
     duration: 2500, 
     useNativeDriver: true,
    }),
   ]).start(() => animateImage()); 
  };

  animateImage(); 
 }, [scaleValue]);

 return (
  <View style={styles.background}>
   <Text style={styles.welcomeTitle}>Vamos começar!</Text>
   <Animated.Image
    source={require("../../assets/img/logo1.png")}
    style={[styles.centerImage, { transform: [{ scale: scaleValue }] }]} // Aplica a animação na imagem
   />
   <Button
    mode="contained"
    onPress={() => navigation.navigate("RegisterScreen")}
    style={styles.primaryButton}
    labelStyle={styles.buttonText}
   >
    Cadastrar
   </Button>
   <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
    <Text style={styles.linkButton}>Já tem conta? Logue-se</Text>
   </TouchableOpacity>
  </View>
 );
}
