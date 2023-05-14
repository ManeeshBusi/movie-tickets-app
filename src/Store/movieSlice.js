/* eslint-disable prettier/prettier */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  testvar: false,
};

export const testFun = createAsyncThunk(
  'movie/testFun',
  async (args, thunkAPI) => {
    const states = thunkAPI.getState();
    console.log('NEW STATE CHECK', states);
  },
);

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(testFun.fulfilled, state => {
      console.log('INSIDE BUILDER', state);
      state.testvar = true;
    });
  },
});

export const movieReducer = movieSlice.reducer;
