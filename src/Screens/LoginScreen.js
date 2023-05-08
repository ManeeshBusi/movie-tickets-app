/* eslint-disable prettier/prettier */
//import liraries
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, Button, StatusBar, Dimensions} from 'react-native';
import {signOut} from '../Utils/api';
import {
  refreshTickets,
  signInAgain,
  signInWithGoogle,
} from '../Store/userSlice';
import FastImage from 'react-native-fast-image';
// create a component

const LoginScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {fetchingToken, user} = useSelector(state => state);
  const totalState = useSelector(state => state);

  const dispatch = useDispatch();

  const signInWithGoogleAction = () => {
    dispatch(signInWithGoogle());
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

  useEffect(() => {
    const isSignedIn = async () => {
      const isSigned = await GoogleSignin.isSignedIn();
      if (isSigned) {
        console.log('ITS LOGGED IN');
        dispatch(signInAgain());
        setIsLoggedIn(isSigned);
      }
    };
    // console.log(Object.keys(user).length);
    isSignedIn();
  }, [dispatch]);

  // useEffect(() => {
  //   console.log('TOKEN FET', fetchingToken);
  //   console.log('HERE USER', user);
  // }, [fetchingToken, user]);

  const gotonext = () => {
    navigation.navigate('Ticket');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={[StyleSheet.absoluteFill]}>
        {/* <FastImage source={require("../Assets/images/pulp.png")} style={StyleSheet.absoluteFill}/> */}
        <View style={[styles.overlay, StyleSheet.absoluteFillObject]} />
      </View>
      <GoogleSigninButton
        style={styles.signInButton}
        size={GoogleSigninButton.Size.Wide}
        onPress={signInWithGoogleAction}
        disabled={fetchingToken}
      />
      {/* {isLoggedIn && ( */}
      <>
        <Button title="See Tickets" onPress={gotonext} />
        <Button
          title="refresh tickets"
          onPress={() => dispatch(refreshTickets())}
        />
      </>
      {/* )} */}
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
    backgroundColor: '#171725',
  },
  signInButton: {
    width: 192,
    height: 48,
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.8,
  },
});

// bg 171727
// light CEB1BE
// blue 6DB1BF
// accent FFC857
// pink F39A9D
// text1 DFFDFF DFFDFF

//make this component available to the app
export default LoginScreen;
