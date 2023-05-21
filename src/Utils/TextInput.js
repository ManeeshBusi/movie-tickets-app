/* eslint-disable prettier/prettier */
import React from 'react';
import {TextInput as ReactNativeTextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const TextInput = props => {
  const {label, onValueChange, value} = props;

  return (
    <ReactNativeTextInput
      mode="outlined"
      label={label}
      onChangeText={inputValue => onValueChange(label.toLowerCase(), inputValue)}
      value={value}
      style={styles.input}
    />
  );
};

export default TextInput;

const styles = StyleSheet.create({
  input: {
    width: '95%',
    marginVertical: 8,
  },
});
