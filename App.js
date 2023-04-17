/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import TicketScreen from './src/Screens/TicketsScreen';

function App() {
  const Stack = createNativeStackNavigator();
  // const signInWithGoogleAsync = async () => {
  //   // await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  //   // Get the users ID token
  //   const {idToken} = await GoogleSignin.signIn();

  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //   // Sign-in the user with the credential
  //   const user_sign_in = auth().signInWithCredential(googleCredential);

  //   user_sign_in
  //     .then(user => {
  //       console.log(user);
  //       GoogleSignin.getTokens().then(toks => {
  //         console.log(toks);
  //         fetch(`${API_URL}/messages?accessToken=${toks.accessToken}`).then(
  //           data => {
  //             data.json().then(mess => {
  //               console.log(mess);
  //             });
  //           },
  //         );
  //         // fetch(`${API_URL}/test`, {
  //         //   method: 'POST',
  //         //   // mode: 'cors',
  //         //   // credentials: 'same-origin',
  //         //   headers: {'Content-Type': 'application/json'},
  //         //   body: JSON.stringify({tokens: toks.accessToken}),
  //         // }).then(result => {
  //         //   console.log(result.json());
  //         // });
  //       });
  //     })
  //     .catch(err => {
  //       console.log('ERROR', err);
  //     });
  // };

  // useEffect(() => {
  //   const isSignedIn = async () => {
  //     const isSigned = await GoogleSignin.isSignedIn();
  //     setIsLogin(isSigned);
  //   };
  //   isSignedIn();
  // }, [isLogin]);

  // const signOut = async () => {
  //   try {
  //     await GoogleSignin.signOut();
  //     setIsLogin(false);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
