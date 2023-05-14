/* eslint-disable prettier/prettier */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const {GoogleSignin} = require('@react-native-google-signin/google-signin');
import auth from '@react-native-firebase/auth';
import {API_URL} from '../Utils/Constants';

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
  watchlist: [],
  favorite: [],
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

export const getTickets = createAsyncThunk(
  'user/getTickets',
  async (args, thunkAPI) => {
    const {user} = thunkAPI.getState();
    try {
      let res = await fetch(`${API_URL}/tickets/${user.user._id}`).then(data =>
        data.json(),
      );
      return res;
    } catch (e) {
      console.log('Error getting tickets', e);
    }
  },
);

export const refreshTickets = createAsyncThunk(
  'user/refreshTickets',
  async (args, thunkAPI) => {
    const {user} = thunkAPI.getState();
    console.log('REFRESH STATE', user);
    let res = await fetch(`${API_URL}/gmail/messages/${user.user._id}`);
    console.log('REFRESH CODE', res.status);
    if (res.status === 200) {
      return true;
    } else {
      console.log('YEP ', user);
      const {email, name, picture} = user;
      await GoogleSignin.clearCachedAccessToken(user.user.accessToken);
      console.log('YEP 2');
      const {accessToken} = await GoogleSignin.getTokens();
      user.user.accessToken = accessToken;
      await apiLogin({email, name, picture, accessToken});
      console.log('YEP 3');
      res = await fetch(`${API_URL}/gmail/messages/${user.user._id}`);
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

export const addNewMovie = createAsyncThunk(
  'user/addNewMovie',
  async (args, thunkAPI) => {
    try {
      const movieDetails = args;
      const {user} = thunkAPI.getState();
      console.log('ADDED MOVIE', movieDetails);
      let res = await fetch(`${API_URL}/tickets/add/${user.user?._id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieDetails),
      }).then(data => data.json());
      console.log('NEWLY ADDED', res);
      return res;
    } catch (e) {
      console.log('Error LOG', e);
    }
  },
);

export const getMovieList = createAsyncThunk(
  'user/getMovieList',
  async (args, thunkAPI) => {
    try {
      const type = args;
      const {user} = thunkAPI.getState();
      const res = await fetch(
        `${API_URL}/movies/${type}/${user.user?._id}`,
      ).then(data => data.json());
      return {type: type, list: res[type]};
    } catch (e) {
      console.log('Error list', e);
    }
  },
);

export const likeMovie = createAsyncThunk(
  'user/likeMovie',
  async (args, thunkAPI) => {
    try {
      const {type, like, movie} = args;
      const {user} = thunkAPI.getState();

      const res = await fetch(
        `${API_URL}/movies/${like}/${type}/${user.user?._id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({movieId: movie}),
        },
      ).then(data => data.json());
      console.log('MOVIE RESPONSE', res);
      return {type, like, movie: res.movie};
    } catch (e) {
      console.log('Error adding to list', e);
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
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
        // if (action.payload.length !== 0) {
        state.tickets = action.payload;
        // }
      })
      .addCase(getTickets.rejected, state => {
        state.fetchingTickets = false;
      })
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
      .addCase(addNewMovie.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      .addCase(signOutGoogle.fulfilled, state => {
        return {...initialState};
      })
      .addCase(getMovieList.fulfilled, (state, action) => {
        // state.fetchingTickets = false;
        const {type, list} = action.payload;
        state[type] = list;
      })
      .addCase(likeMovie.fulfilled, (state, action) => {
        const {type, like, movie} = action.payload;
        if (like === 'add') {
          state[type].push(movie);
        } else {
          const newArr = state[type].filter(obj => obj._id !== movie._id);
          if (type === 'favorite') {
            return {...state, favorite: newArr};
          } else {
            return {...state, watchlist: newArr};
          }
        }
      })
      .addCase(changeBackground.fulfilled, (state, action) => {
        const {background} = action.payload;
        state.user.background = background;
      });
  },
});

export const {getUser, getToken, setUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
