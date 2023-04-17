/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
//import liraries
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../Utils/Text';

// create a component
const Field = props => {
  const {icon, head, text, type} = props;
  const isSeat = type === 'seats';

  return (
    <View style={isSeat ? styles.seatContainer : styles.container}>
      {isSeat ? (
        <Text fz={16}>{head}</Text>
      ) : (
        <Icon name={icon} size={16} color="#FFF" style={{marginRight: 4}} />
      )}
      <Text fz={isSeat ? 24 : 12}>{text}</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  seatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default Field;
