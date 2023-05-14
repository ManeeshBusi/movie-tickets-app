/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Searchbar, useTheme} from 'react-native-paper';
import Text from '../Utils/Text';
import {SEARCH_URL, bg_path, poster_path} from '../Utils/Constants';
import {useIsFocused} from '@react-navigation/native';
import ListItem from '../Components/ListItem.component';

const SearchScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollEnd, setScrollEnd] = useState(false);
  const isFocus = useIsFocused();

  const getMovies = async () => {
    setLoading(true);
    const search = searchText.replace(' ', '%20').replace('&', '%26');
    const res = await fetch(`${SEARCH_URL}${search}&page=${page}`).then(data =>
      data.json(),
    );

    setTimeout(() => {
      setResults(prev => [...prev, ...res.results]);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    setResults([]);
    setSearchText('');
  }, [isFocus]);

  useEffect(() => {
    getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const renderFooter = () => {
    return <View>{loading && <Text>Loading more items</Text>}</View>;
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Searchbar
        value={searchText}
        onChangeText={val => setSearchText(val)}
        iconColor={colors.primary}
        onIconPress={getMovies}
        onSubmitEditing={getMovies}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{marginBottom: 24}}
        onClearIconPress={() => {
          setResults([]);
          setPage(1);
          setScrollEnd(false);
        }}
      />
      {results?.length !== 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          renderItem={({item, index}) => {
            return (
              <ListItem
                onPress={() => navigation.navigate('Movie', {movieId: item.id})}
                image={
                  item.backdrop_path
                    ? bg_path + item.backdrop_path
                    : poster_path + item.poster_path
                }
                title={item.title}
                date={item.release_date && item.release_date.split('-')[0]}
              />
            );
          }}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            setScrollEnd(true);
          }}
          onMomentumScrollEnd={() => {
            scrollEnd && setPage(page + 1);
            setScrollEnd(false);
          }}
          ListFooterComponent={renderFooter}
        />
      )}
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
  },
});

export default SearchScreen;
