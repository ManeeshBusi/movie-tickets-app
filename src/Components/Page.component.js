/* eslint-disable prettier/prettier */
//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// create a component
const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');
const Page = ({item, index}) => {
  console.log('item', item);
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
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
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
          <View
            style={{
              backgroundColor: 'blue',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Icon name="arrow-back" size={30} color="#FFF" />
            <Pressable>
              <Icon name="arrow-forward" size={30} color="#FFF" />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// define your styles
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

//make this component available to the app
export default Page;
