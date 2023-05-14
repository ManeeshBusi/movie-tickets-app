/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {refreshTickets, signOutGoogle} from '../Store/userSlice';
import Text from '../Utils/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const refreshMovieTickets = () => {
    dispatch(refreshTickets());
  };

  const navToBackground = () => {
    navigation.navigate('Background');
  };

  const logout = () => {
    dispatch(signOutGoogle());
  };

  const fetchLatest = () => {
    console.log('LATEST');
  };

  const actionItems = [
    {
      id: 1,
      onPress: navToBackground,
      icon: 'image',
      text: 'Change background',
    },
    {
      id: 2,
      onPress: refreshMovieTickets,
      icon: 'cached',
      text: 'Refresh tickets',
    },
    {
      id: 3,
      onPress: fetchLatest,
      icon: 'fiber-new',
      text: 'Fetch latest tickets',
    },
    {
      id: 4,
      onPress: logout,
      icon: 'logout',
      text: 'Logout',
    },
  ];

  return (
    <>
      <FastImage
        source={
          user.background
            ? {uri: user.background}
            : require('../Assets/images/ponni.jpg')
        }
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.menuContainer}>
        <View style={styles.personal}>
          <FastImage source={{uri: user.picture}} style={styles.profilePic} />
          <Text variant="titleLarge">{user.name}</Text>
        </View>
        <View style={styles.menu}>
          {actionItems.map(item => {
            return (
              <Pressable
                key={item.id}
                onPress={item.onPress}
                style={styles.menuItem}>
                <Icon name={item.icon} size={24} color={colors.primary} />
                <Text variant="bodyLarge" style={styles.menuText}>
                  {item.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={[styles.container, {backgroundColor: colors.background}]} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  background: {
    width: 400,
    height: undefined,
    aspectRatio: 12 / 7,
  },
  menuContainer: {
    position: 'absolute',
    top: 160,
    width: '100%',
    zIndex: 999,
    paddingHorizontal: 24,
  },
  personal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  menu: {marginVertical: 16},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  menuText: {marginLeft: 16},
});

export default UserScreen;
