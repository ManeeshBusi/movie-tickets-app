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
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {useDispatch, useSelector} from 'react-redux';
import {signInWithGoogle} from '../Store/userSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {Button} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

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
        <>
          <Text
            style={{color: 'white', fontSize: 42, fontFamily: 'Urbanist-Bold'}}>
            Welcome to{' '}
          </Text>
          <Text style={{fontFamily: 'DeathStar', fontSize: 42, color: 'red'}}>
            ShowTime
          </Text>
        </>
      ),
      description: (
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 18,
            fontFamily: 'Urbanist-Regular',
          }}>
          The ultimate movie tracker! Keep track of all the movies you watch in
          theatres and discover new ones to add to your watchlist.
        </Text>
      ),
      background: require('../Assets/images/2049.jpg'),
    },
    {
      id: 2,
      title: (
        <Text
          style={{color: 'white', fontSize: 42, fontFamily: 'Urbanist-Bold'}}>
          Explore Movies!
        </Text>
      ),
      description: (
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 18,
            fontFamily: 'Urbanist-Regular',
          }}>
          With ShowTime, you can keep track of your movie adventures, explore
          new movies, and get personalized recommendations based on your
          favorites.
        </Text>
      ),
      background: require('../Assets/images/akira.jpg'),
    },
    {
      id: 3,
      title: (
        <Text
          style={{color: 'white', fontSize: 42, fontFamily: 'Urbanist-Bold'}}>
          Sign In to get started!
        </Text>
      ),
      description: (
        // <GoogleSigninButton
        //   style={styles.signInButton}
        //   size={GoogleSigninButton.Size.Wide}
        //   onPress={signInWithGoogleAction}
        //   disabled={fetchingToken}
        // />
        <TouchableOpacity
          onPress={signInWithGoogleAction}
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            borderRadius: 24,
          }}>
          <FastImage
            source={require('../Assets/images/google-logo.png')}
            style={{width: 25, height: 25}}
            resizeMode="contain"
          />
          <Text style={{color: 'gray', marginHorizontal: 12, fontWeight: 500}}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      ),
      background: require('../Assets/images/joker.jpg'),
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
              padding: 24,
            }}>
            <View
              style={{
                flex: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{marginTop: 64}}>{item.title}</View>
              {index !== PAGES.length - 1 && (
                <View style={{marginVertical: 32}}>{item.description}</View>
              )}
              {/* {item.description} */}
            </View>
            {index !== PAGES.length - 1 ? (
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
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="arrow-back"
                      size={25}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </Pressable>
                ) : (
                  <View />
                )}
                <Pressable
                  onPress={() => setIndex(index + 1)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="arrow-forward"
                    size={25}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </Pressable>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {item.description}
              </View>
            )}
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
  signInButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
  },
});
