/* eslint-disable prettier/prettier */
export const API_KEY = 'b36be16db427f6f84a8c93802b633757';
export const poster_path = 'https://image.tmdb.org/t/p/w500';
export const bg_path = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces';

export const rgbConverter = hex => {
  hex = hex.slice(1, hex.length);
  hex = '0x' + hex;
  let r = (hex >> 16) & 0xff;
  let g = (hex >> 8) & 0xff;
  let b = hex & 0xff;
  return `rgba(${r}, ${g}, ${b}, 0.96)`;
};

export const opacityConverter = color => {
  return color.substr(0, color.length - 5) + '0.4)';
};

export const moviesData = [
  {
    id: 1,
    name: 'The Batman',
    date: 'Sun, 6 Mar, 2022',
    time: '01:00 PM',
    loc: 'PVR Forum Sujana Mall: Kukatpally, Hyderabad',
    screen: '07',
    seats: 'F8, F9',
    bg: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    img: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    color: 'rgba(192, 64, 8, 0.96)',
  },
  {
    id: 2,
    name: 'John Wick: Chapter 4',
    date: 'Fri, 24 Mar, 2023',
    time: '07:05 PM',
    loc: 'AMB Cinemas: Gachibowli',
    screen: '01',
    seats: 'F7',
    bg: '/i8dshLvq4LE3s0v8PrkDdUyb1ae.jpg',
    img: '/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    color: 'rgba(40, 32, 32, 0.96)',
  },
  {
    id: 3,
    name: 'Demon Slayer: Kimetsu no Yaiba -To the Swordsmith Village-',
    date: 'Sun, 19 Mar, 2023',
    time: '02:40 PM',
    loc: 'PVR: 4DX, Nexus Mall Kukatpally, Hyderabad',
    screen: '05 4DX',
    seats: 'D5, D6',
    bg: '/umhjSTT9qDBZFJUUYQ2kVpOkQpY.jpg',
    img: '/o8DB5825myndApdQQHbf4bv1mzL.jpg',
    color: 'rgba(24, 16, 16, 0.96)',
  },
  {
    id: 4,
    name: 'Everything Everywhere All at Once',
    date: 'Fri, 16 Sep, 2022',
    time: '07:40 PM',
    loc: 'PVR: Nexus Mall Kukatpally, Hyderabad',
    screen: '04',
    seats: 'K3',
    bg: '/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg',
    img: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    color: 'rgba(48, 24, 48, 0.96)',
  },
];
