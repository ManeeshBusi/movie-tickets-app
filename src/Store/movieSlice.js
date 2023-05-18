/* eslint-disable prettier/prettier */
import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Utils/axiosInstace';

const initialState = {
  loading: {
    tickets: false,
    list: false,
    addTicket: false,
    addMovie: false,
  },
  error: {
    tickets: null,
    list: null,
    addTicket: null,
    addMovie: null,
  },
  tickets: [],
  paginatedTickets: [],
  watchlist: [],
  favorite: [],
  currentPage: 1,
  perPage: 8,
};

export const getTicket = createAsyncThunk(
  'movie/getTickets',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState().user;
    try {
      const res = await axiosInstance.get(`/tickets/${state.user?._id}`);
      return res.data.slice(0, 9);
    } catch (e) {
      console.log('Error getting tickets', e);
      thunkAPI.rejectWithValue({error: e, message: 'Error getting tickets'});
    }
  },
);

export const addTicket = createAsyncThunk(
  'movie/addTicket',
  async (args, thunkAPI) => {
    const movieDetails = args;
    const state = thunkAPI.getState().user;
    try {
      const res = await axiosInstance
        .post(`/tickets/add/${state.user?._id}`, JSON.stringify(movieDetails))
        .then(data => data.json());
      return res;
    } catch (e) {
      console.log('Error adding new ticket', e);
      thunkAPI.rejectWithValue({error: e, message: 'Error adding new ticket.'});
    }
  },
);

export const getMovieLists = createAsyncThunk(
  'movie/getMovieLists',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState().user;
    try {
      const res = await axiosInstance.get(`/movies/lists/${state.user?._id}`);
      return res.data;
    } catch (e) {
      console.log('Error fetching movie list', e);
      thunkAPI.rejectWithValue({
        error: e,
        message: 'Error fetching lists',
      });
    }
  },
);

export const addMovieToList = createAsyncThunk(
  'movie/addMovieToList',
  async (args, thunkAPI) => {
    const {type, like, movieId} = args;
    const state = thunkAPI.getState().user;
    try {
      const res = await axiosInstance
        .post(
          `/movies/${like}/${type}/${state.user?._id}`,
          JSON.stringify({movieId}),
        )
        .then(data => data.json());
      return {type, like, movieId};
    } catch (e) {
      console.log('Error adding movie to list', e);
      thunkAPI.rejectWithValue({
        error: e,
        message: `Error adding movie to ${type}`,
      });
    }
  },
);

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    selectTickets: (state, action) => {
      const startIndex = (action.payload - 1) * state.perPage;
      const endIndex = startIndex + state.perPage;
      console.log("TITITITITIT", state.tickets.slice(startIndex, endIndex))
      state.paginatedTickets = state.tickets.slice(startIndex, endIndex);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getTicket.pending, state => {
        state.error.tickets = null;
        state.loading.tickets = true;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.error.tickets = null;
        state.loading.tickets = false;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.error.tickets = action.payload.message;
        state.loading.tickets = false;
      })
      .addCase(addTicket.pending, state => {
        state.error.addTicket = null;
        state.loading.addTicket = true;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.tickets = [action.payload, ...state.tickets];
        state.error.addTicket = null;
        state.loading.addTicket = false;
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.error.addTicket = action.payload.message;
        state.loading.addTicket = false;
      })
      .addCase(getMovieLists.pending, state => {
        state.error.list = null;
        state.loading.list = true;
      })
      .addCase(getMovieLists.fulfilled, (state, action) => {
        const {watchlist, favorite} = action.payload;
        state.watchlist = watchlist;
        state.favorite = favorite;
        state.error.list = null;
        state.loading.list = false;
      })
      .addCase(getMovieLists.rejected, (state, action) => {
        const {message} = action.payload;
        state.error.list = message;
        state.loading.list = false;
      })
      .addCase(addMovieToList.pending, state => {
        state.loading.addMovie = true;
      })
      .addCase(addMovieToList.fulfilled, (state, action) => {
        const {type, like, movieId} = action.payload;
        if (like === 'add') {
          state[type].push(movieId);
        } else {
          const newArr = state[type].filter(obj => obj._id !== movieId);
          if (type === 'favorite') {
            return {...state, favorite: newArr};
          } else {
            return {...state, watchlist: newArr};
          }
        }
        state.loading.addMovie = false;
      })
      .addCase(addMovieToList.rejected, (state, action) => {
        state.error.addMovie = action.payload.message;
        state.loading.addMovie = false;
      });
  },
});

export const {setCurrentPage, selectTickets} = movieSlice.actions;
export const movieReducer = movieSlice.reducer;
