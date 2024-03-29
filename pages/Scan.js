import React, { useContext, useState , useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { ThemeContext } from '../context/ThemeContext';
import Header from '../components/header';
import QrImage from '../assets/images/qr-image.png';
import { useAuth } from '../context/AuthContext';
import { getEVMBalance , getSolBalance } from '../utils/function';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubmitBtn from '../components/SubmitBtn';


const Scan = ({ navigation , route }) => {
  const { theme } = useContext(ThemeContext);
  const [isScanning, setIsScanning] = useState(false);
  const {wc, walletConnectUrl, selectedNetwork, Networks , selectedAccount } = useAuth();
  const [activeNet, setActiveNet] = useState()
  const [ballance, setBalance] = useState(0);

  const getNetworkactive = async () => {
    let data = await JSON.parse(selectedNetwork)
    setActiveNet(data)
  }

  useEffect(() => {
    getNetworkactive()
  }, [selectedNetwork, Networks])

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

  useEffect(() => {
    const getbls = async () => {
      if (activeNet?.type === "evm") {
        let data = await getEVMBalance(route?.params?.address.replace(/^"|"$/g, ''), activeNet?.nodeURL)
        setBalance(data?.balance)
      } else {
        let data = await getSolBalance(route?.params?.address.replace(/^"|"$/g, ''))
        setBalance(data?.balance)
      }
    }
    getbls()
    const intervalId = setInterval(getbls, 5000);
    console.log(ballance)
    return () => clearInterval(intervalId);
  }, [isScanning])


  const handleBarCodeRead = ({ type, data }) => {
    setIsScanning(false);
    const regex = /^wc:([0-9a-fA-F]+)@(\d+)\?relay-protocol=([^&]+)&symKey=([0-9a-fA-F]+)$/;
    const match = data.match(regex);
    if(match){
      navigation.navigate('MainPage', {
        qrData: data,
      });
    }else{
      navigation.navigate('Buy', {
        account: selectedAccount, network : activeNet,
        recepentAddress: data,
        amount:Number(ballance) 
      });
    }
    // walletConnectUrl(data)
    // console.log(type)
    // console.log(data);
  };

  return (
    <ScrollView style={[styles.mainWrapper, { backgroundColor: theme.screenBackgroud }]}>
      <Header title={t('scan_qr')} onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        {isScanning ? (
          <RNCamera
            style={styles.preview}
            onBarCodeRead={handleBarCodeRead}
            captureAudio={false}
          >
            <Text style={{ color: 'white' }}>{t('scan_your_qr_code')}</Text>
          </RNCamera>
        ) : (
          <>
          <View style={styles.scanImgWrapper}>
          <Image source={QrImage} />
           </View>
          <SubmitBtn
                title={t('scan_qr')}
                onPress={() => setIsScanning(true)}
                containerStyle={{ paddingHorizontal:70}}
              />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Scan;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  scanImgWrapper: {
    marginTop:100,
    marginBottom:40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding:'60%'
  },
  scanButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 50,
    alignSelf: 'center',
    margin: 70,
    bottom:0
  },
});
