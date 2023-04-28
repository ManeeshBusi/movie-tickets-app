/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
//import liraries
import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Animated, StatusBar} from 'react-native';
import CutSvg from '../Components/CutSvg.component';
import {bg_path, opacityConverter, poster_path} from '../Utils/Constants';
import LinearGradient from 'react-native-linear-gradient';
import {Svg, G, Rect} from 'react-native-svg';
import Text from '../Utils/Text';
import Field from '../Components/DataField.component';
import {useSelector, useDispatch} from 'react-redux';
import {getTickets} from '../Store/userSlice';
import FastImage from 'react-native-fast-image';

// create a component
const {width} = Dimensions.get('window');
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const TicketScreen = () => {
  const dispatch = useDispatch();
  const {tickets, user} = useSelector(state => state.user);

  console.log('TICKERTSSS', tickets);

  const ITEM_SIZE = 320;
  const ITEM_WIDTH = 282;
  const ITEM_HEIGHT = 423;
  const scrollX = useRef(new Animated.Value(0)).current;
  const dashes = new Array(Math.floor(ITEM_WIDTH / 16)).fill(null);

  const spacing = (width - ITEM_SIZE) / 2;

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const renderItem = ({item, index}) => {
    if (!item.name) {
      return <View style={{width: spacing}} />;
    }

    const mildColor = opacityConverter(item.color);
    const translateY = scrollX.interpolate({
      inputRange: [
        (index - 2) * ITEM_SIZE,
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
      ],
      outputRange: [50, 0, 50],
    });

    return (
      <View style={[styles.ticket, {width: ITEM_SIZE}]} key={item.bookingId}>
        <Animated.View
          style={[
            styles.ticketWrapper,
            {width: ITEM_WIDTH, transform: [{translateY}]},
          ]}>
          <View style={{width: ITEM_WIDTH, height: ITEM_HEIGHT}}>
            <LinearGradient
              colors={[mildColor, item.color]}
              locations={[0.3, 0.8]}
              style={styles.gradient}
            />
            <FastImage
              source={{uri: poster_path + item.img}}
              style={[styles.poster, {width: ITEM_WIDTH, height: ITEM_HEIGHT}]}
            />
          </View>
          <CutSvg color={item.color} width={ITEM_WIDTH} />
          <View
            style={[
              styles.bottomTicket,
              {width: ITEM_WIDTH, backgroundColor: item.color},
            ]}>
            <View style={[styles.ticketDetails, {width: ITEM_WIDTH}]}>
              <Text fz={26} type="bold">
                {item.name}
              </Text>
              <View
                style={{flexDirection: 'row', marginTop: 8, marginBottom: 4}}>
                <Field
                  type="field"
                  icon="calendar-blank-outline"
                  text={item.date}
                />
                <Field
                  type="field"
                  icon="clock-time-five-outline"
                  text={item.time}
                />
              </View>
              <Field icon="map-marker-outline" text={item.loc} />

              <Svg height="12" width="100%" style={{marginVertical: 8}}>
                <G>
                  {dashes.map((_, j) => (
                    <Rect
                      key={j}
                      x="1"
                      y="10"
                      width="16"
                      height="10"
                      fill="#FFFFFF"
                      translateX={28 * j}
                    />
                  ))}
                </G>
              </Svg>

              <View style={styles.seatDetails}>
                <Field type="seats" head="AUDI" text={item.screen} />
                <Field type="seats" head="SEATS" text={item.seats} />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {tickets.length !== 0 ? (
        <>
          <View style={[StyleSheet.absoluteFill]}>
            {tickets.map((item, index) => {
              const inputRange = [
                (index - 1) * ITEM_SIZE,
                index * ITEM_SIZE,
                (index + 1) * ITEM_SIZE,
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
              });

              return (
                <AnimatedFastImage
                  key={item.id}
                  source={{uri: bg_path + item.bg}}
                  style={[StyleSheet.absoluteFill, {opacity}]}
                />
              );
            })}
            <View style={[styles.overlay, StyleSheet.absoluteFillObject]} />
          </View>

          <Animated.FlatList
            data={[{bookingId: 'left'}, ...tickets, {bookingId: 'right'}]}
            horizontal
            decelerationRate={0}
            keyExtractor={(item, index) => {
              return item.bookingId;
            }}
            snapToInterval={ITEM_SIZE}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={16}
            renderItem={renderItem}
            removeClippedSubviews={true}
            initialNumToRender={3}
            maxToRenderPerBatch={4}
            updateCellsBatchingPeriod={800}
            windowSize={4}
          />
        </>
      ) : (
        <View>
          <Text>SOMETHING</Text>
        </View>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  overlay: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.7,
  },
});

//make this component available to the app
export default TicketScreen;
