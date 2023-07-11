/* eslint-disable prettier/prettier */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const {GoogleSignin} = require('@react-native-google-signin/google-signin');
import auth from '@react-native-firebase/auth';
import {API_URL} from '../Utils/Constants';
import axiosInstance from '../Utils/axiosInstace';

const WEB_CLIENT_ID =
  '698219637049-d721l5562v817a89tv40q9f5n5rkmcsc.apps.googleusercontent.com';
const SCOPE = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
];

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  scopes: SCOPE,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

const initialState = {
  user: {},
  tickets: [],
  fetchedMessages: false,
  isLoggedIn: false,
};

async function apiLogin(userInfo) {
  try {
    const user = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    }).then(data => data.json());
    return user;
  } catch (e) {
    console.log('ERROR LOGIN', e);
  }
}

export const refreshTickets = createAsyncThunk(
  'user/refreshTickets',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState().user;
    let res = await fetch(`${API_URL}/gmail/messages/${state.user._id}`);
    if (res.status === 200) {
      return true;
    } else {
      const {email, name, picture} = state.user;
      await GoogleSignin.clearCachedAccessToken(state.user.accessToken);
      const {accessToken} = await GoogleSignin.getTokens();
      state.user.accessToken = accessToken;
      await apiLogin({email, name, picture, accessToken});
      res = await fetch(`${API_URL}/gmail/messages/${state.user._id}`);
      if (res.code === 200) {
        return true;
      }
    }
  },
);

export const signInWithGoogle = createAsyncThunk(
  'user/signInWithGoogle',
  async (args, thunkAPI) => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const signedInUser = await auth()
        .signInWithCredential(googleCredential)
        .then(data => {
          return data.additionalUserInfo.profile;
        })
        .catch(async e => {
          await GoogleSignin.clearCachedAccessToken(idToken);
          const {idToken: idTok} = await GoogleSignin.signInSilently();
          const googleCreds = auth.GoogleAuthProvider.credential(idTok);
          const creds = await auth().signInWithCredential(googleCreds);
          return creds.additionalUserInfo.profile;
        });

      const {email, name, picture} = signedInUser;
      const {accessToken} = await GoogleSignin.getTokens();
      const userDetails = await apiLogin({email, name, picture, accessToken});

      return userDetails;
    } catch (e) {
      console.log('ERRRRR LOGGGG', e);
      return thunkAPI.rejectWithValue(e);
    }
  },
);

export const signOutGoogle = createAsyncThunk(
  'user/signOutGoogle',
  async thunkAPI => {
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      console.log('Error signing out', e);
    }
  },
);

export const signInAgain = createAsyncThunk(
  'user/signInAgain',
  async (args, thunkAPI) => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      const {name, photo: picture, email} = currentUser.user;
      const {accessToken} = await GoogleSignin.getTokens();
      const userDetails = await apiLogin({email, name, picture, accessToken});
      return userDetails;
    } catch (e) {
      throw new Error('Login Error');
      // console.log('ERRRR LOG', e);
      // return thunkAPI.rejectWithValue(e);
    }
  },
);

export const changeBackground = createAsyncThunk(
  'user/changeBackground',
  async (args, thunkAPI) => {
    try {
      const background = args;
      const {user} = thunkAPI.getState();

      const res = await fetch(`${API_URL}/auth/background/${user.user?._id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({background}),
      }).then(data => data.json());
      return {background};
    } catch (e) {
      console.log('Error adding background', e);
    }
  },
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState().user;
    try {
      const res = await axiosInstance.get(`/auth/${state.user._id}`);
      return res.data;
      // return res.data;
    } catch (e) {
      console.log('Error getting user', e);
      thunkAPI.rejectWithValue({error: e, msg: 'Error getting user'});
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(signInWithGoogle.pending, state => {
        state.fetchingToken = true;
        state.isLoggedIn = false;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.fetchingToken = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, state => {
        state.fetchingToken = false;
        state.isLoggedIn = false;
      })
      .addCase(signInAgain.pending, state => {
        state.fetchingToken = true;
      })
      .addCase(signInAgain.fulfilled, (state, action) => {
        state.fetchingToken = false;
        state.user = action.payload;
      })
      .addCase(signInAgain.rejected, state => {
        state.fetchingToken = false;
      })
      .addCase(refreshTickets.fulfilled, (state, action) => {
        state.fetchedMessages = action.payload;
      })
      .addCase(signOutGoogle.fulfilled, state => {
        return {...initialState};
      })
      .addCase(changeBackground.fulfilled, (state, action) => {
        const {background} = action.payload;
        state.user.background = background;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = {...action.payload, watchlist: null, favorite: null};
      });
  },
});

export const selectUser = state => state.user.user;

export const userReducer = userSlice.reducer;
