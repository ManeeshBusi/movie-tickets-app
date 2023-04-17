/* eslint-disable prettier/prettier */
const {GoogleSignin} = require('@react-native-google-signin/google-signin');
import auth from '@react-native-firebase/auth';
const API_URL = 'http://10.0.2.2:3000';
const WEB_CLIENT_ID =
  '698219637049-d721l5562v817a89tv40q9f5n5rkmcsc.apps.googleusercontent.com';
const SCOPE = ['https://www.googleapis.com/auth/gmail.readonly'];

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  scopes: SCOPE,
  offlineAccess: true,
});

export const signInWithGoogleAsync = async () => {
  const {idToken} = await GoogleSignin.signIn();

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  await auth().signInWithCredential(googleCredential);

  const tokens = await GoogleSignin.getTokens();

  return {tokens};
};

export const getMessages = async accessToken => {
  const data = await fetch(`${API_URL}/messages?accessToken=${accessToken}`);

  const messages = await data.json();

  return messages;
};

export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.log(e);
  }
};
