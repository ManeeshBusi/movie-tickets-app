/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
