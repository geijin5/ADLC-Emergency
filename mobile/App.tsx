import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PublicStack from './src/public/PublicStack';
import PersonnelStack from './src/personnel/PersonnelStack';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Public" component={PublicStack} />
          <Stack.Screen name="Personnel" component={PersonnelStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

