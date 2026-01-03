import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import PersonnelDashboard from './PersonnelDashboard';

const Stack = createStackNavigator();

export default function PersonnelStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PersonnelDashboard" component={PersonnelDashboard} />
    </Stack.Navigator>
  );
}

