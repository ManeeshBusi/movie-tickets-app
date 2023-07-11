/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IconButton = ({onPress, icon, color, style, ...rest}) => {
  const {colors} = useTheme();
  console.log("PRS", onPress)
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      style={({pressed}) => [
        styles.container,
        {
          backgroundColor: colors.background,
          transform: [{scale: pressed ? 1.1 : 1}],
        },
        style,
      ]}
      >
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
