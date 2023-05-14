/* eslint-disable prettier/prettier */
import React from 'react';
import {Text as ReactNativeText} from 'react-native-paper';
import {useTheme} from 'react-native-paper';

const Text = props => {
  const {color, variant, style, ...rest} = props;
  const {colors} = useTheme();
  const textColor = color ? (colors[color] ? colors[color] : color) : '#DDDADA';

  return (
    <ReactNativeText
      variant={variant}
      style={[style, {color: textColor}]}
      {...rest}>
      {props.children}
    </ReactNativeText>
  );
};

export default Text;
