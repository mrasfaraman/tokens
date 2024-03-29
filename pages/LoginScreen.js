import CheckBox from '@react-native-community/checkbox';
import React, { useState, useContext, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import eye from '../assets/images/eye-slash.png';
import eyeDark from '../assets/images/eye-slash-dark.png';
import lock from '../assets/images/lock.png';
import lockDark from '../assets/images/lock-dark.png';
import SubmitBtn from '../components/SubmitBtn';
import Header from '../components/header';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authenticateFingerprint } from '../utils/BiometricUtils';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

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

  const { theme } = useContext(ThemeContext);
  const { password, savePassword } = useAuth();

  function handleSubmit() {
    if (password !== passwordInput) {
      return setError('Password does not match!');
    }
    return navigation.navigate('MainPage');
  }

  async function handleSubmitfingerprint() {
    let fingerprint = await authenticateFingerprint()
    console.log(fingerprint)
    if (fingerprint) {
      navigation.navigate('MainPage')
    }
  }

  useEffect(() => {
    if (password == null || password == undefined || password == '') {
      return navigation.navigate('Home');
    }
    handleSubmitfingerprint()
  }, [password])

  return (
    <ScrollView style={{ backgroundColor: theme.screenBackgroud, flex: 1 }}>
      <View style={{ alignItems: 'center', marginTop: '10%', marginTop:'50%' }}>
        <Image
          source={
            theme.type == 'dark'
              ? require('../assets/btxw.png')
              : require('../assets/btxb.png')
          }
          style={{ width: '40%', height: 70, resizeMode: 'contain' }}
        />
      </View>
      <View style={[styles.content, styles.textContainer]}>
        <Text style={[styles.textStyle, { color: theme.text }]}>{t('sign_in')}</Text>
        <Text style={[styles.textStyle, styles.instruction, { color: theme.text }]}>
          {t('sign_in_to_continue')}
        </Text>
      </View>
      <View style={[
        styles.input,
        {
          borderColor: theme.addButtonBorder,
          borderWidth: 1,
        },
      ]}>
        <View style={styles.inputLock}>
          <Image source={theme.type == 'dark' ? lock : lockDark} />
          <TextInput
            style={{ color: theme.text }}
            placeholder={t('password')}
            placeholderTextColor={theme.text}
            onChangeText={newText => setPasswordInput(newText)}
            defaultValue={passwordInput}
            secureTextEntry={showPassword}
          />
        </View>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={theme.type == 'dark' ? eye : eyeDark} />
        </TouchableOpacity>
      </View>
      <View>
        {error && (
          <Text style={[{ color: theme.emphasis, textAlign: 'center' }]}>
            ! {error}
          </Text>
        )}
      </View>
      <SubmitBtn
        title={t('login')}
        onPress={() => handleSubmit()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
  },
  textContainer: {
    gap: 0,
    marginBottom: 10,
    textAlign: 'center',
  },
  textStyle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'SF Pro Text',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    marginTop: 15,
  },
  instruction: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 12,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingVertical: 5,
    justifyContent: 'space-between',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  inputLock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '80%',
  },
  placeHolderColor: {
    color: 'white',
  },
  checkInput: {
    // backgroundColor: '#280D2C',
    marginHorizontal: 0,
    justifyContent: 'flex-start',
  },
  checkText: {
    // color: '#FFF',
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginLeft: 10,
  },
  emphasis: {
    // color: '#F43459',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
