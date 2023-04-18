/* eslint-disable prettier/prettier */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API_URL, TMDB_KEY, TMDB_URL} from '../Utils/api';
const {GoogleSignin} = require('@react-native-google-signin/google-signin');
import auth from '@react-native-firebase/auth';

const WEB_CLIENT_ID =
  '698219637049-d721l5562v817a89tv40q9f5n5rkmcsc.apps.googleusercontent.com';
const SCOPE = ['https://www.googleapis.com/auth/gmail.readonly'];

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

async function fetchTicketWithToken(accessToken) {
  console.log('LOADING');
  const res = await fetch(
    `${API_URL}/messages?accessToken=${accessToken}`,
  ).then(data => data.json());
  console.log('GETTING IT?');
  if (res.code === 401) {
    return res;
  }
  var ticketList = [];
  for (var i = 0; i < res.messages.length; i++) {
    // console.log(res.messages[i]);
    console.log('GOT IT???????');
    var reqParam = res.messages[i].name.toLowerCase().replaceAll(' ', '%20');
    console.log('PARAMS', reqParam);
    var url = `${TMDB_URL}api_key=${TMDB_KEY}&query=${reqParam}`;
    console.log('URLLLL', url);
    try {
      const movieData = await fetch(
        `${TMDB_URL}api_key=${TMDB_KEY}&query=${reqParam}`,
      ).then(data => data.json());

      console.log('NAMEEE', movieData.results[0].original_title);
    } catch (err) {
      console.log('ERRRRRRR', err);
    }
  }
  return res;
}

export const getTickets = createAsyncThunk(
  'user/getTickets',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState().user;
    let res = await fetchTicketWithToken(state.user.accessToken);

    if (res.code === 401) {
      console.log('YEP ', state.user);
      await GoogleSignin.clearCachedAccessToken(state.user.accessToken);
      console.log('YEP 2');
      const {accessToken} = await GoogleSignin.getTokens();
      console.log('YEP 3');
      res = await fetchTicketWithToken(accessToken);
    }

    return res;
  },
);

export const signInWithGoogle = createAsyncThunk(
  'user/signInWithGoogle',
  async thunkAPI => {
    const {idToken} = await GoogleSignin.signIn();
    console.log('IDDDD', idToken);
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log('HERE 1', googleCredential);
    // const userAv = await auth().signInWithCredential(googleCredential);
    console.log('HERE 2');
    // const {name, email, photo} = userAv.additionalUserInfo.profile;
    const {accessToken} = await GoogleSignin.getTokens();
    console.log('HERE 3');
    return {
      //   name,
      //   email,
      //   photo,
      accessToken: accessToken,
    };
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state, action) => {
      const {name, email, photo} = action.payload.user;
      state.user = {name, email, photo};
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
      });
  },
  //   extraReducers: {
  //     [getTickets.pending]: state => {
  //       state.fetchingTickets = true;
  //     },
  //     [getTickets.fulfilled]: (state, {payload}) => {
  //       state.fetchingTickets = false;
  //       state.tickets = payload;
  //     },
  //     [getTickets.rejected]: state => {
  //       state.fetchingTickets = false;
  //     },
  //     [signInWithGoogle.pending]: state => {
  //       state.fetchingToken = true;
  //     },
  //     [signInWithGoogle.fulfilled]: (state, {payload}) => {
  //       state.fetchingToken = false;
  //       state.user.accessToken = payload;
  //     },
  //     [signInWithGoogle.rejected]: state => {
  //       state.fetchingToken = false;
  //     },
  //   },
});

export const {getUser, getToken} = userSlice.actions;

// export {getTickets, signInWithGoogle};
export const userReducer = userSlice.reducer;
