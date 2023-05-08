/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {useDispatch, useSelector} from 'react-redux';
import {signInWithGoogle} from '../Store/userSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function OnBoardingScreen() {
  const {fetchingToken, user} = useSelector(state => state);
  const dispatch = useDispatch();
  const signInWithGoogleAction = () => {
    dispatch(signInWithGoogle());
  };
  const PAGES = [
    {
      id: 1,
      title: (
        <View>
          <Text>Welcome</Text>
        </View>
      ),
      description: (
        <Text>
          Welcome to{' '}
          <Text style={{fontFamily: 'DeathStar', color: 'red'}}>ShowTime</Text>,
          the ultimate movie tracker! Keep track of all the movies you watch in
          theatres and discover new ones to add to your watchlist.
        </Text>
      ),
      background: require('../Assets/images/2049.jpg'),
    },
    {
      id: 2,
      title: <View></View>,
      description: (
        <Text>
          With ShowTime, you can keep track of your movie adventures, explore
          new movies, and get personalized recommendations based on your
          favorites.
        </Text>
      ),
      background: require('../Assets/images/joker.jpg'),
    },
    {
      id: 3,
      title: <View></View>,
      description: (
        <View>
          <GoogleSigninButton
            style={styles.signInButton}
            size={GoogleSigninButton.Size.Standard}
            onPress={signInWithGoogleAction}
            disabled={fetchingToken}
          />
        </View>
      ),
      background: require('../Assets/images/batman.jpg'),
    },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef(null);
  const [listIndex, setIndex] = useState(0);

  useEffect(() => {
    flatRef.current?.scrollToIndex({index: listIndex, animated: true});
  }, [listIndex]);

  const renderItem = ({item, index}) => {
    return (
      <View style={[styles.container]}>
        <ImageBackground
          source={item.background}
          style={{
            flex: 1,
            justifyContent: 'center',
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
          }}
          resizeMode="cover">
          <View style={styles.overlay} />
          <View
            style={{
              flex: 1,
              padding: 16,
            }}>
            <View
              style={{
                flex: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 54,
                  fontFamily: 'DeathStar',
                  color: 'rgba(255, 56, 56, 0.9)',
                }}>
                ShowTime
              </Text>
              {item.description}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {index !== 0 ? (
                <Pressable
                  onPress={() => setIndex(index - 1)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#FFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="arrow-back" size={25} color="#FFF" />
                </Pressable>
              ) : (
                <View />
              )}
              {index !== PAGES.length - 1 && (
                <Pressable
                  onPress={() => setIndex(index + 1)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#FFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="arrow-forward" size={25} color="#FFF" />
                </Pressable>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <ScrollView
        ref={scrollRef}
        style={[styles.container, StyleSheet.absoluteFill]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        {PAGES.map((page, index) => {
          return (
            <Page key={page.id} page={page} index={index} next={onIconPress} />
          );
        })}
      </ScrollView> */}
      <Animated.FlatList
        data={PAGES}
        horizontal
        decelerationRate={0}
        snapToInterval={PAGE_WIDTH}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        renderItem={renderItem}
        ref={flatRef}
        // initialScrollIndex={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.4,
  },
});
