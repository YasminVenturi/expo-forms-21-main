import React, { useEffect } from "react";
import { Provider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
 
  return (
    <Provider>
      <AppNavigator />
    </Provider>
  );
}
