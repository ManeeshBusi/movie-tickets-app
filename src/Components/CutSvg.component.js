/* eslint-disable prettier/prettier */
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Icon(props) {
  return (
    <Svg
      width={282}
      height={60}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 0h285v15c-16.599 3.112-16.599 26.888 0 30v15H0V45c16.599-3.112 16.599-26.888 0-30V0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default Icon;
