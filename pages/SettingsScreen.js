import React, { useState, useContext, useEffect } from 'react';
import {
  Appearance,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/header';
import { ThemeContext } from '../context/ThemeContext';
import PrivateKeyModal from '../components/setting/PrivateKeyModal';
import { useAuth } from '../context/AuthContext';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { enrollFingerprint } from '../utils/BiometricUtils';
import RNFetchBlob from 'rn-fetch-blob';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import MaroonSpinner from '../components/Loader/MaroonSpinner';
import { decrypt , encrypt } from '../utils/function';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';


export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const { theme, switchTheme } = useContext(ThemeContext);
  const { selectedAccount , Accounts  , setSelectedAccount,addAccount ,selectedNetwork ,setNetworks,setSelectedNetwork} = useAuth()
  const [selectedAccountKey, setSelectedAccountKey] = useState()
  const [loader2 , setLoader2]= useState(false)
  const [activeNet, setActiveNet] = useState()
  const {t} = useTranslation();
  const [currency, setCurrency] = useState('USD $');
  const [name, setName] = useState('English');
  const [flag, setFlag] = useState(require('../assets/images/Eng.png'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Simulate loading settings or any other async operations
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Once settings are loaded, set isLoading to false
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setError(error); // Set error state if an error occurs
      }
    };

    loadSettings();
  }, []);

  // Render error message if an error occurs
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>An error occurred: {error.message}</Text>
      </View>
    );
  }
  
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
    const loadName = async () => {
      try {
        const Name = await AsyncStorage.getItem('selectedName');
        if (Name) {
          setName(Name);
        }
      } catch (error) {
        console.error('Error loading selected Name:', error);
      }
    };
    loadName();
  }, []);

  const handleName = async () => {
    try {
      const Name = await AsyncStorage.getItem('selectedName');
      if (Name) {
        setName(Name);
      }
    } catch (error) {
      console.error('Error loading selected Flag:', error);
    }
  };

  useEffect(() => {
    const loadFlag = async () => {
      try {
        const Name = JSON.parse(await AsyncStorage.getItem('selectedFlag'));

        if (Name) {
          setFlag(Name);
        }
      } catch (error) {
        console.error('Error loading selected Flag:', error);
      }
    };
    loadFlag();
  }, []);

  const handleFlag = async () => {
    try {
      const Name = JSON.parse(await AsyncStorage.getItem('selectedFlag'));

      if (Name) {
        setFlag(Name);
      }
    } catch (error) {
      console.error('Error loading selected Name:', error);
    }
  };

