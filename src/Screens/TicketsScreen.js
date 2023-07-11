/* eslint-disable prettier/prettier */
import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from 'react-native-paper';
import IconButton from '../Components/IconButton.component';
import Loading from '../Components/Loading.component';
import TicketItem from '../Components/TicketItem.component';
import TicketForm from '../Components/TicketForm.component';
import {selectTicketsWithMovies} from '../Store/movieSlice';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

const {width} = Dimensions.get('window');
const ITEM_SIZE = 320;

const TicketScreen = ({navigation}) => {
  // eslint-disable-next-line no-unused-vars
  // const {user, fetchedMessages} = useSelector(state => state.user);
  // const tickets = useSelector(selectTickets);
  const tickets = useSelector(selectTicketsWithMovies);

  const [imgLoading, setImgLoading] = useState(true);
  const [backgroundImage, setBackground] = useState(null);
  const [bgIndex, setBgIndex] = useState(null);

  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const spacing = (width - ITEM_SIZE) / 2;

  useEffect(() => {
    setImgLoading(false);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      if (bgIndex) {
        setBackground(tickets[bgIndex].movieDetails.bg);
      } else {
        setBackground(tickets[0].movieDetails.bg);
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgIndex]);

  const [modalVisible, setModalVisible] = useState(false);

  const {colors} = useTheme();

  const onViewableItemsChanged = useRef(_.debounce(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      index > 1 && setBgIndex(index - 1);
    }
  }, 1000)
  ).current;

  if (imgLoading) {
    return <Loading loading={imgLoading} />;
  } else {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <KeyboardAvoidingView>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={styles.header}>
            <IconButton
              onPress={() => navigation.goBack()}
              icon="chevron-left"
            />
            <IconButton onPress={() => setModalVisible(true)} icon="add" />
          </View>
          {/* <View style={[StyleSheet.absoluteFill]}>
            {tickets.map((item, index) => {
              const inputRange = [
                (index) * ITEM_SIZE,
                (index + 1) * ITEM_SIZE,
                // (index + 1) * ITEM_SIZE,
              ];
              // const opacity = scrollX.interpolate({
              //   inputRange,
              //   outputRange: [0, 1, 0],
              // });
              const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [0, width],
              });

              return (
                <AnimatedFastImage
                  key={item._id}
                  source={{uri: item.movieDetails.bg}}
                  // style={[StyleSheet.absoluteFill, {opacity}]}
                  style={[StyleSheet.absoluteFillObject, {transform: [{translateX}]}]}
                />
              );
            })}
             <View style={[styles.overlay, StyleSheet.absoluteFillObject]} />
           </View> */}
          {backgroundImage && (
            <Animated.View
              style={[StyleSheet.absoluteFill, {opacity: fadeAnim}]}>
              <FastImage
                source={{uri: backgroundImage}}
                style={{...StyleSheet.absoluteFillObject}}
              />
              <View style={[StyleSheet.absoluteFillObject, styles.overlay]} />
            </Animated.View>
          )}
          {tickets?.length !== 0 && (
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
              renderItem={({item, index}) => (
                <TicketItem
                  item={item}
                  index={index}
                  navigation={navigation}
                  spacing={spacing}
                  scrollX={scrollX}
                />
              )}
              removeClippedSubviews={true}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              updateCellsBatchingPeriod={2000}
              windowSize={10}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
            />
          )}
          <TicketForm
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
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
  header: {
    position: 'absolute',
    top: 30,
    height: 42,
    width: '100%',
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
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
});

export default TicketScreen;
