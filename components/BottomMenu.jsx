import React, { useContext, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import BottomHome from '../assets/images/bottom-home.png';
import BottomClock from '../assets/images/bottom-clock.png';
import BottomCenter from '../assets/images/bottom-center.png';
import BottomProfile from '../assets/images/bottom-profile.png';
import BottomWorld from '../assets/images/bottom-world.png';
import BottomHomeDark from '../assets/images/bottom-home-dark.png';
import BottomClockDark from '../assets/images/bottom-clock-dark.png';
import BottomCenterDark from '../assets/images/bottom-center-dark.png';
import BottomProfileDark from '../assets/images/bottom-profile-dark.png';
import BottomWorldDark from '../assets/images/bottom-world-dark.png';
import { ThemeContext } from '../context/ThemeContext';
import {useIsFocused} from '@react-navigation/native';
import MaroonSpinner from './Loader/MaroonSpinner';


const BottomMenu = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const currentScreenName =
    navigation.getState().routes[navigation.getState().index].name;
  console.log('My Screen Name ==> ', currentScreenName);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false); 

  const navigateWithLoading = (screenName) => {
    setIsLoading(true); // Set loading to true
    navigation.navigate(screenName); // Navigate to the desired screen
  };

  return (
    <View style={styles.menuUpperWrapper}>
    {isLoading && <MaroonSpinner />} 
      <View style={[styles.menuContainer, { backgroundColor: theme.menuItemBG }]}>
        <TouchableOpacity
          style={[
            styles.bottomTabWrapper,
            {
              backgroundColor: `${
                currentScreenName == 'MainPage'
                  ? theme.bottomButtonSelectedBG
                  : 'rgba(0,0,0,0)'
              }`,
            },
          ]}
          onPress={() => navigateWithLoading('MainPage')}>
          <Image
            style={styles.bottomTabImg}
            source={
              currentScreenName == 'MainPage'
                ? theme.name == 'theme3' ||
                  (theme.name == 'dark' && theme.type == 'dark')
                  ? BottomHomeDark
                  : BottomHome
                : theme.type == 'dark'
                ? BottomHome
                : BottomHomeDark
            }
            alt="icon"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bottomTabWrapper,
            {
              backgroundColor: `${
                currentScreenName == 'TransactionRecordScreen'
                  ? theme.bottomButtonSelectedBG
                  : 'rgba(0,0,0,0)'
              }`,
            },
          ]}
          onPress={() => navigateWithLoading('TransactionRecordScreen')}>
          <Image
            style={[styles.bottomTabImg,{marginRight:2}]}
            source={
              currentScreenName == 'TransactionRecordScreen'
                ? theme.name == 'theme3' ||
                  (theme.name == 'dark' && theme.type == 'dark')
                  ? BottomClockDark
                  : BottomClock
                : theme.type == 'dark'
                ? BottomClock
                : BottomClockDark
            }
            alt="icon"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.bottomTabWrapper,
          {
              backgroundColor: `${
                currentScreenName == 'Browser'
                  ? theme.bottomButtonSelectedBG
                  : 'rgba(0,0,0,0)'
              }`,
            },
        ]}
          onPress={() => navigateWithLoading('Browser')}>
          <Image
            style={styles.bottomTabImg}
            source={
              currentScreenName == 'Browser'
                ? theme.name == 'theme3' ||
                  (theme.name == 'dark' && theme.type == 'dark')
                  ? BottomCenterDark
                  : BottomCenter
                : theme.type == 'dark'
                ? BottomCenter
                : BottomCenterDark
            }
            alt="icon"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bottomTabWrapper,
            {
              backgroundColor: `${
                currentScreenName == 'PanCakeList'
                  ? theme.bottomButtonSelectedBG
                  : 'rgba(0,0,0,0)'
              }`,
            },
          ]}
          onPress={() => navigateWithLoading('PanCakeList')}>
          <Image
            style={[styles.bottomTabImg,{marginRight:2}]}
            source={
              currentScreenName == 'PanCakeList'
                ? theme.name == 'theme3' ||
                  (theme.name == 'dark' && theme.type == 'dark')
                  ? BottomWorldDark
                  : BottomWorld
                : theme.type == 'dark'
                ? BottomWorld
                : BottomWorldDark
            }
            alt="icon"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomTabWrapper]}
          onPress={() => navigateWithLoading('SettingsScreen')}>
          <Image
            style={styles.bottomTabImg}
            source={
              currentScreenName == 'SettingsScreen'
                ? theme.name == 'theme3' ||
                  (theme.name == 'dark' && theme.type == 'dark')
                  ? BottomProfileDark
                  : BottomProfile
                : theme.type == 'dark'
                ? BottomProfile
                : BottomProfileDark
            }
            alt="icon"
          />
        </TouchableOpacity>
       
      </View>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  menuUpperWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 1,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: '#362538',
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 60,
    paddingHorizontal: 10,
  },
  bottomTabWrapper: {
    width: 40,
    height: 40,
    padding: 8,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabImg: {
    width: '100%',
    height: '100%',
    marginBottom:4,
  },
});
