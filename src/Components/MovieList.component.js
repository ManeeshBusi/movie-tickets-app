/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Text from '../Utils/Text';
import {Button} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import EmptyContainer from './EmptyContainer.component';

const MovieList = ({navigation, type, list}) => {
  const renderItem = ({item, index}) => {
    let customMargin = {};
    if (index === 0) {
      customMargin.marginRight = 8;
    } else {
      customMargin.marginHorizontal = 8;
    }
    return (
      <TouchableOpacity
        style={[customMargin, styles.itemContainer]}
        onPress={() =>
          navigation.navigate('Movie', {movie: item, newMovie: false})
        }>
        <FastImage
          style={styles.image}
          source={{
            uri: item.img,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">{type}</Text>
        <Button
          compact
          onPress={() => navigation.navigate('Lists', {list: list, type})}>
          View All
        </Button>
      </View>
      {list.length !== 0 ? (
        <FlatList
          data={list}
          horizontal
          keyExtractor={(item, index) => {
            return item._id;
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
        />
      ) : (
        <EmptyContainer text={`No Movies in your ${type} list!`} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
    paddingBottom: 12,
  },
  itemContainer: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  image: {
    width: undefined,
    height: 250,
    aspectRatio: 2 / 3,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 8,
      height: 18,
    },
    shadowOpacity: 0.95,
    shadowRadius: 20.0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default MovieList;
