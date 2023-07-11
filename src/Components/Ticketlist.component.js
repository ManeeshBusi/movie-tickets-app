/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import Text from '../Utils/Text';
import {Button, useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import EmptyContainer from './EmptyContainer.component';
import {selectTicketsWithMovies} from '../Store/movieSlice';

const today = Date.now() / 1000;

const Ticketlist = ({navigation}) => {
  const tickets = useSelector(selectTicketsWithMovies);
  const {colors} = useTheme();

  const renderItem = ({item, index}) => {
    let customMargin = {};
    if (index === 0) {
      customMargin.marginRight = 8;
    } else {
      customMargin.marginHorizontal = 8;
    }

    return (
      <View style={[customMargin, styles.itemContainer]}>
        {item.datetime > today && (
          <View
            style={[styles.upcomingContainer, {backgroundColor: colors.primary}]}>
            <Text color="textDark">Upcoming</Text>
          </View>
        )}
        <FastImage
          style={styles.image}
          source={{uri: item?.movieDetails?.bg}}
        />
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
    marginBottom: 12,
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
  upcomingContainer: {
    position: 'absolute',
    top: 0,
    right: 24,
    zIndex: 9,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Ticketlist;
