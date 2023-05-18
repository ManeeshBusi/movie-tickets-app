/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import Text from '../Utils/Text';
import {Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import EmptyContainer from './EmptyContainer.component';

const Ticketlist = ({navigation}) => {
  const {tickets} = useSelector(state => state.user);
  const renderItem = ({item, index}) => {
    let customMargin = {};
    if (index === 0) {
      customMargin.marginRight = 8;
    } else {
      customMargin.marginHorizontal = 8;
    }
    // console.log('TIIIII', tickets);
    return (
      <View style={[customMargin, styles.itemContainer]}>
        <FastImage style={styles.image} source={{uri: item.movieId.bg}} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Tickets</Text>
        <Button compact onPress={() => navigation.navigate('Tickets')}>
          View All
        </Button>
      </View>
      {tickets?.length !== 0 ? (
        <FlatList
          data={tickets?.slice(0, 8)}
          horizontal
          keyExtractor={(item, index) => {
            return item._id;
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          snapToInterval={356}
        />
      ) : (
        <EmptyContainer text="No Tickets available!" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 340,
    height: undefined,
    aspectRatio: 12 / 5,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 8,
      height: 18,
    },
    shadowOpacity: 0.95,
    shadowRadius: 20.0,
  },
});

export default Ticketlist;
