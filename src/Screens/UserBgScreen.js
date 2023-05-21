/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Pressable} from 'react-native';
import Text from '../Utils/Text';
import {API_URL} from '../Utils/Constants';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {changeBackground} from '../Store/userSlice';
import BackHeader from '../Components/BackHeader.component';

const UserBg = ({navigation}) => {
  const {colors} = useTheme();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scrollEnd, setScrollEnd] = useState(false);
  const [results, setResults] = useState([]);

  const getBackgrounds = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/movies/backgrounds/${page}`).then(
      data => data.json(),
    );
    setResults(prev => [...prev, ...res]);
    setLoading(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    getBackgrounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading && <Text>Loading backgorunds</Text>}
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <BackHeader navigation={navigation} text="Choose an image" />
      {results?.length !== 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => {
            return item._id;
          }}
          renderItem={({item, index}) => {
            return (
              <Pressable
                onPress={() => {
                  dispatch(changeBackground(item.bg)).then(() => {
                    navigation.goBack();
                  });
                }}
                style={({pressed}) => [
                  styles.itemContainer,
                  {transform: [{scale: pressed ? 1.08 : 1}]},
                ]}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item.bg,
                  }}
                  resizeMode="cover"
                />
              </Pressable>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  itemContainer: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 340,
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
  footer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserBg;
