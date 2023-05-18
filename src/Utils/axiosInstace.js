/* eslint-disable prettier/prettier */
import axios from 'axios';
import {API_URL} from './Constants';

const instance = axios.create({
  baseURL: API_URL,
});

export default instance;