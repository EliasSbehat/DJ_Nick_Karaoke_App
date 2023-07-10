import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';

import SignInScreen from './screens/auth/signin.screen';
import UserScreen from './user.screen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen name="SignIn" options={{ headerShown: false }} component={SignInScreen} />
            <Stack.Screen name="UserScreen" options={{ headerShown: false }} component={UserScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        
        <StatusBar />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
