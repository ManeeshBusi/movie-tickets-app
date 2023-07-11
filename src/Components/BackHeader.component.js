/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import IconButton from './IconButton.component';
import Text from '../Utils/Text';

const BackHeader = ({goBack, text}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconButton onPress={goBack} icon="chevron-left" />
      </View>
      <View style={styles.textContainer}>
        <Text variant="headlineMedium">{text}</Text>
      </View>
      <View style={styles.gap} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    zIndex: 99,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gap: {flex: 1},
});

export default BackHeader;
