/* eslint-disable prettier/prettier */
//import liraries
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, {Component, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet, Button} from 'react-native';
import {signInWithGoogleAsync, signOut} from '../Utils/api';
import {getToken, getUser, signInWithGoogle} from '../Store/userSlice';
// create a component
const LoginScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {fetchingToken, user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  console.log('USERRR', user);
  const signInWithGoogleAction = () => {
    dispatch(signInWithGoogle());
    console.log(!user);
    setIsLoggedIn(true);
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   const isSignedIn = async () => {
  //     const isSigned = await GoogleSignin.isSignedIn();
  //     const use = await GoogleSignin.getCurrentUser();
  //     console.log('CUUU', use);
  //     // const {accessToken} = await GoogleSignin.getTokens();
  //     // dispatch(getUser(use));
  //     // dispatch(getToken(accessToken));
  //     setIsLoggedIn(isSigned);
  //   };
  //   console.log(Object.keys(user).length);
  //   isSignedIn();
  // }, []);

  // useEffect(() => {
  //   const getCurrUser = async () => {
  //     const currUser = await GoogleSignin.getCurrentUser();
  //     console.log('ALRADY TRHERE', currUser);
  //     const {accessToken} = await GoogleSignin.getTokens();
  //     dispatch(getUser(currUser));
  //     dispatch(getToken(accessToken));
  //   };
  //   if (!user) {
  //     getCurrUser();
  //     setTimeout(() => {
  //       gotonext();
  //     }, 5000);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoggedIn]);

  const gotonext = () => {
    navigation.navigate('Ticket');
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        onPress={signInWithGoogleAction}
        disabled={fetchingToken}
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
