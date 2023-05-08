/* eslint-disable prettier/prettier */
//import liraries
import React from 'react';
import {Text as ReactNativeText} from 'react-native';

// create a component
const Text = props => {
  const {fz, type, color} = props;
  var font = 'Regular';
  switch (type) {
    case 'bold':
      font = 'Bold';
      break;

    default:
      break;
  }
  var customColor = color ? color : 'white';
  return (
    <ReactNativeText
      // eslint-disable-next-line react-native/no-inline-styles
      style={{fontSize: fz, color: customColor, fontFamily: 'Urbanist-' + font}}>
      {props.children}
    </ReactNativeText>
  );
};

// define your styles

//make this component available to the app
export default Text;
