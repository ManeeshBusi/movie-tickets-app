/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from '../Utils/Text';
import {useDispatch, useSelector} from 'react-redux';
import Watchlist from '../Components/Watchlist.component';
import Ticketlist from '../Components/Ticketlist.component';
import {getMovieList, getTickets} from '../Store/userSlice';

const Home = props => {
  const {colors} = useTheme();
  const {user, watchlist, favorite} = useSelector(state => state);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getTickets());
    dispatch(getMovieList('favorite'));
    dispatch(getMovieList('watchlist'));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.background]}
          tintColor={colors.background}
        />
      }>
      <View style={styles.greeting}>
        <Text variant="bodyLarge" color="under">
          Welcome {user.name}
        </Text>
        <Text variant="titleLarge">Let's relax and watch a movie!</Text>
      </View>
      <Ticketlist navigation={props.navigation} />
      <Watchlist
        navigation={props.navigation}
        type="Watchlist"
        list={watchlist}
      />
      <Watchlist
        navigation={props.navigation}
        type="Favorites"
        list={favorite}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // paddingTop: 48,
  },
  greeting: {
    paddingVertical: 16,
    marginBottom: 24,
  },
});

export default Home;
