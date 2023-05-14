/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../Utils/Text';

const EmptyContainer = ({text}) => {
  return (
    <View style={styles.container}>
      <Text color="under">{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    height: undefined,
    aspectRatio: 12 / 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmptyContainer;
