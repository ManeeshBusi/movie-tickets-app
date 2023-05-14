/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TicketScreen from './src/Screens/TicketsScreen';
import {Provider} from 'react-redux';
import {store, persistor} from './src/Store/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as PaperProvider} from 'react-native-paper';
import OnBoardingScreen from './src/Screens/OnBoardingScreen';
import SplashScreen from './src/Screens/SplashScreen';

function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SplashScreen />
      </PersistGate>
    </Provider>
  );
}

export default App;
