import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import Header from '../components/header';
import SwapCurrencyIcon from '../assets/images/swap_currency_icon.png';
import SwapCurrencyBtc from '../assets/images/swap_btc.png';
import SwapDrop from '../assets/images/swap_drop.png';
import SwapingIcon from '../assets/images/swaping_icon.png';
import SwapingIconDark from '../assets/images/swaping_icon_dark.png';
import ChooseChannel from '../components/ChooseChannel';
import {ThemeContext} from '../context/ThemeContext';
import SubmitBtn from '../components/SubmitBtn';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaroonSpinner from '../components/Loader/MaroonSpinner';
import {useAuth} from '../context/AuthContext';

import {
  getUSDamount,
  importEVMToken,
  importSolToken,
  bridge_emv_tron,
  bridge_gas_emv_tron,
  bridge_tron
} from '../utils/function';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const Stable_Tokens = [
  //Tron
  {
    balance: '0',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    coingekoId: 'tether',
    rpc: 'https://api.trongrid.io',
    decimals: 6,
    logo: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707',
    name: 'Tether',
    symbol: 'USDT',
  },
  
  {
  balance: "0",
  coingeckoId: "usd-coin",
  decimals: 6,
  logo: "https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
  name: "USD Coin", 
  rpc: "https://api.trongrid.io",
  symbol: "USDC",
  token_address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
  totalSupply: {"hex": "0x970e698d2f1a", "type": "BigNumber"}, "wallet_address": "TAy2wJMwTVV1wq6YB2hZEhQfSr2G17JkcP"}
  ,

  //Solana
  {
    balance: '0.',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    coingekoId: 'usd-coin',
    rpc: 'https://api.mainnet-beta.solana.com',
    decimals: 6,
    logo: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    name: 'USDC',
    symbol: 'usdc',
  },
  // Binance Smart

  // {
  //   balance: '0.',
  //   coingekoId: 'wbnb',
  //   decimals: '18',
  //   logo: 'https://assets.coingecko.com/coins/images/12591/large/binance-coin-logo.png?1696512401',
  //   name: 'Wrapped BNB',
  //   rpc: 'https://bsc.publicnode.com',
  //   symbol: 'WBNB',
  //   token_address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  //   wallet_address: '0xeB537669D85b53435D0fFb87CE425FF5B182e419',
  // },
 
  {
    balance: '0.',
    coingekoId: 'Tether USD',
    decimals: '18',
    logo: 'https://imgs.search.brave.com/azckPbVeZfKZarKX3sh6Qc7Ih61VJE-Y3VFbJVfttT0/rs:fit:40:40:1/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY29pbmdlY2tv/LmNvbS9jb2lucy9p/bWFnZXMvMzI1L2xh/cmdlL1RldGhlci5w/bmc_MTY5NjUwMTY2/MQ',
    name: 'Tether USD',
    rpc: 'https://bsc.publicnode.com',
    symbol: 'USDT',
    token_address: '0x55d398326f99059fF775485246999027B3197955',
    wallet_address: '0xeB537669D85b53435D0fFb87CE425FF5B182e419',
  },

  //Ethereum

  {
    balance: '0.',
    coingekoId: 'tether',
    decimals: '6',
    logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
    name: 'Tether',
    rpc: 'https://eth.drpc.org',
    symbol: 'USDT',
    token_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    wallet_address: '0xeB537669D85b53435D0fFb87CE425FF5B182e419',
  },
  {
    balance: '0.',
    coingekoId: 'usd-coin',
    decimals: '6',
    name: 'USDC',
    logo: 'https://imgs.search.brave.com/N2fP45Mz-teafsRRVVLC8NlPpRdDhC2dTEedA6UVEbo/rs:fit:40:40:1/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY29pbmdlY2tv/LmNvbS9jb2lucy9p/bWFnZXMvNjMxOS9s/YXJnZS91c2RjLnBu/Zz8xNjk2NTA2Njk0',
    rpc: 'https://eth.drpc.org',
    symbol: 'USDC',
    token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    wallet_address: '0xeB537669D85b53435D0fFb87CE425FF5B182e419',
  },
];

