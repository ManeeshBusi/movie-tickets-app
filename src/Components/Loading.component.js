/* eslint-disable prettier/prettier */
//import liraries
import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';

// create a component
const Loading = ({loading}) => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background},
        StyleSheet.absoluteFillObject,
      ]}>
      <ActivityIndicator
        animating={loading}
        color={colors.primary}
        size="small"
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default Loading;
