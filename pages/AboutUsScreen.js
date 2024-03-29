import React, { useContext, useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import bg from '../assets/images/bg.png';
import { ThemeContext } from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutUsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const {t} = useTranslation();
  useEffect(() => {
    // Load selected language if needed
    const loadSelectedLanguage = async () => {
      try {
        // Code for loading language
      } catch (error) {
        console.error('Error loading selected language:', error);
      }
    };
    loadSelectedLanguage();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.screenBackgroud }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
        <Image source={bg} />
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 300 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: theme.text }}>
         {t('About_BTX_Wallet')}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 10, textAlign: 'left', marginLeft: 20, color: theme.text }}>
          <Text style={{ marginRight: 10 }}>• </Text>{t('BTX_Wallet_is_a_secure_digital_wallet_designed_for_managing_your_BTX_(Bitcore)_cryptocurrency')}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 10, textAlign: 'left', marginLeft: 20, color: theme.text }}>
          <Text style={{ marginRight: 10 }}>• </Text> {t('With_BTX_Wallet,_you_can_send,_receive,_and_store_BTX_tokens_safely_and_conveniently')}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 10, textAlign: 'left', marginLeft: 20, color: theme.text }}>
          <Text style={{ marginRight: 10 }}>• </Text> {t('Our_goal_is_to_provide_users_with_a_seamless_and_user-friendly_experience_for_managing_their_BTX_holdings')}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 10, textAlign: 'left', marginLeft: 20, color: theme.text }}>
          <Text style={{ marginRight: 10 }}>• </Text> {t('BTX_Wallet_ensures_the_security_of_your_funds_through_advanced_encryption_and_authentication_mechanisms')}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 10, textAlign: 'left', marginLeft: 20, color: theme.text }}>
          <Text style={{ marginRight: 10 }}>• </Text> {t('Experience_the_power_of_BTX_Wallet_and_take_full_control_of_your_Bitcore_holdings_today')}
        </Text>

        {/* Add more information about BTX Wallet here */}
        
        <TouchableOpacity
          style={{ marginTop: 10, paddingVertical: 14, paddingHorizontal: 112, borderStyle: 'solid', borderWidth: 1, borderRadius: 1000, borderColor: theme.buttonBorder }}
          onPress={() => navigation.goBack()}>
          <Text style={{ textAlign: 'center', fontFamily: 'SF Pro Text', fontSize: 14, fontWeight: '600', color: theme.text }}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
