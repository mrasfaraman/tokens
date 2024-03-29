import React, {useContext, useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import eye from '../assets/images/eye-slash.png';
import eyeDark from '../assets/images/eye-slash-dark.png';
import lock from '../assets/images/lock.png';
import lockDark from '../assets/images/lock-dark.png';
import SubmitBtn from '../components/SubmitBtn';
import Header from '../components/header';
import {ThemeContext} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetPasswordScreen({navigation}) {
  const {theme} = useContext(ThemeContext);
  const { password: currentPassword, savePassword } = useAuth();

  const [showPreviousPassword, setShowPreviousPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [previousPasswordInput, setPreviousPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [error, setError] = useState('');
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
  
  function handleSubmit() {
    // Check if any of the password fields are blank
    if (
      previousPasswordInput.trim() === '' ||
      passwordInput.trim() === '' ||
      confirmPasswordInput.trim() === ''
    ) {
      setError('All password fields are required.');
      return;
    }

    // Check if the previous password matches the current password
    if (previousPasswordInput !== currentPassword) {
      setError('Current password is incorrect.');
      return;
    }

    // Password complexity check
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(passwordInput)) {
      setError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.'
      );
      return;
    }

    // Password match check
    if (passwordInput !== confirmPasswordInput) {
      setError('Passwords do not match!');
      return;
    }

    // Save password and navigate
    savePassword(passwordInput);
    navigation.navigate('MainPage');
  }

  return (
    <ScrollView style={{backgroundColor: theme.screenBackgroud}}>
      <Header
        title={t('reset_password')}
        // skipOption={true}
        // onSkip={() => {
        //   navigation.navigate('Home');
        // }}
        onBack={() => navigation.goBack()}
      />
      <View style={[styles.content, styles.textContainer]}>
        <Text style={[styles.textStyle, {color: theme.text}]}>
        {t('reset_password')}
        </Text>
        <Text
          style={[styles.textStyle, styles.instruction, {color: theme.text}]}>
        {t('set_your_new_password')}
        </Text>
      </View>
      <View
        style={[
          styles.input,
          {
            // backgroundColor: theme.textInputBG,

            borderColor: theme.addButtonBorder,
            borderWidth: 1,
          },
        ]}>
        <View style={styles.inputLock}>
          <Image source={theme.type == 'dark' ? lock : lockDark} />
          <TextInput
            style={styles.placeHolderText}
            placeholder={t('current_password')}
            placeholderTextColor={theme.placeholderTextColor}
            onChangeText={newText => setPreviousPasswordInput(newText)}
            defaultValue={previousPasswordInput}
            secureTextEntry={showPreviousPassword}
          />
        </View>
        <TouchableOpacity
          onPress={() => setShowPreviousPassword(!showPreviousPassword)}>
          <Image source={theme.type == 'dark' ? eye : eyeDark} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.input,
          {
            // backgroundColor: theme.textInputBG,

            borderColor: theme.addButtonBorder,
            borderWidth: 1,
          },
        ]}>
        <View style={styles.inputLock}>
          <Image source={theme.type == 'dark' ? lock : lockDark} />
          <TextInput
            style={styles.placeHolderText}
            placeholder={t('set_password_(8_characters)')}

            placeholderTextColor={theme.placeholderTextColor}
            onChangeText={newText => setPasswordInput(newText)}
            defaultValue={passwordInput}
            secureTextEntry={showPassword}
          />
        </View>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={theme.type == 'dark' ? eye : eyeDark} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.input,
          {
            // backgroundColor: theme.textInputBG,
            justifyContent: 'space-between',
            borderColor: theme.addButtonBorder,
            borderWidth: 1,
          },
        ]}>
        <View style={styles.inputLock}>
          <Image source={theme.type == 'dark' ? lock : lockDark} />
          <TextInput
            style={[styles.placeHolderText ,{width:'100%'}]}
            placeholder={t('confirm_password')}

            placeholderTextColor={theme.placeholderTextColor}
            onChangeText={newText => setConfirmPasswordInput(newText)}
            defaultValue={confirmPasswordInput}
            secureTextEntry={showConfirmPassword}
          />
        </View>
        
        <TouchableOpacity
        style={{alignItems:'right' , justifyContent:'flex-end', paddingLeft:40}} 
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image source={theme.type == 'dark' ? eye : eyeDark} />
        </TouchableOpacity>
      </View>
      <View>
          {error && (
            <Text style={[{color: theme.emphasis, textAlign: 'center', padding:10}]}>
              ! {error}
            </Text>
          )}
        </View>

      <SubmitBtn
        title={t('reset_password')}
        // onPress={() => navigation.navigate('Verification')}
        onPress={() => handleSubmit()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // screen: {
  //   backgroundColor: '#280D2C',
  // },

  content: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 70,
    gap: 32,
  },
  textContainer: {
    gap: 0,
    marginBottom: 30,
    textAlign: 'center',
  },
  textStyle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    // color: '#FFF',
    fontFamily: 'SF Pro Text',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    marginTop: 15,
  },
  instruction: {
    // marginTop: 0,
    fontSize: 14,
    fontWeight: '400',
    marginTop: 12,
  },
  input: {
    flexDirection: 'row',
    // backgroundColor: '#351739',
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
});
