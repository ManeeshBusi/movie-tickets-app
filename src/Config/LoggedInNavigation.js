/* eslint-disable prettier/prettier */
import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TicketScreen from '../Screens/TicketsScreen';

const Stack = createNativeStackNavigator();

export default function LoggedInNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={TicketScreen} />
    </Stack.Navigator>
  );
}
