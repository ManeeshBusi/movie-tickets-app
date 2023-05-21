/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TicketScreen from '../Screens/TicketsScreen';
import Home from '../Screens/HomeScreen';
import MovieScreen from '../Screens/MovieScreen';
import {BottomNavigation, useTheme} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchScreen from '../Screens/SearchScreen';
import UserScreen from '../Screens/UserScreen';
import UserBg from '../Screens/UserBgScreen';
import ListScreen from '../Screens/ListScreen';
import {useDispatch} from 'react-redux';
import {getMovieLists, getTicket} from '../Store/movieSlice';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LandingTabs = () => {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={({navigation, state, descriptors, insets}) => {
        return (
          <BottomNavigation.Bar
            style={{
              height: 60,
              backgroundColor: colors.card,
            }}
            activeColor={colors.background}
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({route, preventDefault}) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({route, focused, color}) => {
              const {options} = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({focused, color, size: 24});
              }

              return null;
            }}
            // getLabelText={({route}) => {
            //   const {options} = descriptors[route.key];
            //   const label =
            //     options.tabBarLabel !== undefined
            //       ? options.tabBarLabel
            //       : options.title !== undefined
            //       ? options.title
            //       : route.title;

            //   return label;
            // }}
          />
        );
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => {
            return <Icon name="search" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({color, size}) => {
            return <Icon name="person" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default function LoggedInNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTicket());
    dispatch(getMovieLists());
  });

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Landing"
        component={LandingTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Tickets" component={TicketScreen} />
      <Stack.Screen name="Movie" component={MovieScreen} />
      <Stack.Screen name="Background" component={UserBg} />
      <Stack.Screen name="Lists" component={ListScreen} />
    </Stack.Navigator>
  );
}
