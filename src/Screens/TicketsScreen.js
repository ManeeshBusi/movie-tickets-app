/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import CutSvg from '../Components/CutSvg.component';
import {contrastCalc, opacityConverter} from '../Utils/Constants';
import LinearGradient from 'react-native-linear-gradient';
import {Svg, G, Rect} from 'react-native-svg';
import Text from '../Utils/Text';
import Field from '../Components/DataField.component';
import {useSelector, useDispatch} from 'react-redux';
import {addNewMovie, getTickets, refreshTickets} from '../Store/userSlice';
import FastImage from 'react-native-fast-image';
import {TimePickerModal, DatePickerModal} from 'react-native-paper-dates';
import {TextInput, useTheme, Button} from 'react-native-paper';
import moment from 'moment';
import IconButton from '../Components/IconButton.component';
import Loading from '../Components/Loading.component';

const {width} = Dimensions.get('window');
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ITEM_SIZE = 320;
const ITEM_WIDTH = 282;
const ITEM_HEIGHT = 423;

const TicketScreen = ({navigation}) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const {tickets, user, fetchedMessages} = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const scrollX = useRef(new Animated.Value(0)).current;
  const dashes = new Array(Math.floor(ITEM_WIDTH / 16)).fill(null);

  const spacing = (width - ITEM_SIZE) / 2;

  useEffect(() => {
    dispatch(getTickets()).then(() => {
      setImgLoading(false);
    });
  }, [dispatch, fetchedMessages]);

  const renderItem = ({item, index}) => {
    const movieDetails = item.movieId;

    if (!item.date) {
      return <View style={{width: spacing}} key={item._id} />;
    }

    const contrast = contrastCalc(movieDetails.color, colors.text);

    const mildColor = opacityConverter(movieDetails.color);
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
              colors={[mildColor, movieDetails.color]}
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
                  color={!contrast && colors.textDark}
                  variant="headlineMedium">
                  {movieDetails.title}
                </Text>
              </TouchableOpacity>
              <View
                style={{flexDirection: 'row', marginTop: 8, marginBottom: 4}}>
                <Field
                  type="field"
                  icon="calendar-blank-outline"
                  text={item.date}
                  flex={1.8}
                  color={contrast ? colors.text : colors.textDark}
                />
                <Field
                  type="field"
                  icon="clock-time-five-outline"
                  text={item.time}
                  flex={1.2}
                  color={contrast ? colors.text : colors.textDark}
                />
              </View>
              <Field
                icon="map-marker-outline"
                text={item.location}
                color={contrast ? colors.text : colors.textDark}
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
                      fill={contrast ? '#FFFFFF' : colors.textDark}
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
                  color={contrast ? colors.text : colors.textDark}
                />
                <Field
                  type="seats"
                  head="SEATS"
                  text={item.seats}
                  color={contrast ? colors.text : colors.textDark}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(refreshTickets);
    setRefreshing(false);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const initialState = {
    title: null,
    date: null,
    time: null,
    location: null,
    screen: null,
    seats: null,
  };

  const [form, setForm] = useState(initialState);

  const onValueChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTicket = () => {
    dispatch(addNewMovie(form)).then(value => {
      console.log('VALUEE', value);
    });
    setForm(initialState);
  };

  const closeModal = () => {
    setModalVisible(false);
    setForm(initialState);
  };

  const [timeVisible, setTimeVisible] = useState(false);
  const onTimeDismiss = useCallback(() => {
    setTimeVisible(false);
  }, [setTimeVisible]);
  const onTimeConfirm = useCallback(
    ({hours, minutes}) => {
      setTimeVisible(false);
      console.log({hours, minutes});
      let meridian = 'am';
      let newHours = hours;
      if (hours > 12 || hours === 0) {
        meridian = 'pm';

        if (hours > 12) {
          newHours = hours - 12;
        }
        if (newHours < 10) {
          newHours = `0${newHours}`;
        }
      }
      const formatTime = `${newHours}:${minutes}${meridian}`;
      onValueChange('time', formatTime);
    },
    [setTimeVisible],
  );

  const [dateVisible, setDateVisible] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const onDateDismiss = useCallback(() => {
    setDateVisible(false);
  }, [setDateVisible]);

  const onDateConfirm = useCallback(
    params => {
      console.log('DATE', params.date);
      setDateValue(params.date);
      setDateVisible(false);
      const newDate = moment(params.date).format('ddd, D MMM, YYYY');
      onValueChange('date', newDate);
    },
    [setDateVisible],
  );

  const {colors} = useTheme();

  const addNewMovieModal = () => {
    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.container, {backgroundColor: 'rgba(0,0,0,0.4)'}]}>
          <View
            style={{
              width: '90%',
              height: '80%',
              backgroundColor: colors.card,
              borderRadius: 30,
              padding: 16,
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <IconButton icon="close" onPress={closeModal} />
              </View>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text variant="titleLarge">Add New Ticket</Text>
              </View>
              <View style={{flex: 1}} />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TextInput
                mode="outlined"
                label="Title"
                onChangeText={value => onValueChange('title', value)}
                style={styles.input}
                value={form.title}
              />
              <Pressable
                onPress={() => setDateVisible(true)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  pointerEvents="none"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    mode="outlined"
                    label="Date"
                    onChangeText={value => onValueChange('date', value)}
                    style={styles.input}
                    value={form.date}
                  />
                </View>
              </Pressable>
              <DatePickerModal
                locale="en"
                mode="single"
                visible={dateVisible}
                onDismiss={onDateDismiss}
                onConfirm={onDateConfirm}
                date={dateValue}
              />
              <Pressable
                onPress={() => setTimeVisible(true)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  pointerEvents="none"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    mode="outlined"
                    label="Time"
                    onChangeText={value => onValueChange('time', value)}
                    style={styles.input}
                    value={form.time}
                  />
                </View>
              </Pressable>
              <TimePickerModal
                visible={timeVisible}
                onDismiss={onTimeDismiss}
                onConfirm={onTimeConfirm}
                hours={12}
                minutes={14}
              />
              <TextInput
                mode="outlined"
                label="Location"
                onChangeText={value => onValueChange('location', value)}
                style={styles.input}
                value={form.location}
              />
              <TextInput
                mode="outlined"
                label="Screen"
                onChangeText={value => onValueChange('screen', value)}
                style={styles.input}
                value={form.screen}
              />
              <TextInput
                mode="outlined"
                label="Seats"
                onChangeText={value => onValueChange('seats', value)}
                style={styles.input}
                value={form.seats}
              />
            </View>
            <Button mode="contained" onPress={addTicket}>
              Submit
            </Button>
          </View>
          {/* <Text color= 'red'>SOMEETHING</Text> */}
        </View>
      </Modal>
    );
  };

  if (imgLoading) {
    return <Loading loading={imgLoading} />;
  } else {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <StatusBar translucent backgroundColor="transparent" />
          <View
            style={{
              position: 'absolute',
              top: 30,
              height: 42,
              width: '100%',
              zIndex: 999,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 12,
            }}>
            <IconButton
              onPress={() => navigation.goBack()}
              icon="chevron-left"
            />
            <IconButton onPress={() => setModalVisible(true)} icon="add" />
          </View>
          {tickets.length !== 0 && (
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
                      key={item._id}
                      source={{uri: item.movieId.bg}}
                      style={[StyleSheet.absoluteFill, {opacity}]}
                    />
                  );
                })}
                <View style={[styles.overlay, StyleSheet.absoluteFillObject]} />
              </View>

              <Animated.FlatList
                data={[{_id: 'left'}, ...tickets, {_id: 'right'}]}
                horizontal
                decelerationRate={0}
                keyExtractor={(item, index) => {
                  return item._id;
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
                // initialNumToRender={3}
                // maxToRenderPerBatch={4}
                // updateCellsBatchingPeriod={800}
                // windowSize={4}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </>
          )}
          {addNewMovieModal()}
        </KeyboardAvoidingView>
      </View>
    );
  }
};

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
  overlay: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.3,
  },
  input: {
    width: '95%',
    marginVertical: 6,
  },
});

export default TicketScreen;
