/* eslint-disable prettier/prettier */
//import liraries
import React from 'react';
import {Text as ReactNativeText} from 'react-native';

// create a component
const Text = props => {
  const {fz, type} = props;
  var font = 'Regular';
  switch (type) {
    case 'bold':
      font = 'Bold';
      break;

    default:
      break;
  }
  return (
    <ReactNativeText
      // eslint-disable-next-line react-native/no-inline-styles
      style={{fontSize: fz, color: 'white', fontFamily: 'Urbanist-' + font}}>
      {props.children}
    </ReactNativeText>
  );
};

// define your styles

//make this component available to the app
export default Text;
