/* eslint-disable prettier/prettier */
//import liraries
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import React, {Component, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {signInWithGoogleAsync, signOut} from '../Utils/api';

// create a component
const LoginScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const signInWithGoogle = async () => {
    setIsSigning(true);
    const {tokens} = await signInWithGoogleAsync();
    setIsLoggedIn(true);
    setIsSigning(false);
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };

  const gotonext = () => {
    navigation.navigate('Ticket');
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        onPress={signInWithGoogle}
        disabled={isSigning}
      />
      {isLoggedIn && (
        <>
          <Button title="See Tickets" onPress={gotonext} />
        </>
      )}
      <Button title="Logout" onPress={signOutUser} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default LoginScreen;