const Bridging = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const {t} = useTranslation();

  const {
    wc,
    wallet,
    setWeb3Wallet,
    Session,
    saveSession,
    selectedAccount,
    setSelectedAccount,
    Accounts,
    addAccount,
    Networks,
    selectedNetwork,
    Tokens,
    removeToken,
  } = useAuth();

  const [address, setAddress] = useState();
  const [activeNet, setActiveNet] = useState();
  const [activeAccount, setActiveAccount] = useState();
  const [loading, setLoading] = useState(false);

  const [modalVisibleTokenUp, setModalVisibleTokenUp] = useState(false);
  const [modalVisibleTokenDown, setModalVisibleTokenDown] = useState(false);

  const [modalVisibleNetworkUp, setModalVisibleNetworkUp] = useState(false);
  const [modalVisibleNetworkDown, setModalVisibleNetworkDown] = useState(false);

  const [slectedNetUp, setSelectedNetUp] = useState(null);
  const [slectedNetDown, setSelectedNetDown] = useState();

  const [topToken, setTopToken] = useState(null);
  const [bottomToken, setBottomToken] = useState(null);

  const [loadingValueUp, setLoadingValueUp] = useState(false);
  const [loadingValueDown, setLoadingValueDown] = useState(false);

  const [inputUp, setinputUp] = useState('');
  const [inputDown, setinputDown] = useState('');

  const [ballanceUp, setBalanceUp] = useState(0);
  const [ballanceDown, setBalanceDown] = useState(0);

  const [topValueUsd, setTopUSDValue] = useState();
  const [bottomValueUsd, setBottomUSDValue] = useState();

  const [bottomRecepentAddress, setBottomRecepentAddress] = useState('');

  const onMaxValue = async () => {
    if (slectedNetUp?.type == 'evm') {
      setinputUp(Number(ballanceUp)?.toFixed(3)?.toString());
      console.log(Number(ballanceUp), '*', bottomValueUsd?.amount);
      let calculate = topValueUsd?.amount * Number(ballanceUp);
      let multiply;
      if (calculate >= 1) {
        multiply = Number(calculate * bottomValueUsd?.amount);
      } else {
        console.log('sadsad');
        multiply = Number(calculate / bottomValueUsd?.amount);
      }
      console.log(multiply);
      setinputDown(multiply.toString());
    } else {
    }
  };
  const gettokenUsdValueTop = async (topToken, slectedNetUp) => {
    if (slectedNetUp?.type == 'evm') {
      setLoadingValueUp(true);
      try {
        let top = await getUSDamount(topToken?.symbol);
        setTopUSDValue(top?.data);
        let getBalance = await importEVMToken(
          address.replace(/^"|"$/g, ''),
          slectedNetUp?.nodeURL,
          slectedNetUp?.networkName,
          topToken?.address || topToken?.token_address,
        );
        if (getBalance) {
          setBalanceUp(getBalance?.token?.balance || getBalance?.data?.balance);
        } else {
          setBalanceUp(0);
        }
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>GET BALANCE',
          getBalance?.token?.balance || getBalance?.data?.balance,
        );
        console.log('top', top?.data?.amount);
        setLoadingValueUp(false);
      } catch (error) {
        setLoadingValueUp(false);
      }
    } else {
      setLoadingValueUp(true);
      try {
        let top = await getUSDamount(topToken?.symbol);
        setTopUSDValue(top?.data);
        let getBalance = await importSolToken(
          address?.replace(/^"|"$/g, ''),
          topToken?.address || topToken?.token_address,
        );
        if (getBalance) {
          setBalanceUp(getBalance?.token?.balance);
        } else {
          setBalanceUp(0);
        }
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>GET BALANCE',
          getBalance?.token?.balance,
        );
        console.log('top', top?.data?.amount);
        setLoadingValueUp(false);
      } catch (error) {
        setLoadingValueUp(false);
      }
    }
    setinputUp('0');
  };
  const gettokenUsdValueBottom = async (bottomToken, slectedNetDown) => {
    if (slectedNetDown?.type == 'evm') {
      setLoadingValueDown(true);
      try {
        let top = await getUSDamount(bottomToken?.symbol);
        setBottomUSDValue(top?.data);
        let getBalance = await importEVMToken(
          address.replace(/^"|"$/g, ''),
          slectedNetDown?.nodeURL,
          slectedNetDown?.networkName,
          bottomToken?.address || bottomToken?.token_address,
        );
        if (getBalance) {
          setBalanceDown(
            getBalance?.token?.balance || getBalance?.data?.balance,
          );
        } else {
          setBalanceDown(0);
        }
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>GET BALANCE',
          getBalance?.token?.balance || getBalance?.data?.balance,
        );
        console.log('Bottom', top?.data?.amount);
        setLoadingValueDown(false);
      } catch (error) {
        setLoadingValueDown(false);
      }
    } else {
      setLoadingValueDown(true);
      try {
        let top = await getUSDamount(bottomToken?.symbol);
        console.log('>>>>>>>', top?.data?.amount);
        setBottomUSDValue(top?.data);
        let getBalance = await importSolToken(
          address?.replace(/^"|"$/g, ''),
          bottomToken?.address || bottomToken?.token_address,
        );
        if (getBalance) {
          setBalanceDown(getBalance?.token?.balance);
        } else {
          setBalanceDown(0);
        }
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>GET BALANCE',
          getBalance?.token?.balance,
        );
        console.log('top', top?.data?.amount);
        setLoadingValueDown(false);
      } catch (error) {
        setLoadingValueDown(false);
      }
    }
    setinputDown('0');
  };

  const convertTop = async () => {
    console.log(Number(inputUp), '*', bottomValueUsd?.amount);
    let calculate = Number(inputUp) * topValueUsd?.amount;
    let multiply = calculate / bottomValueUsd?.amount;
    console.log(multiply);
    setinputDown(multiply.toString());
  };

  const bridged = async () => {
    let toAddress = selectedAccount?.[slectedNetUp?.type].address || selectedAccount?.[slectedNetUp?.type].publicKey
    let fromAddress = selectedAccount?.[slectedNetDown?.type].address || selectedAccount?.[slectedNetDown?.type].publicKey
    let fromAddressKey = selectedAccount?.[slectedNetDown?.type].privateKey || selectedAccount?.[slectedNetDown?.type].secretKey
    if(fromAddressKey == '----'){
      if(bottomRecepentAddress != ''){
        fromAddress = bottomRecepentAddress
      }else{
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Invalid Address',
          textBody: 'Address Is not Valid',
        })
      }
    }
    if (slectedNetUp?.type == 'evm') {
      setLoading(true)
      let responceGas = await bridge_gas_emv_tron(
        toAddress,
        fromAddress,
        topToken?.symbol,
        bottomToken?.symbol,
        slectedNetUp,
        inputUp,
        selectedAccount?.evm?.privateKey,
        slectedNetDown
      );
      console.log(">>>>>>>>>>",responceGas)
      if(ballanceUp > inputUp){
        setLoading(false)
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Confirmation',
          textBody: `Are You Sure You Want to Bridge Token! \n Platform Fee: ${Number(responceGas?.getFee)?.toFixed(5)} ${slectedNetUp?.symbol} \n Estimated Time: ${Number(responceGas?.time)} Min`,
          button: 'Confirm Bridge',
          onPressButton: async () => {  
            try {
              setLoading(true)
              let responce = await bridge_emv_tron(
                toAddress,
                fromAddress,
                topToken?.symbol,
                bottomToken?.symbol,
                slectedNetUp,
                inputUp,
                selectedAccount?.evm?.privateKey,
                slectedNetDown
              );
              console.log(">>>>>>>>>>",responce)
              if (responce) {
                setLoading(false)
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Transaction Sucessfull',
                  textBody: 'Congrats Your Transaction Sucessfully Completed',
                })
                navigation.navigate("MainPage")
              }else{
                Toast.show({
                  type: ALERT_TYPE.INFO,
                  title: 'insufficient balance',
                  textBody: 'insufficient balance for Bridging / Network Error',
                })
                setLoading(false)
              }
            } catch (error) {
              setLoading(false)
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Network Error',
                textBody: 'Network Not Responding.',
              })
            }

            Dialog.hide()
          },
        });
        
      }else{
        setLoading(false)
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'insufficient balance',
          textBody: 'insufficient balance for Bridging',
        });
      }

    }else if(slectedNetUp?.type == 'tron'){
     
        setLoading(true)
        let responceGas = await bridge_gas_emv_tron(
          toAddress,
          fromAddress,
          topToken?.symbol,
          bottomToken?.symbol,
          slectedNetUp,
          inputUp,
          selectedAccount?.evm?.privateKey,
          slectedNetDown
        );
        console.log(">>>>>>>>>>",responceGas)
        if(ballanceUp > inputUp){
          setLoading(false)
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Confirmation',
            textBody: `Are You Sure You Want to Bridge Token! \n Platform Fee: ${Number(responceGas?.getFee)?.toFixed(5)} ${slectedNetUp?.symbol} \n Estimated Time: ${Number(responceGas?.time)} Min`,
            button: 'Confirm Bridge',
            onPressButton: async () => {  
              try {
                setLoading(true)
                let responce = await bridge_tron(
                  toAddress,
                  fromAddress,
                  topToken?.symbol,
                  bottomToken?.symbol,
                  slectedNetUp,
                  inputUp,
                  selectedAccount?.tron?.privateKey,
                  slectedNetDown
                );
                console.log(">>>>>>>>>>",responce.transactionHash.txid)
                if (responce) {
                  setLoading(false)
                  Toast.show({
                    type: ALERT_TYPE.INFO,
                    title: responce?.transactionHash?.code,
                    textBody: responce?.transactionHash?.txid,
                  })
                  navigation.navigate("MainPage")
                }else{
                  Toast.show({
                    type: ALERT_TYPE.INFO,
                    title: 'insufficient balance',
                    textBody: 'insufficient balance for Bridging / Network Error',
                  })
                  setLoading(false)
                }
              } catch (error) {
                setLoading(false)
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Network Error',
                  textBody: 'Network Not Responding.',
                })
              }
  
              Dialog.hide()
            },
          });
          
        }else{
          setLoading(false)
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'insufficient balance',
            textBody: 'insufficient balance for Bridging',
          });
        }
      
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Switch to EVM Account',
        textBody: 'Indicate Other Account',
      });
    }
  };

  const convertbottom = async () => {
    console.log(Number(inputDown), '/', topValueUsd?.amount);
    let calculate = Number(inputDown) * bottomValueUsd?.amount;
    let multiply = calculate / topValueUsd?.amount;
    console.log(calculate);
    setinputUp(multiply.toString());
  };

  const getNetworkactive = async () => {
    let data = await JSON.parse(selectedNetwork);
    setActiveNet(data);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let Network = activeNet?.type;
      setAddress(
        JSON.stringify(
          Network === 'solana'
            ? selectedAccount.solana.publicKey
            : Network === 'btc'
            ? selectedAccount.btc.address
            : Network === 'tron'
            ? selectedAccount.tron.address
            : Network === 'doge'
            ? selectedAccount.doge.address
            : selectedAccount.evm.address,
        ),
      );
      setActiveAccount(
        JSON.stringify(
          Network === 'solana'
            ? selectedAccount.solana
            : Network === 'btc'
            ? selectedAccount.btc
            : Network === 'tron'
            ? selectedAccount.tron
            : Network === 'doge'
            ? selectedAccount.doge
            : selectedAccount.evm,
        ),
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [activeNet, selectedAccount]);

  useEffect(() => {
    convertTop();
  }, [inputUp]);

  useEffect(() => {
    convertbottom();
  }, [inputDown]);

  useEffect(() => {
    gettokenUsdValueTop(topToken, slectedNetUp);
    setinputDown('0');
    setinputUp('0');
  }, [topToken]);

  useEffect(() => {
    gettokenUsdValueBottom(bottomToken, slectedNetDown);
    setinputDown('0');
    setinputUp('0');
  }, [bottomToken]);

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
    getNetworkactive();
  }, []);

  function filterObjectByKeys(obj, keys) {
    const filteredObj = {};
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            filteredObj[key] = obj[key];
        }
    });
    return filteredObj;
}

  const BridgCard_up = () => {
    return (
      <View
        style={[styles.swapCardWrapper, {backgroundColor: theme.menuItemBG}]}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleNetworkUp}
          onRequestClose={() => {
            setModalVisibleNetworkUp(!modalVisibleNetworkUp);
          }}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: theme.screenBackgroud, color: theme.text},
            ]}>
            <View
              style={[
                styles.amountInpWrapperFlex,
                {
                  width: '100%',
                  marginBottom: 30,
                  backgroundColor: theme.screenBackgroud,
                  color: theme.text,
                  justifyContent: 'space-between',
                },
              ]}>
              <View style={styles.amountImageLeftFlex}>
                <Text style={[styles.amountSwapLable, {color: theme.text}]}>
                  Blockchains
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleNetworkUp(!modalVisibleNetworkUp);
                }}>
                <Text
                  style={[
                    styles.amountSwapValue,
                    {color: theme.text, backgroundColor: 'transparent'},
                  ]}>
                  x
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={Networks}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({item, index}) => {
                // && index !== 4 && index !== 3
                
                if (index !== 1 && index !== 0 && index !== 4) {
                  return;
                } else if (item == slectedNetDown) {
                  return;
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const filteredData = filterObjectByKeys(selectedAccount, [item?.type]);
                      console.log(filteredData?.[item?.type]?.privateKey)
                      console.log(filteredData?.[item?.type]?.secretKey)
                    if(filteredData?.[item?.type]?.privateKey == '----' || filteredData?.[item?.type]?.secretKey == '----'){
                      Dialog.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Account Not Available',
                        textBody: 'Switch Other Account',
                      });
                    }else{
                      setSelectedNetUp(item);
                      setModalVisibleNetworkUp(!modalVisibleNetworkUp);
                    }
                    setTopToken(null);
                      
                    }}>
                    <View
                      style={[
                        styles.panCakeCardWrapper,
                        {borderBottomColor: theme.pancakeBorderBottom},
                      ]}>
                      <View style={styles.pancakeCardLeft}>
                        <View
                          style={[
                            styles.pancakeLeftImgWrapper,
                            // { backgroundColor: theme.pancakeImgBG },
                          ]}>
                          <Image
                            style={styles.pancakeLeftImage}
                            source={{uri: item.logoURI || item.logo}}
                          />
                        </View>
                      </View>
                      <View style={styles.pancakeCardRight}>
                        <Text
                          style={[
                            styles.pancakeRightUpperText,
                            {color: theme.text},
                          ]}>
                          {item.networkName}
                        </Text>
                        <Text
                          style={[
                            styles.pancakeRightLowerText,
                            {color: theme.text},
                          ]}>
                          {item.nodeURL || item.explorerURL}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleTokenUp}
          onRequestClose={() => {
            setModalVisibleTokenUp(!modalVisibleTokenUp);
          }}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: theme.screenBackgroud, color: theme.text},
            ]}>
            <View
              style={[
                styles.amountInpWrapperFlex,
                {
                  width: '100%',
                  marginBottom: 30,
                  backgroundColor: theme.screenBackgroud,
                  color: theme.text,
                  justifyContent: 'space-between',
                },
              ]}>
              <View style={styles.amountImageLeftFlex}>
                <Text style={[styles.amountSwapLable, {color: theme.text}]}>
                  Tokens
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleTokenUp(!modalVisibleTokenUp);
                }}>
                <Text
                  style={[
                    styles.amountSwapValue,
                    {color: theme.text, backgroundColor: 'transparent'},
                  ]}>
                  x
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={Stable_Tokens}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({item, index}) => {
                if (slectedNetUp?.nodeURL !== item?.rpc) {
                  return;
                } else if (item == bottomToken) {
                  return;
                }
                // console.log(item)
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setTopToken(item);
                      setModalVisibleTokenUp(!modalVisibleTokenUp);
                    }}>
                    <View
                      style={[
                        styles.panCakeCardWrapper,
                        {borderBottomColor: theme.pancakeBorderBottom},
                      ]}>
                      <View style={styles.pancakeCardLeft}>
                        <View
                          style={[
                            styles.pancakeLeftImgWrapper,
                            // { backgroundColor: theme.pancakeImgBG },
                          ]}>
                          <Image
                            style={styles.pancakeLeftImage}
                            source={{uri: item.logoURI || item.logo}}
                          />
                        </View>
                      </View>
                      <View style={styles.pancakeCardRight}>
                        <Text
                          style={[
                            styles.pancakeRightUpperText,
                            {color: theme.text},
                          ]}>
                          {item.coingekoId || item.name}
                        </Text>
                        <Text
                          style={[
                            styles.pancakeRightLowerText,
                            {color: theme.text},
                          ]}>
                          {item.address || item.token_address}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <View style={styles.swapHeaderFlex}>
          <TouchableOpacity
            onPress={() => {
              setModalVisibleNetworkUp(true);
            }}>
            {slectedNetUp == null ? (
              <View style={styles.dropDownFlex}>
                <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                  Select Blockchain
                </Text>
                <View style={styles.swapLeftSubFlex}>
                  <View style={styles.currencyIconWrapper}>
                    <Image
                      source={SwapCurrencyIcon}
                      style={styles.swapIconImage}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.dropDownFlex}>
                <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                  {slectedNetUp?.networkName}
                </Text>
                <View style={styles.swapLeftSubFlex}>
                  <View style={styles.currencyIconWrapper}>
                    <Image
                      source={{uri: slectedNetUp.logoURI || slectedNetUp.logo}}
                      style={styles.swapIconImage}
                    />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          {slectedNetUp && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleTokenUp(true);
                }}>
                {topToken == null ? (
                  <View style={styles.dropDownFlex}>
                    <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                      {t('token')}
                    </Text>
                    <View style={styles.swapLeftSubFlex}>
                      <View style={styles.currencyIconWrapper}>
                        <Image
                          source={SwapCurrencyIcon}
                          style={styles.swapIconImage}
                        />
                      </View>
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        Select
                      </Text>
                      <View>
                        <Image source={SwapDrop} />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.dropDownFlex}>
                    <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                      {t('token')}
                    </Text>
                    <View style={styles.swapLeftSubFlex}>
                      <View style={styles.currencyIconWrapper}>
                        <Image
                          source={{uri: topToken?.logoURI || topToken?.logo}}
                          style={styles.swapIconImage}
                        />
                      </View>
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        {topToken?.symbol}
                      </Text>
                      <View>
                        <Image source={SwapDrop} />
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        {/*  */}
        <View style={styles.amountWrapper}>
          <Text style={[styles.ammountText, {color: theme.text}]}>
            {t('amount')}
          </Text>
          <View style={styles.amountInpWrapperFlex}>
            {topToken == null ? (
              <>
                <TextInput
                  editable={false}
                  placeholder="0.00"
                  style={[
                    styles.inputWrapper,
                    {backgroundColor: theme.rightArrowBG, color: theme.text},
                  ]}
                  placeholderTextColor={theme.text}
                />
                <View
                  style={[
                    styles.swapMaxBtnWrapper,
                    {borderColor: theme.buttonBorder},
                  ]}>
                  <Text style={[styles.swapMaxBtnText, {color: theme.text}]}>
                    {t('max')}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  editable={true}
                  placeholder="0.00"
                  onChangeText={setinputUp}
                  value={inputUp}
                  keyboardType="numeric"
                  style={[
                    styles.inputWrapper,
                    {backgroundColor: theme.rightArrowBG, color: theme.text},
                  ]}
                  placeholderTextColor={theme.text}
                />
                <TouchableOpacity
                  onPress={onMaxValue}
                  style={[
                    styles.swapMaxBtnWrapper,
                    {borderColor: theme.buttonBorder},
                  ]}>
                  <Text style={[styles.swapMaxBtnText, {color: theme.text}]}>
                    {t('max')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        {loadingValueUp ? (
          <MaroonSpinner />
        ) : (
          <>
            {slectedNetUp && (
              <>
                {topToken == null ? (
                  <></>
                ) : (
                  <View style={styles.balanceWrapperFlex}>
                    <Text
                      style={[styles.swapBalanceLabel, {color: theme.text}]}>
                      {t('balance')}
                    </Text>

                    <Text style={[styles.swapBalance, {color: theme.emphasis}]}>
                      {Number(ballanceUp)?.toFixed(4)}{' '}
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        {topToken?.symbol}
                      </Text>
                    </Text>

                    <Text style={[styles.swapBalance, {color: theme.emphasis}]}>
                      {Number(topValueUsd?.amount)?.toFixed(4)}
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        $
                      </Text>
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  };

  const BridgCard_down = () => {
    const [get_Input, set_Input] = useState(false)
    useEffect(()=>{
      const filteredData = filterObjectByKeys(selectedAccount, [slectedNetDown?.type]);
      let key = filteredData?.[slectedNetDown?.type]?.privateKey || filteredData?.[slectedNetDown?.type]?.secretKey
      if(key == '----'){
        set_Input(true)
      }else{
        set_Input(false)
      }
    },[slectedNetDown])

  // if(filteredData?.[item?.type]?.privateKey == '----' || filteredData?.[item?.type]?.secretKey == '----'){
  //   Dialog.show({
  //     type: ALERT_TYPE.WARNING,
  //     title: 'Account Not Available',
  //     textBody: 'Switch Other Account',
  //   });
  // }
    return (
      <View
        style={[styles.swapCardWrapper, {backgroundColor: theme.menuItemBG}]}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleNetworkDown}
          onRequestClose={() => {
            setModalVisibleNetworkDown(!modalVisibleNetworkDown);
          }}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: theme.screenBackgroud, color: theme.text},
            ]}>
            <View
              style={[
                styles.amountInpWrapperFlex,
                {
                  width: '100%',
                  marginBottom: 30,
                  backgroundColor: theme.screenBackgroud,
                  color: theme.text,
                  justifyContent: 'space-between',
                },
              ]}>
              <View style={styles.amountImageLeftFlex}>
                <Text style={[styles.amountSwapLable, {color: theme.text}]}>
                  Blockchains
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleNetworkDown(!modalVisibleNetworkDown);
                }}>
                <Text
                  style={[
                    styles.amountSwapValue,
                    {color: theme.text, backgroundColor: 'transparent'},
                  ]}>
                  x
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={Networks}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({item, index}) => {
                if (index !== 1 && index !== 0 && index !== 4 && index !== 3) {
                  return;
                } else if (item == slectedNetDown) {
                  return;
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedNetDown(item);
                      setModalVisibleNetworkDown(!modalVisibleNetworkDown);
                      setBottomToken(null);
                    }}>
                    <View
                      style={[
                        styles.panCakeCardWrapper,
                        {borderBottomColor: theme.pancakeBorderBottom},
                      ]}>
                      <View style={styles.pancakeCardLeft}>
                        <View
                          style={[
                            styles.pancakeLeftImgWrapper,
                            // { backgroundColor: theme.pancakeImgBG },
                          ]}>
                          <Image
                            style={styles.pancakeLeftImage}
                            source={{uri: item.logoURI || item.logo}}
                          />
                        </View>
                      </View>
                      <View style={styles.pancakeCardRight}>
                        <Text
                          style={[
                            styles.pancakeRightUpperText,
                            {color: theme.text},
                          ]}>
                          {item.networkName}
                        </Text>
                        <Text
                          style={[
                            styles.pancakeRightLowerText,
                            {color: theme.text},
                          ]}>
                          {item.nodeURL || item.explorerURL}
                        </Text>
                      </View>
                  

                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleTokenDown}
          onRequestClose={() => {
            setModalVisibleTokenDown(!modalVisibleTokenDown);
          }}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: theme.screenBackgroud, color: theme.text},
            ]}>
            <View
              style={[
                styles.amountInpWrapperFlex,
                {
                  width: '100%',
                  marginBottom: 30,
                  backgroundColor: theme.screenBackgroud,
                  color: theme.text,
                  justifyContent: 'space-between',
                },
              ]}>
              <View style={styles.amountImageLeftFlex}>
                <Text style={[styles.amountSwapLable, {color: theme.text}]}>
                  Tokens
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleTokenDown(!modalVisibleTokenDown);
                }}>
                <Text
                  style={[
                    styles.amountSwapValue,
                    {color: theme.text, backgroundColor: 'transparent'},
                  ]}>
                  x
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={Stable_Tokens}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({item, index}) => {
                if (slectedNetDown?.nodeURL !== item?.rpc) {
                  return;
                } else if (item == bottomToken) {
                  return;
                }
                // console.log(item)
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setBottomToken(item);
                      setModalVisibleTokenDown(!modalVisibleTokenDown);
                    }}>
                    <View
                      style={[
                        styles.panCakeCardWrapper,
                        {borderBottomColor: theme.pancakeBorderBottom},
                      ]}>
                      <View style={styles.pancakeCardLeft}>
                        <View
                          style={[
                            styles.pancakeLeftImgWrapper,
                            // { backgroundColor: theme.pancakeImgBG },
                          ]}>
                          <Image
                            style={styles.pancakeLeftImage}
                            source={{uri: item.logoURI || item.logo}}
                          />
                        </View>
                      </View>
                      <View style={styles.pancakeCardRight}>
                        <Text
                          style={[
                            styles.pancakeRightUpperText,
                            {color: theme.text},
                          ]}>
                          {item.coingekoId || item.name}
                        </Text>
                        <Text
                          style={[
                            styles.pancakeRightLowerText,
                            {color: theme.text},
                          ]}>
                          {item.address || item.token_address}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <View style={styles.swapHeaderFlex}>
          <TouchableOpacity
            onPress={() => {
              setModalVisibleNetworkDown(true);
            }}>
            {slectedNetDown == null ? (
              <View style={styles.dropDownFlex}>
                <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                  Select Blockchain
                </Text>
                <View style={styles.swapLeftSubFlex}>
                  <View style={styles.currencyIconWrapper}>
                    <Image
                      source={SwapCurrencyIcon}
                      style={styles.swapIconImage}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.dropDownFlex}>
                <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                  {slectedNetDown?.networkName}
                </Text>
                <View style={styles.swapLeftSubFlex}>
                  <View style={styles.currencyIconWrapper}>
                    <Image
                      source={{
                        uri: slectedNetDown.logoURI || slectedNetDown.logo,
                      }}
                      style={styles.swapIconImage}
                    />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          {slectedNetDown && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleTokenDown(true);
                }}>
                {bottomToken == null ? (
                  <View style={styles.dropDownFlex}>
                    <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                      {t('token')}
                    </Text>
                    <View style={styles.swapLeftSubFlex}>
                      <View style={styles.currencyIconWrapper}>
                        <Image
                          source={SwapCurrencyIcon}
                          style={styles.swapIconImage}
                        />
                      </View>
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        Select
                      </Text>
                      <View>
                        <Image source={SwapDrop} />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.dropDownFlex}>
                    <Text style={[styles.swapHeaderText, {color: theme.text}]}>
                      {t('token')}
                    </Text>
                    <View style={styles.swapLeftSubFlex}>
                      <View style={styles.currencyIconWrapper}>
                        <Image
                          source={{
                            uri: bottomToken?.logoURI || bottomToken?.logo,
                          }}
                          style={styles.swapIconImage}
                        />
                      </View>
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        {bottomToken?.symbol}
                      </Text>
                      <View>
                        <Image source={SwapDrop} />
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        {/*  */}
        <View style={styles.amountWrapper}>
          <Text style={[styles.ammountText, {color: theme.text}]}>
            {t('amount')}
          </Text>
          <View style={styles.amountInpWrapperFlex}>
            {bottomToken == null ? (
              <>
                <TextInput
                  editable={false}
                  placeholder="0.00"
                  style={[
                    styles.inputWrapper,
                    {backgroundColor: theme.rightArrowBG, color: theme.text},
                  ]}
                  placeholderTextColor={theme.text}
                />
                <View
                  style={[
                    styles.swapMaxBtnWrapper,
                    {borderColor: theme.buttonBorder},
                  ]}>
                  <Text style={[styles.swapMaxBtnText, {color: theme.text}]}>
                    {t('max')}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  editable={true}
                  placeholder="0.00"
                  onChangeText={setinputDown}
                  value={inputDown}
                  keyboardType="numeric"
                  style={[
                    styles.inputWrapper,
                    {backgroundColor: theme.rightArrowBG, color: theme.text},
                  ]}
                  placeholderTextColor={theme.text}
                />
                <TouchableOpacity
                  onPress={onMaxValue}
                  style={[
                    styles.swapMaxBtnWrapper,
                    {borderColor: theme.buttonBorder},
                  ]}>
                  <Text style={[styles.swapMaxBtnText, {color: theme.text}]}>
                    {t('max')}
                  </Text>
                </TouchableOpacity>
                
              </>
            )}
          </View>
          {get_Input && (
          <View style={styles.amountWrapper}>
          <Text style={[styles.ammountText, {color: theme.text}]}>
            Recepent Address
          </Text>
          <View  style={styles.amountInpWrapperFlex}>
                       <TextInput
                       editable={true}
                       placeholder="0xsda..."
                       onChangeText={setBottomRecepentAddress}
                       value={bottomRecepentAddress}
                       style={[
                         styles.inputWrapper,
                         {backgroundColor: theme.rightArrowBG, color: theme.text},
                       ]}
                       placeholderTextColor={theme.text}
                     />
          </View>
          </View>
                )}
        </View>
        {loadingValueDown ? (
          <MaroonSpinner />
        ) : (
          <>
            {slectedNetDown && (
              <>
                {bottomToken == null ? (
                  <></>
                ) : (
                  <View style={styles.balanceWrapperFlex}>
                    <Text
                      style={[styles.swapBalanceLabel, {color: theme.text}]}>
                      {t('balance')}
                    </Text>

                    <Text style={[styles.swapBalance, {color: theme.emphasis}]}>
                      {Number(ballanceDown)?.toFixed(4)}{' '}
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        {bottomToken?.symbol}
                      </Text>
                    </Text>

                    <Text style={[styles.swapBalance, {color: theme.emphasis}]}>
                      {Number(bottomValueUsd?.amount)?.toFixed(4)}
                      <Text
                        style={[styles.swapCurrencyName, {color: theme.text}]}>
                        $
                      </Text>
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.mainWrapper, {backgroundColor: theme.screenBackgroud}]}>
      <Header title={t('bridging')} onBack={() => navigation.goBack()} />
      {loading ? (
        <MaroonSpinner />
      ) : (
        <>
          <View style={styles.swapWrapper}>
            <BridgCard_up />
            <View style={styles.swapBtnFlexWrapper}>
              <TouchableOpacity
                style={[styles.swapBtn, {backgroundColor: theme.rightArrowBG}]}>
                <Image
                  source={theme.type == 'dark' ? SwapingIcon : SwapingIconDark}
                />
              </TouchableOpacity>
            </View>
          </View>
          <BridgCard_down />
          {/* <View style={styles.gasFeeFlex}>
        <Text style={[styles.gasFeeLabel, {color: theme.text}]}>{t('gas_fee')}</Text>
        <Text style={[styles.gasFee, {color: theme.emphasis}]}>{t('gas_fee')}</Text>
      </View> */}
          {/* <ChooseChannel /> */}
          <View style={[styles.tokenImportBtnWrapper, {marginTop: 20}]}>
            <SubmitBtn
              title={'Continue'}
              onPress={() => {
                bridged();
              }}
              containerStyle={{marginHorizontal: 0}}
            />
            {/* <TouchableOpacity
          style={[styles.tokenImportButton, {borderColor: theme.buttonBorder}]}>
          <Text style={[styles.tokenImportButtonText, {color: theme.text}]}>
            Save Changes
          </Text>
        </TouchableOpacity> */}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Bridging;

const styles = StyleSheet.create({
  coinSecText: {
    // color: "#fff",
    fontSize: 16,
    fontWeight: '400',
  },
  panCakeCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    // borderBottomColor: "#3E1844",
    borderBottomWidth: 1,
    gap: 12,
  },

  pancakeLeftImgWrapper: {
    width: 96,
    height: 56,
    borderRadius: 100,
    // backgroundColor: "#00FFF0",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pancakeLeftImage: {
    width: 46,
    height: 46,
  },
  pancakeRightUpperText: {
    // color: "#FFF",
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  pancakeRightLowerText: {
    // color: "#FFF",
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bottomMenuMargin: {
    marginBottom: 20,
    marginTop: 20,
  },
  swapCardWrapper: {
    padding: 24,
    borderRadius: 16,
    // backgroundColor: "#362538"
  },
  swapWrapper: {
    marginTop: 20,
  },
  swapHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swapHeaderText: {
    // color: "#FFF",
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  swapLeftSubFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyIconWrapper: {
    width: 18,
    height: 18,
  },
  swapIconImage: {
    width: '100%',
    height: '100%',
  },
  swapCurrencyName: {
    // color: "#FFF",
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amountWrapper: {
    marginTop: 16,
  },
  amountInpWrapperFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    // marginTop: 8
  },
  amountImageLeftFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountSwapLable: {
    // color: "#FFF",
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amountSwapValue: {
    // color: "#FFF",
    fontSize: 20,
    fontWeight: '700',
    // textTransform: "uppercase",
  },
  swapBtnFlexWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: -15,
    zIndex: 99,
  },
  swapBtn: {
    width: 48,
    height: 48,
    borderRadius: 100,
    // backgroundColor: "#4E3B51",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //
  gasFlexWrapper: {
    marginVertical: 10,
  },
  gasFeeFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  gasFeeLabel: {
    // color: "#FFF",
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  gasFee: {
    // color: "#F43459",
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  //
  tokenImportBtnWrapper: {
    marginBottom: 35,
  },
  tokenImportButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    // borderColor: "#FF003C",
    borderWidth: 1,
    borderRadius: 100,
  },
  tokenImportButtonText: {
    // color: "#FFF",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  mainWrapper: {
    // backgroundColor: '#280D2C',
    padding: 10,
  },
  mainWrapper: {
    // backgroundColor: '#280D2C',
    padding: 10,
  },
  swapCardWrapper: {
    padding: 24,
    borderRadius: 16,
    // backgroundColor: "#362538"
  },
  swapWrapper: {
    marginTop: 20,
  },
  swapHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swapHeaderText: {
    // color: "#FFF",
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  swapLeftSubFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyIconWrapper: {
    width: 18,
    height: 18,
  },
  swapIconImage: {
    width: '100%',
    height: '100%',
  },
  swapCurrencyName: {
    // color: "#FFF",
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amountWrapper: {
    marginTop: 16,
  },
  ammountText: {
    // color: "#FFF",
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  amountInpWrapperFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  inputWrapper: {
    padding: 8,
    // backgroundColor: "#4E3B51",
    borderRadius: 8,
    // color: "white",
    flex: 1,
  },
  swapMaxBtnWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1,
    // borderColor: '#FF003C',
  },
  swapMaxBtnText: {
    // color: '#FFF',
    fontSize: 11.859,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  balanceWrapperFlex: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  swapBalanceLabel: {
    // color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  swapBalance: {
    // color: '#F43459',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  swapBtnFlexWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: -15,
    zIndex: 99,
  },
  swapBtn: {
    width: 48,
    height: 48,
    borderRadius: 100,
    // backgroundColor: '#4E3B51',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //
  gasFeeFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  gasFeeLabel: {
    // color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  gasFee: {
    // color: '#F43459',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  //
  tokenImportBtnWrapper: {
    marginBottom: 35,
  },
  tokenImportButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    // borderColor: '#FF003C',
    borderWidth: 1,
    borderRadius: 100,
  },
  tokenImportButtonText: {
    // color: '#FFF',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  //
});
