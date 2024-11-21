import { Surface, Text, Button } from "react-native-paper";
import { View } from "react-native";
import { styles } from "../config/styles";

export default function AppScreen({ navigation }) {
  return (
    <Surface style={styles.container}>
      <View style={styles.innerContainer}>
        <Text>Bem-vinda(o) à página do App</Text>
        <Text>Explore as funcionalidades do nosso aplicativo!</Text>
      </View>
      
      <Button
        onPress={() => {
          navigation.goBack();
        }}
        mode="contained"
        style={styles.button}
      >
        Voltar
      </Button>
    </Surface>
  );
}
