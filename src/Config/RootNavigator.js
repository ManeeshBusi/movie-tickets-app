/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoggedInNavigator from './LoggedInNavigation';
import LoggedOutNavigator from './LoggedOutNavigation';

const Stack = createNativeStackNavigator();

export default function CreateRootNavigator(loggedIn = false) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {loggedIn ? (
        <Stack.Screen name="LoggedIn" component={LoggedInNavigator} />
      ) : (
        <Stack.Screen name="LoggedOut" component={LoggedOutNavigator} />
      )}
    </Stack.Navigator>
  );
}
