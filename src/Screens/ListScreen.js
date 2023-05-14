/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyContainer from '../Components/EmptyContainer.component';
import ListItem from '../Components/ListItem.component';
import BackHeader from '../Components/BackHeader.component';

const ListScreen = ({route, navigation}) => {
  const {list, type} = route.params;
  const {colors} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <BackHeader navigation={navigation} text={type} />
      {list?.length !== 0 ? (
        <FlatList
          data={list}
          keyExtractor={(item, index) => {
            return item._id;
          }}
          renderItem={({item, index}) => {
            return (
              <ListItem
                onPress={() => navigation.navigate('Movie', {movie: item})}
                image={item.bg ? item.bg : item.img}
                title={item.title}
              />
            );
          }}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.empty]}>
          <EmptyContainer text={`No Movies in your ${type} list!`} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 32,
  },
  empty: {justifyContent: 'center', alignItems: 'center'},
});

export default ListScreen;
