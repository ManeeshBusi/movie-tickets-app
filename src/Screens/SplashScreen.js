/* eslint-disable prettier/prettier */
import {StatusBar} from 'react-native';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import CreateRootNavigator from '../Config/RootNavigator';
import {useSelector} from 'react-redux';

export default function SplashScreen() {
  const {isLoggedIn} = useSelector(state => state);
  const RootNavigator = CreateRootNavigator(false);
  return (
    <PaperProvider>
      <>
        <StatusBar translucent backgroundColor="transparent" />
        <NavigationContainer>{RootNavigator}</NavigationContainer>
      </>
    </PaperProvider>
  );
}
