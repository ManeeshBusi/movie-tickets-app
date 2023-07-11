/* eslint-disable prettier/prettier */
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {signInWithGoogle} from '../Store/userSlice';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import Text from '../Utils/Text';
import IconButton from '../Components/IconButton.component';
import Toast from 'react-native-toast-message';

const {width: PAGE_WIDTH} = Dimensions.get('window');

export default function OnBoardingScreen() {
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const signInWithGoogleAction = () => {
    dispatch(signInWithGoogle()).then(() => {
      Toast.show({type: 'success', text1: 'You have logged in sucessfully!'});
    });
  };
  const PAGES = [
    {
      id: 1,
      heading: (
        <View style={styles.heading}>
          <Text variant="headlineLarge">Welcome to </Text>
          <Text variant="displayLarge" color={colors.primary}>
            ShowTime
          </Text>
        </View>
      ),
      description:
        'The ultimate movie tracker! Keep track of all the movies you watch in theatres and discover new ones to add to your watchlist.',
      background: require('../Assets/images/2049.jpg'),
    },
    {
      id: 2,
      title: 'Explore Movies!',
      description:
        'With ShowTime, you can keep track of your movie adventures, explore new movies, and get personalized recommendations based on yourfavorites.',
      background: require('../Assets/images/akira.jpg'),
    },
    {
      id: 3,
      title: 'Sign In to get started!',
      login: (
        <TouchableOpacity
          onPress={signInWithGoogleAction}
          style={styles.signInButton}>
          <FastImage
            source={require('../Assets/images/google-logo.png')}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text color="backdrop" style={styles.googleText}>
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
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.overlay} />
          <View style={styles.contentContainer}>
            <View style={styles.content}>
              <View style={styles.title}>
                {item.title ? (
                  <Text variant="headlineLarge">{item.title}</Text>
                ) : (
                  item.heading
                )}
              </View>
              <View style={styles.description}>
                <Text variant="bodyExtraLarge">{item.description}</Text>
              </View>
            </View>
            {index !== PAGES.length - 1 ? (
              <View style={styles.buttonsContainer}>
                {index !== 0 ? (
                  <IconButton
                    icon="arrow-back"
                    onPress={() => setIndex(index - 1)}
                  />
                ) : (
                  <View />
                )}

                <IconButton
                  icon="arrow-forward"
                  onPress={() => setIndex(index + 1)}
                />
              </View>
            ) : (
              <View style={styles.buttonsContainer}>{item.login}</View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <StatusBar translucent backgroundColor="transparent" />
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
  heading: {justifyContent: 'center', alignItems: 'center'},
  overlay: {
    width: PAGE_WIDTH,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.4,
  },
  signInButton: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width: PAGE_WIDTH,
    // height: PAGE_HEIGHT,
    // width: '100%',
    height: '100%',
  },
  title: {marginTop: 64},
  description: {marginVertical: 32},
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentContainer: {flex: 1, padding: 24},
  content: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {width: 25, height: 25},
  googleText: {marginHorizontal: 12, fontWeight: 500},
});
