/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import TextInput from '../Utils/TextInput';

const PickerInput = props => {
  const {onPress, onValueChange, label, value} = props;
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.wrapper} pointerEvents="none">
        <TextInput
          onValueChange={onValueChange}
          label={label}
          value={value}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PickerInput;
