/* eslint-disable prettier/prettier */
import {StatusBar} from 'react-native';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import CreateRootNavigator from '../Config/RootNavigator';
import {useSelector} from 'react-redux';
import {theme} from '../Utils/Theme';
import Toast from 'react-native-toast-message';

export default function SplashScreen() {
  const states = useSelector(state => state.user);
  const RootNavigator = CreateRootNavigator(states.isLoggedIn);
  return (
    <PaperProvider theme={theme}>
      <>
        <StatusBar translucent backgroundColor="transparent" />
        <NavigationContainer>{RootNavigator}</NavigationContainer>
        <Toast />
      </>
    </PaperProvider>
  );
}
