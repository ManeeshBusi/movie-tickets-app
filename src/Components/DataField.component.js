/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../Utils/Text';

const Field = memo(props => {
  const {icon, head, text, type, flex, color} = props;
  const isSeat = type === 'seats';
  return (
    <View
      style={isSeat ? styles.seatContainer : [styles.container, {flex: flex}]}>
      {isSeat ? (
        <Text color={color} variant="bodyLarge">
          {head}
        </Text>
      ) : (
        <Icon name={icon} size={16} color={color} style={{marginRight: 4}} />
      )}
      <Text color={color} variant={isSeat ? 'bodyExtraLarge' : 'bodySmall'}>
        {text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // marginHorizontal: 4,
    marginBottom: 2,
  },
  seatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Field;
