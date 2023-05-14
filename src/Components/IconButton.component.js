/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IconButton = ({onPress, icon, color}) => {
  const {colors} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, {backgroundColor: colors.background}]}>
      <Icon name={icon} size={25} color={colors.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
});

export default IconButton;
