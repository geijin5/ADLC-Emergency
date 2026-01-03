import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PublicDashboard from './PublicDashboard';
import PublicMap from './PublicMap';

const Stack = createStackNavigator();

export default function PublicStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PublicDashboard" component={PublicDashboard} options={{ title: 'ADLC Emergency Services' }} />
      <Stack.Screen name="PublicMap" component={PublicMap} options={{ title: 'Map' }} />
    </Stack.Navigator>
  );
}

