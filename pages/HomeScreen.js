import React, { useContext, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import bg from '../assets/images/bg.png';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { password } = useAuth();
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

  if (password) {
    navigation.navigate('LoginScreen');
  }

  return (
    <ScrollView style={{ backgroundColor: theme.screenBackgroud }}>
      <View style={{
        marginTop: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80,
      }}>
        <Image source={bg} />
      </View>
      <View style={{
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 70,
        gap: 32,
      }}>
        <Text style={{
          color: theme.text,
          fontSize: 29,
          fontWeight: '600',
          textAlign:'center'
        }}>
          {t('the_only_crypto_wallet_youd_ever_need')}
        </Text>
        <TouchableOpacity
          style={{
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderRadius: 1000,
            borderColor: theme.buttonBorder
          }}
          onPress={() => navigation.navigate('CreateWalletScreen')}>
          <Text style={{
            color: theme.text,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: '600'
          }}>Get Started</Text>
        </TouchableOpacity>
        <Text style={{
          color: theme.text,
          fontSize: 12,
          marginTop: -10,
          textAlign: 'center'
        }}>
        {t('by_tapping_get_started_you_agree_and_consent_to_our')}{' '}{'\n'}  
        <TouchableOpacity onPress={() => navigation.navigate('Term')}>
            <Text style={{
              textDecorationLine: 'underline',
              fontWeight: '600',
              fontSize: 11,
              marginTop: 4,
              color: theme.emphasis
            }}>
              {t('terms_&_service')}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              color: theme.text,
              fontSize: 11,
              marginTop:5,
              textAlign: 'center'
            }}>
              {'  '}{t('and')}{'  '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
              <Text style={{
                textDecorationLine: 'underline',
                fontWeight: '600',
                fontSize: 11,
                marginTop: 4,
                color: theme.emphasis
              }}>
                {t('privacy_policy')}
              </Text>
            </TouchableOpacity>
          </View>
        </Text>
      </View>
    </ScrollView>
  );
}
