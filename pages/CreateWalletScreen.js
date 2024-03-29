import React, {useContext,useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import arrowLeft from '../assets/images/arrow-left.png';
import check from '../assets/images/check.png';
import bg from '../assets/images/createWalletBG.png';
import {ThemeContext} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateWalletScreen({navigation}) {
  const {theme} = useContext(ThemeContext);
  const {t} = useTranslation();
  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (selectedLanguage) {
          i18n.changeLanguage(selectedLanguage); 
        }
      } catch (error) {
        console.error('Error loading selected language:', error);
      }
    };
    loadSelectedLanguage();
  }, []);

  return (
    <ScrollView style={{backgroundColor: theme.screenBackgroud}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={arrowLeft} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.text}]}>{t('create_wallet')}</Text>
        <Image source={arrowLeft} style={{opacity: 0}} />
      </View>
      <View style={styles.bgImg}>
        <Image source={bg} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.textStyle, {color: theme.text, textAlign:'center'}]}>
        {t('the_only_crypto_wallet_youd_ever_need')}
        </Text>
        <View style={styles.promises}>
          <View
            style={[
              styles.promise,
              {
                borderColor: theme.promisBorder,
                backgroundColor: theme.promisBackground,
              },
            ]}>
            <Image source={check} />
            <Text style={{color: theme.text}}>
            {t('we_do_not_keep_a_copy_of_your_secret_key')}
            </Text>
          </View>
          {/* <View
            style={[
              styles.promise,
              {
                borderColor: theme.promisBorder,
                backgroundColor: theme.promisBackground,
              },
            ]}>
            <Image source={check} />
            <Text style={{color: theme.text}}>
            {t('we_do_not_keep_a_copy_of_your_secret_key')}
            </Text>
          </View> */}
          {/* <View
            style={[
              styles.promise,
              {
                borderColor: theme.promisBorder,
                backgroundColor: theme.promisBackground,
              },
            ]}>
            <Image source={check} />
            <Text style={{color: theme.text}}>
            {t('we_do_not_keep_a_copy_of_your_secret_key')}
            </Text>
          </View> */}
        </View>
        <TouchableOpacity
          style={[styles.buttonStyle, {borderColor: theme.buttonBorder}]}
          onPress={() => navigation.navigate('RecoveryPhraseScreen')}>
          <Text style={[styles.btnText, {color: theme.text}]}>{t('continue')}</Text>
        </TouchableOpacity>
        {/* <SubmitBtn
          title="Continue"
          onPress={() => navigation.navigate('RecoveryPhraseScreen')}
        /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 0,
  },
  title: {
    // color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  bgImg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  content: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 70,
    gap: 32,
  },
  textStyle: {
    // color: '#FFF',
    fontFamily: 'SF Pro Text',
    fontSize: 29,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  promises: {
    gap: 10,
  },
  promise: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: '#F43459',
    // backgroundColor: '#351739',
  },
  checkText: {
    // color: 'white',
  },
  buttonStyle: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    // gap: 12,
    // width: 360,
    // borderColor: '#FF003C',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 1000,
  },
  btnText: {
    textAlign: 'center',
    // color: '#FFF',
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
  },
});
