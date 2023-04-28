/* eslint-disable prettier/prettier */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API_URL} from '../Utils/api';
const {GoogleSignin} = require('@react-native-google-signin/google-signin');
import auth from '@react-native-firebase/auth';
import ImageColors from 'react-native-image-colors';
import {poster_path, rgbConverter} from '../Utils/Constants';
// import {colorcolor} from 'colorcolor';

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
  fetchingTickets: false,
  fetchingToken: false,
};

async function apiLogin(userInfo) {
  try {
    await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    }).then(data => data.json());
  } catch (e) {
    console.log('ERROR LOGIN', e);
  }
}

async function fetchTicketWithToken() {
  var res = await fetch(`${API_URL}/messages`).then(data => data.json());

  if (res.code === 401) {
    return res;
  }
  // for (var i = 0; i < res.messages.length; i++) {
  //   console.log('MOVIE DOM COLOR', res.messages[i].domColor);
  //   console.log(
  //     `CHANGFED COLOR rgba(${res.messages[i].domColor[0]}, ${res.messages[i].domColor[1]}, ${res.messages[i].domColor[2]}, 0.96)`,
  //   );
  //   const result = await ImageColors.getColors(
  //     poster_path + res.messages[i].img,
  //   );
  //   res.messages[i].color = rgbConverter(result.darkVibrant);
  //   // res.messages[i].color = 'rgba(51, 51, 51, 0.96)';
  // }
  return res.messages;
}

export const getTickets = createAsyncThunk(
  'user/getTickets',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState().user;

    let res = await fetchTicketWithToken();
    if (res.code == 401) {
      console.log('YEP ', state.user);
      await GoogleSignin.clearCachedAccessToken(state.user.accessToken);
      console.log('YEP 2');
      const {accessToken} = await GoogleSignin.getTokens();
      state.user.accessToken = accessToken;
      await apiLogin({accessToken});
      console.log('YEP 3');
      res = await fetchTicketWithToken();
    }
    return res;
  },
);

export const signInWithGoogle = createAsyncThunk(
  'user/signInWithGoogle',
  async thunkAPI => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userAv = await auth()
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
      // console.log('HERE 2');
      // const {name, email, photo} = userAv.additionalUserInfo.profile;
      const {email, name, picture} = userAv;
      const {accessToken} = await GoogleSignin.getTokens();
      // console.log('HERE 3');
      await apiLogin({email, name, picture, accessToken});
      // console.log('HERE 4');
      return {
        name,
        email,
        picture,
        accessToken,
      };
    } catch (e) {
      console.log('ERRRRR LOGGGG', e);
    }
  },
);

export const signInAgain = createAsyncThunk(
  'user/signInAgain',
  async thunkAPI => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      const {name, photo: picture, email} = currentUser.user;
      const {accessToken} = await GoogleSignin.getTokens();

      await apiLogin({email, name, picture, accessToken});

      return {name, email, picture, accessToken};
    } catch (e) {
      console.log('ERRRR LOG', e);
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log('ACT', action.payload);
      state.user = action.payload;
    },
    getToken: (state, action) => {
      state.user.accessToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getTickets.pending, state => {
        state.fetchingTickets = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.fetchingTickets = false;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, state => {
        state.fetchingTickets = false;
      })
      .addCase(signInWithGoogle.pending, state => {
        state.fetchingToken = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.fetchingToken = false;
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, state => {
        state.fetchingToken = false;
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
      });
  },
});

export const {getUser, getToken, setUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
