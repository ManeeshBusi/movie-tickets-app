/* eslint-disable prettier/prettier */
import {StatusBar} from 'react-native';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import CreateRootNavigator from '../Config/RootNavigator';
import {useSelector} from 'react-redux';
import {theme} from '../Utils/Theme';

export default function SplashScreen() {
  const states = useSelector(state => state.user);
  console.log('SS', states);
  const RootNavigator = CreateRootNavigator(states.isLoggedIn);
  return (
    <PaperProvider theme={theme}>
      <>
        <StatusBar translucent backgroundColor="transparent" />
        <NavigationContainer>{RootNavigator}</NavigationContainer>
      </>
    </PaperProvider>
  );
}
