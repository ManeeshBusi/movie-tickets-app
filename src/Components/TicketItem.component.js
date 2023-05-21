/* eslint-disable prettier/prettier */
//import liraries
import React, {memo} from 'react';
import {View, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Svg, G, Rect} from 'react-native-svg';
import CutSvg from '../Components/CutSvg.component';
import Field from './DataField.component';
import Text from '../Utils/Text';

const ITEM_SIZE = 320;
const ITEM_WIDTH = 282;
const ITEM_HEIGHT = 423;

const dashes = new Array(Math.floor(ITEM_WIDTH / 16)).fill(null);

const TicketItem = memo(({navigation, item, index, spacing, scrollX}) => {
  const movieDetails = item.movieId;
  const {colors} = useTheme();

  if (!item.date) {
    return <View style={{width: spacing}} key={item._id} />;
  }

  const translateY = scrollX.interpolate({
    inputRange: [
      (index - 2) * ITEM_SIZE,
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
    ],
    outputRange: [50, 0, 50],
  });

  return (
    <View style={[styles.ticket, {width: ITEM_SIZE}]} key={item._id}>
      <Animated.View
        style={[
          styles.ticketWrapper,
          {width: ITEM_WIDTH, transform: [{translateY}]},
        ]}>
        <View style={{width: ITEM_WIDTH, height: ITEM_HEIGHT}}>
          <LinearGradient
            colors={[movieDetails.mildColor, movieDetails.color]}
            locations={[0.3, 0.8]}
            style={styles.gradient}
          />
          <FastImage
            source={{uri: movieDetails.img}}
            style={[styles.poster, {width: ITEM_WIDTH, height: ITEM_HEIGHT}]}
          />
        </View>
        <CutSvg color={movieDetails.color} width={ITEM_WIDTH} />
        <View
          style={[
            styles.bottomTicket,
            {width: ITEM_WIDTH, backgroundColor: movieDetails.color},
          ]}>
          <View style={[styles.ticketDetails, {width: ITEM_WIDTH}]}>
            <TouchableOpacity
              onPress={
                () => navigation.navigate('Movie', {movie: movieDetails})
                // navigation.navigate('Movie', {movieId: movieDetails.tmdbId})
              }>
              <Text
                color={!movieDetails.contrast && colors.textDark}
                variant="headlineMedium">
                {movieDetails.title}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', marginTop: 8, marginBottom: 4}}>
              <Field
                type="field"
                icon="calendar-blank-outline"
                text={item.date}
                flex={1.8}
                color={movieDetails.contrast ? colors.text : colors.textDark}
              />
              <Field
                type="field"
                icon="clock-time-five-outline"
                text={item.time}
                flex={1.2}
                color={movieDetails.contrast ? colors.text : colors.textDark}
              />
            </View>
            <Field
              icon="map-marker-outline"
              text={item.location}
              color={movieDetails.contrast ? colors.text : colors.textDark}
            />

            <Svg height="12" width="100%" style={{marginVertical: 8}}>
              <G>
                {dashes.map((_, j) => (
                  <Rect
                    key={j}
                    x="1"
                    y="10"
                    width="16"
                    height="10"
                    fill={movieDetails.contrast ? '#FFFFFF' : colors.textDark}
                    translateX={28 * j}
                  />
                ))}
              </G>
            </Svg>

            <View style={styles.seatDetails}>
              <Field
                type="seats"
                head="AUDI"
                text={item.screen}
                color={movieDetails.contrast ? colors.text : colors.textDark}
              />
              <Field
                type="seats"
                head="SEATS"
                text={item.seats}
                color={movieDetails.contrast ? colors.text : colors.textDark}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
});

// define your styles
const styles = StyleSheet.create({
  ticket: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 20,
    zIndex: -19,
  },
  ticketWrapper: {
    height: 539,
    borderRadius: 36,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.21,
    shadowRadius: 8.19,
    elevation: 11,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    flex: 1,
  },
  poster: {
    position: 'absolute',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    zIndex: -999,
  },
  bottomTicket: {
    height: 73,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 24,
  },
  ticketDetails: {
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 10,
  },
  seatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 16,
  },
});

//make this component available to the app
export default TicketItem;
