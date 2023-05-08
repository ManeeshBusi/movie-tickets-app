/* eslint-disable prettier/prettier */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API_URL} from '../Utils/api';
const {GoogleSignin} = require('@react-native-google-signin/google-signin');
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  fetchedMessages: false,
  isLoggedIn: false,
};

async function apiLogin(userInfo) {
  try {
    console.log('IN API LOGIN');
    const user = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    }).then(data => data.json());
    console.log('API LOGIN DONE');
    return user;
  } catch (e) {
    console.log('ERROR LOGIN', e);
  }
}

// async function fetchTicketWithToken(userId) {
//   var res = await fetch(`${API_URL}/tickets/${userId}`).then(data =>
//     data.json(),
//   );
//   // if (res.code === 401) {
//   //   return res;
//   // }

//   return res;
// }

export const getTickets = createAsyncThunk(
  'user/getTickets',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    // let res = await fetchTicketWithToken(state?.user?._id);
    try {
      let res = await fetch(`${API_URL}/tickets/${state.user._id}`).then(data =>
        data.json(),
      );
      console.log('TICKETS REDUX', res);
      return res;
    } catch (e) {
      console.log('Error getting tickets', e);
    }
  },
);

export const refreshTickets = createAsyncThunk(
  'user/refreshTickets',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('REFRESH STATE', state);
    let res = await fetch(`${API_URL}/gmail/latest/${state.user._id}`);
    console.log('REFRESH CODE', res.status);
    if (res.status == 200) {
      return true;
    } else {
      console.log('YEP ', state.user);
      const {email, name, picture} = state.user;
      await GoogleSignin.clearCachedAccessToken(state.user.accessToken);
      console.log('YEP 2');
      const {accessToken} = await GoogleSignin.getTokens();
      state.user.accessToken = accessToken;
      await apiLogin({email, name, picture, accessToken});
      console.log('YEP 3');
      res = await fetch(`${API_URL}/gmail/messages/${state.user._id}`);
      if (res.code == 200) {
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

      const {email, name, picture} = userAv;
      const {accessToken} = await GoogleSignin.getTokens();
      // console.log('HERE 3');
      const userDetails = await apiLogin({email, name, picture, accessToken});

      return userDetails;
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

      const userDetails = await apiLogin({email, name, picture, accessToken});

      return userDetails;
    } catch (e) {
      console.log('ERRRR LOG', e);
    }
  },
);

export const addNewMovie = createAsyncThunk(
  'user/addNewMovie',
  async (args, thunkAPI) => {
    try {
      const movieDetails = args;
      const state = thunkAPI.getState();
      console.log('ADDED MOVIE', movieDetails);
      let res = await fetch(`${API_URL}/tickets/add/${state.user?._id}`);
      return movieDetails;
    } catch (e) {
      console.log('Error LOG', e);
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
        if (action.payload.length !== 0) {
          state.tickets = action.payload;
        }
      })
      .addCase(getTickets.rejected, state => {
        state.fetchingTickets = false;
      })
      .addCase(signInWithGoogle.pending, state => {
        state.fetchingToken = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.fetchingToken = false;
        state.isLoggedIn = true;
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
      })
      .addCase(refreshTickets.fulfilled, (state, action) => {
        state.fetchedMessages = action.payload;
      })
      .addCase(addNewMovie.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      });
  },
});

export const {getUser, getToken, setUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
