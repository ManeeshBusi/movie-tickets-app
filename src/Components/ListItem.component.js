/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Text from '../Utils/Text';
import FastImage from 'react-native-fast-image';

const ListItem = ({onPress, image, title, date}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <FastImage
        style={styles.image}
        source={{uri: image}}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text variant="titleMedium">{title}</Text>
        {date && <Text>{date}</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 350,
    height: undefined,
    aspectRatio: 12 / 6,
    borderRadius: 28,
    shadowColor: '#000000',
    shadowOffset: {
      width: 8,
      height: 18,
    },
    shadowOpacity: 0.95,
    shadowRadius: 20.0,
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
});

export default ListItem;