console.log("-----------flag",flag)
  useEffect(() => {
    const loadSelectedCurrency = async () => {
      try {
        const currencyName = await AsyncStorage.getItem('selectedCurrency');
        if (currencyName) {
          setCurrency(currencyName);
        }
      } catch (error) {
        console.error('Error loading selected currency:', error);
      }
    };
    loadSelectedCurrency();
  }, []);
  const handleCurrencyChange = async () => {
    try {
      const currencyName = await AsyncStorage.getItem('selectedCurrency');
      if (currencyName) {
        setCurrency(currencyName);
      }
    } catch (error) {
      console.error('Error loading selected currency:', error);
    }
  };
  // Subscribe to navigation focus event
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleCurrencyChange();
      handleName()
      handleFlag()
    });
    return unsubscribe;
  }, [navigation]);

  const getNetworkactive = async () => {
    let data = await JSON.parse(selectedNetwork)
    setActiveNet(data)
  }


  useEffect(() => {
    getNetworkactive()
  }, [selectedNetwork, setActiveNet])
  useEffect(() => {
    getNetworkactive()
  }, [])
  useEffect(() => {
    if (theme.type == 'light') {
      setDarkMode(false);
    } else setDarkMode(true);
  }, [theme.type]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSelectedAccountKey(selectedAccount);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [selectedAccount]);

  const validate = async (data) => {
    let retval = true
    for (let i = 0; i < Accounts.length; i++) {
        if (Accounts[i]?.evm?.address == data) {
            Toast.show({
                type: ALERT_TYPE.INFO,
                title: 'Already Exists',
                textBody: 'This account already exists.',
              })
            retval = false
        }
    }
    return retval
}
const validatebtc = async (data) => {
  let retval = true
  for (let i = 0; i < Accounts.length; i++) {
      if (Accounts[i]?.btc?.address == data) {
          Toast.show({
              type: ALERT_TYPE.INFO,
              title: 'Already Exists',
              textBody: 'This account already exists.',
            })
          retval = false
      }
  }
  return retval
}
const validatetron = async (data) => {
  let retval = true
  for (let i = 0; i < Accounts.length; i++) {
      if (Accounts[i]?.tron?.address == data) {
          Toast.show({
              type: ALERT_TYPE.INFO,
              title: 'Already Exists',
              textBody: 'This account already exists.',
            })
          retval = false
      }
  }
  return retval
}
const validatedoge = async (data) => {
  let retval = true
  for (let i = 0; i < Accounts.length; i++) {
      if (Accounts[i]?.doge?.address == data) {
          Toast.show({
              type: ALERT_TYPE.INFO,
              title: 'Already Exists',
              textBody: 'This account already exists.',
            })
          retval = false
      }
  }
  return retval
}
const validatesol = async (data) => {
    let retval = true
    for (let i = 0; i < Accounts.length; i++) {
        if (Accounts[i]?.solana?.publicKey == data) {
            Toast.show({
                type: ALERT_TYPE.INFO,
                title: 'Already Exists',
                textBody: 'This account already exists.',
              })
            retval = false
        }
    }
    return retval
}

  const pickFileAndLog = async () => {
    setLoader2(true)
    try {
      // Pick a single file
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('URI : ' + res[0].uri);
      console.log('Type : ' + res[0].type); // mime type
      console.log('File Name : ' + res[0].name);
      console.log('File Size : ' + res[0].size);

      // Assuming it's a json file and you want to log its contents
      if (res[0].type === "application/json") {
        console.log(res[0].uri)
        // Read the file content
        RNFetchBlob.fs.readFile(res[0].uri, 'utf8')
          .then(async (data) => {
            // Here you have your file content as a string
            const jsonData = JSON.parse(data);

            let decryptdata = await decrypt(jsonData?.backup)
            if(decryptdata){
              let dogeAlready =  await validatedoge(decryptdata.doge.address)
              let tronAlready =  await validatetron(decryptdata.tron.address)
              let btcAlready =  await validatebtc(decryptdata.btc.address)
              let evmAlready =  await validate(decryptdata.evm.address)
              let solAlready = await validatesol(decryptdata.solana.publicKey)
  
              console.log(evmAlready , solAlready)
  
                if(evmAlready && solAlready && dogeAlready && tronAlready && btcAlready){
                  const account_data = {
                    solana : decryptdata.solana,
                    evm : decryptdata.evm,
                    doge : decryptdata.doge,
                    tron : decryptdata.tron,
                    btc : decryptdata.btc
                  }
                  setSelectedAccount(account_data)
                  await AsyncStorage.setItem('selectedAccount', JSON.stringify(account_data));
                  await AsyncStorage.setItem('Accounts', JSON.stringify([account_data]));
                  addAccount(account_data)
                  setLoader2(false)
                  navigation.navigate('MainPage')
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Backup Success',
                    textBody: 'Wallet Backup Successfully',
                  })
                }else if(solAlready){
                  Toast.show({
                    type: ALERT_TYPE.INFO,
                    title: 'Already Exist',
                    textBody: 'EVM Account Already Exist',
                  })
                  
                  const account_data = {
                    solana: decryptdata.solana,
                    evm: { address: "Account Not Available....", privateKey: "----" },
                    btc :  { address: "Account Not Available....", privateKey: "----" },
                    doge :  { address: "Account Not Available....", privateKey: "----" },
                    tron : { address: "Account Not Available....", privateKey: "----" }
                }
                  setSelectedAccount(account_data)
                  await AsyncStorage.setItem('selectedAccount', JSON.stringify(account_data));
                  await AsyncStorage.setItem('Accounts', JSON.stringify([account_data]));
                  addAccount(account_data)
                  setLoader2(false)
                  navigation.navigate('MainPage')
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Backup Success',
                    textBody: 'Solana Account Backup Successfully',
                  })
              
                }else if(evmAlready){
                    Toast.show({
                      type: ALERT_TYPE.INFO,
                      title: 'Already Exist',
                      textBody: 'Solana Account Already Exist',
                    })
                    const account_data = {
                      solana: { publicKey: "Account Not Available", secretKey: "----" },
                      evm: decryptdata.evm,
                      btc :  { address: "Account Not Available....", privateKey: "----" },
                      tron:  { address: "Account Not Available....", privateKey: "----" },
                      doge :  { address: "Account Not Available....", privateKey: "----" }
                  }
                    setSelectedAccount(account_data)
                    await AsyncStorage.setItem('selectedAccount', JSON.stringify(account_data));
                    await AsyncStorage.setItem('Accounts', JSON.stringify([account_data]));
                    addAccount(account_data)
                    setLoader2(false)
                    navigation.navigate('MainPage')
                    Toast.show({
                      type: ALERT_TYPE.SUCCESS,
                      title: 'Backup Success',
                      textBody: 'Evm Account Backup Successfully',
                    })
                }else if(btcAlready){
                  Toast.show({
                    type: ALERT_TYPE.INFO,
                    title: 'Already Exist',
                    textBody: 'Solana Account Already Exist',
                  })
                  const account_data = {
                    solana: { publicKey: "Account Not Available", secretKey: "----" },
                    evm: { address: "Account Not Available....", privateKey: "----" },
                    btc :  decryptdata.btc,
                    tron:  { address: "Account Not Available....", privateKey: "----" },
                    doge :  { address: "Account Not Available....", privateKey: "----" }
                }
                  setSelectedAccount(account_data)
                  await AsyncStorage.setItem('selectedAccount', JSON.stringify(account_data));
                  await AsyncStorage.setItem('Accounts', JSON.stringify([account_data]));
                  addAccount(account_data)
                  setLoader2(false)
                  navigation.navigate('MainPage')
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Backup Success',
                    textBody: 'Evm Account Backup Successfully',
                  })
                }else if(tronAlready){
                  Toast.show({
                    type: ALERT_TYPE.INFO,
                    title: 'Already Exist',
                    textBody: 'Solana Account Already Exist',
                  })
                  const account_data = {
                    solana: { publicKey: "Account Not Available", secretKey: "----" },
                    evm: { address: "Account Not Available....", privateKey: "----" },
                    btc : { address: "Account Not Available....", privateKey: "----" },
                    tron:   decryptdata.tron,
                    doge :  { address: "Account Not Available....", privateKey: "----" }
                }
                  setSelectedAccount(account_data)
                  await AsyncStorage.setItem('selectedAccount', JSON.stringify(account_data));
                  await AsyncStorage.setItem('Accounts', JSON.stringify([account_data]));
                  addAccount(account_data)
                  setLoader2(false)
                  navigation.navigate('MainPage')
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Backup Success',
                    textBody: 'Evm Account Backup Successfully',
                  })
                
                }else if(dogeAlready){
                  Toast.show({
                    type: ALERT_TYPE.INFO,
                    title: 'Already Exist',
                    textBody: 'Solana Account Already Exist',
                  })
                  const account_data = {
                    solana: { publicKey: "Account Not Available", secretKey: "----" },
                    evm: { address: "Account Not Available....", privateKey: "----" },
                    btc : { address: "Account Not Available....", privateKey: "----" },
                    tron:  { address: "Account Not Available....", privateKey: "----" },
                    doge : decryptdata.doge
                }
                  setSelectedAccount(account_data)
                  await AsyncStorage.setItem('selectedAccount', JSON.stringify(account_data));
                  await AsyncStorage.setItem('Accounts', JSON.stringify([account_data]));
                  addAccount(account_data)
                  setLoader2(false)
                  navigation.navigate('MainPage')
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Backup Success',
                    textBody: 'Evm Account Backup Successfully',
                  })
                
                }else{
                    setLoader2(false)
                    Toast.show({
                      type: ALERT_TYPE.INFO,
                      title: 'Already Exist',
                      textBody: 'Wallet Already Exist',
                    })
                }
            }else{
              setLoader2(false)
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Backup Failed',
                textBody: 'File is not valid.',
              })
            }
    
            
          })
          .catch((error) => {
            Toast.show({
              type: ALERT_TYPE.WARNING,
              title: 'Backup Failed',
              textBody: 'Failed to read file',
            })
            setLoader2(false)
          });
        // const response = await fetch(res[0].uri);
        // const json = await response.json();
        
        // // Log the JSON content
        // console.log(json);
      } else {
        setLoader2(false)
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Backup Failed',
          textBody: 'Please select Backup file.',
        })
      }
    } catch (err) {
      setLoader2(false)
      if (DocumentPicker.isCancel(err)) {
        // User canceled the picker
        console.log('User canceled the file picker');
      } else {
        throw err;
      }
    }
  };
  return (
    <View style={{flex: 1, backgroundColor:theme.screenBackgroud}}>
    <SafeAreaView >
      <ScrollView style={{ backgroundColor: theme.screenBackgroud }}>
        <Header
          title={t('settings')}
          skipOption={false}
          onBack={() => navigation.goBack()}
        />
        <View style={[styles.container]}>
        {isLoading ? ( // Show loader if isLoading is true
        <MaroonSpinner />
      ) : (
        <>
          <View style={styles.Menu}>
            <Text style={[styles.header, { color: theme.text }]}>{t('themes')}</Text>
            <View
              style={[styles.menuItemBig, { backgroundColor: theme.menuItemBG }]}>
              <View style={styles.leftItem}>
              <Image
    source={
      theme.type == 'dark'
        ? require('../assets/modew.png')
        : require('../assets/modeb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                <Text style={[styles.menuItemText, { color: theme.text }]}>
                {t('mode')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setDarkMode(!darkMode);
                  theme.type == 'dark'
                    ? switchTheme('theme2')
                    : switchTheme('theme1');
                }}
                style={[
                  styles.rightItem,
                  { backgroundColor: theme.rightArrowBG },
                ]}>
                <View
                  style={
                    darkMode ? [{ backgroundColor: theme.mode }, styles.mode] : ''
                  }>
                  <Image source={require('../assets/images/moon.png')} />
                </View>
                <View
                  style={
                    !darkMode
                      ? [{ backgroundColor: theme.mode }, styles.mode]
                      : ''
                  }>
                  <Image source={require('../assets/images/sun.png')} />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ThemesScreen')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/themew.png')
        : require('../assets/themeb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('themes')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.Menu}>
            <Text style={[styles.header, { color: theme.text }]}>{t('general')}</Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Themes')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/wallet.png')
                        : require('../assets/images/wallet-dark.png')
                    }
                  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    Connect Wallet
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/createw.png')
        : require('../assets/createb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('create_new_account')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ImportWallet')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
               <View style={styles.leftItem}>
               <Image
    source={
      theme.type == 'dark'
        ? require('../assets/importaccountb.png')
        : require('../assets/importaccount.png')
    }
    style={{ width: 22, height: 22 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('import_account')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AccountList')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
  <Image
    source={
      theme.type == 'dark'
        ? require('../assets/manageaccount.png')
        : require('../assets/manageb.png')
    }
    style={{ width: 25, height: 25 }} // Adjust the width and height as needed
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('manage_account')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            {activeNet?.type == 'solana'  && (
            <TouchableOpacity onPress={() => navigation.navigate('AddToken')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/importw.png')
        : require('../assets/importb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('import_token_network')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
              
            </TouchableOpacity>
            )}
             {activeNet?.type == 'evm' && (
            <TouchableOpacity onPress={() => navigation.navigate('AddToken')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/importw.png')
        : require('../assets/importb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('import_token_network')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Networks')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
  <Image
    source={
      theme.type == 'dark'
        ? require('../assets/networkw.png')
        : require('../assets/networkb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('networks')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            {selectedAccountKey?.solana?.secretKey != "----" && <PrivateKeyModal privateKey={selectedAccountKey?.solana?.secretKey} label="Solana" />}
            {selectedAccountKey?.evm?.privateKey != "----" && <PrivateKeyModal privateKey={selectedAccountKey?.evm?.privateKey} label="Evm" />}
            {selectedAccountKey?.btc?.privateKey != "----" && <PrivateKeyModal privateKey={selectedAccountKey?.btc?.privateKey} label="Bitcoin" />}
            {selectedAccountKey?.tron?.privateKey != "----" && <PrivateKeyModal privateKey={selectedAccountKey?.tron?.privateKey} label="TRON" />}
            {selectedAccountKey?.doge?.privateKey != "----" && <PrivateKeyModal privateKey={selectedAccountKey?.doge?.privateKey} label="Dogechain" />}
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPasswordScreen')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/passwordw.png')
        : require('../assets/passwordb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('reset_password')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => await enrollFingerprint()}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/biometricw.png')
        : require('../assets/biometricb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('set_biometric_verification')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            {loader2 ? <MaroonSpinner />
             : 
            <TouchableOpacity onPress={() => pickFileAndLog()}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
  <Image
    source={
      theme.type == 'dark'
        ? require('../assets/restorew.png')
        : require('../assets/restoreb.png')
    }
    style={{ width: 25, height: 25 }} // Adjust the width and height as needed
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('restore_backup')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => navigation.navigate('CurrencyScreen')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/currencyw.png')
        : require('../assets/currencyb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('currency')}
                  </Text>
                </View>

                <View style={[styles.rightItemWithText, { color: theme.text }]}>
                  <Text style={[styles.rightItemText, { color: theme.text }]}>
                    {currency}
                  </Text>
                  <View
                    style={[
                      styles.rightItem,
                      { backgroundColor: theme.rightArrowBG },
                    ]}>
                    <View
                      style={[
                        styles.rightArrow,
                        { backgroundColor: theme.rightArrowBG },
                      ]}>
                      <Image
                        source={
                          theme.type == 'dark'
                            ? require('../assets/images/arrow-right.png')
                            : require('../assets/images/arrow-right-dark.png')
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('LanguageScreen')}>
              <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/languagew.png')
        : require('../assets/languageb.png')
    }
    style={{ width: 25, height: 29 }} 
  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {t('language')}
                  </Text>
                </View>

                <View style={[styles.rightItemWithText, { color: theme.text }]}>
                  <Image source={flag} />
                  <Text style={[styles.rightItemText, { color: theme.text }]}>
                  {name}
                  </Text>
                  <View
                    style={[
                      styles.rightItem,
                      { backgroundColor: theme.rightArrowBG },
                    ]}>
                    <View
                      style={[
                        styles.rightArrow,
                        { backgroundColor: theme.rightArrowBG },
                      ]}>
                      <Image
                        source={
                          theme.type == 'dark'
                            ? require('../assets/images/arrow-right.png')
                            : require('../assets/images/arrow-right-dark.png')
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Themes')}>
              {/* <View
                style={[
                  styles.menuItemBig,
                  { backgroundColor: theme.menuItemBG },
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/gift.png')
                        : require('../assets/images/gift-dark.png')
                    }
                  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    Invite Friends
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    { backgroundColor: theme.rightArrowBG },
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View> */}
            </TouchableOpacity>
          </View>
          <View style={styles.Menu}>
            <Text style={[styles.header, {color: theme.text}]}>Others</Text>
            <TouchableOpacity>
              <View
                style={[
                  styles.menuItemBig,
                  {backgroundColor: theme.menuItemBG},
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/ratew.png')
        : require('../assets/rateb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, {color: theme.text}]}>
                  {t('rate_our_app')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    {backgroundColor: theme.rightArrowBG},
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Help')}>
              <View
                style={[
                  styles.menuItemBig,
                  {backgroundColor: theme.menuItemBG},
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/customerw.png')
        : require('../assets/customerb.png')
    }
    style={{ width: 25, height: 25 }} 
  />
                  <Text style={[styles.menuItemText, {color: theme.text}]}>
                  {t('customer_support')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    {backgroundColor: theme.rightArrowBG},
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
              <View
                style={[
                  styles.menuItemBig,
                  {backgroundColor: theme.menuItemBG},
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/aboutw.png')
        : require('../assets/aboutb.png')
    }
    style={{ width: 29, height: 29 }} 
  />
                  <Text style={[styles.menuItemText, {color: theme.text}]}>
                  {t('about_app')}
                  </Text>
                </View>

                <View style={[styles.rightItemWithText, {color: theme.text}]}>
                  <Text style={[styles.rightItemText, {color: theme.text}]}>
                    v4.30.0
                  </Text>
                  <View
                    style={[
                      styles.rightItem,
                      {backgroundColor: theme.rightArrowBG},
                    ]}>
                    <View
                      style={[
                        styles.rightArrow,
                        {backgroundColor: theme.rightArrowBG},
                      ]}>
                      <Image
                        source={
                          theme.type == 'dark'
                            ? require('../assets/images/arrow-right.png')
                            : require('../assets/images/arrow-right-dark.png')
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={[
                  styles.menuItemBig,
                  {backgroundColor: theme.menuItemBG},
                  styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                <Image
    source={
      theme.type == 'dark'
        ? require('../assets/sharew.png')
        : require('../assets/shareb.png')
    }
    style={{ width: 22, height: 22 }} 
  />
                  <Text style={[styles.menuItemText, {color: theme.text}]}>
                  {t('share_app')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rightArrow,
                    {backgroundColor: theme.rightArrowBG},
                  ]}>
                  <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/images/arrow-right.png')
                        : require('../assets/images/arrow-right-dark.png')
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
    </>  )}
        </View>
      </ScrollView>
    </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  // screen: {
  //   // backgroundColor: '#280D2C',
  // },
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  Menu: {
    marginVertical: 12,
  },
  header: {
    // color: '#FFF',
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  menuItemBig: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    // backgroundColor: '#362538',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 14,
  },
  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 100,
    // backgroundColor: '#4E3B51',
    padding: 4,
  },
  rightItemWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    // color: '#FFF',
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  rightItemText: {
    // backgroundColor: '#362538',
    // color: "white"
  },
  menuItemText: {
    // color: '#FFF',
    marginLeft: 12,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  mode: {
    borderRadius: 1000,
    // backgroundColor: '#F43459',
    padding: 4,
  },
  rightArrow: {
    width: 20,
    height: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 1000,
    // backgroundColor: '#4E3B51',
  },
});
