import React, {useContext , useEffect , useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/header';
import SwapCurrencyIcon from '../assets/images/swap_currency_icon.png';
import SwapCurrencyBtcLarge from '../assets/images/swap_btc_large.png';
import SwapDrop from '../assets/images/swap_drop.png';
import SwapConfirmTransfer from '../assets/images/swap_confirm_transfer.png';
import SwapConfirmTransferDark from '../assets/images/swap_confirm_transfer_dark.png';
import {ThemeContext} from '../context/ThemeContext';
import { sendEvmToken , SolToken_estimatedGas ,  getSolBalance, getEVMBalance , sendSolToken } from '../utils/function';
import MaroonSpinner from '../components/Loader/MaroonSpinner';
import { useAuth } from '../context/AuthContext';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';




const ConfirmErc20SolTransaction = ({route, navigation}) => {
  const {theme} = useContext(ThemeContext);
  const [loader , setLoader] = useState(true)
  const [trxDetail , setTrxDetail] = useState({})
  const [gasDetail , setGasDetail] = useState()
  const [ballance, setBalance] = useState(0);
  const [activeNet, setActiveNet] = useState()
  const [address, setAddress] = useState();
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
    selectedNetwork
  } = useAuth();

  const getNetworkactive = async () => {
    let data = await JSON.parse(selectedNetwork)
    setActiveNet(data)
  }
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
    getNetworkactive()
  }, [selectedNetwork, Networks])

  const getbls = async () => {
    if (activeNet?.type === "evm") {
      let data = await getEVMBalance(address.replace(/^"|"$/g, ''), activeNet?.nodeURL)
      setBalance(data?.balance)
    } else {
      let data = await getSolBalance(address.replace(/^"|"$/g, ''))
      setBalance(data?.balance)
    }
  }
  useEffect(() => {
    getbls()
    const intervalId = setInterval(getbls, 10000);
    return () => clearInterval(intervalId);
  }, [Networks, address , selectedNetwork ,activeNet])
    
  useEffect(()=>{
      getbls()
    },[selectedAccount])


    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setAddress(JSON.stringify(activeNet?.type === 'solana' ? selectedAccount.solana.publicKey : selectedAccount.evm.address));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }, [Networks, selectedAccount]);

  const confirmAndSend = async () => {
    try {
      setLoader(true)
      let response = await sendSolToken(trxDetail?.privateKey, trxDetail?.recipientAddress,  trxDetail?.tokenAddress, trxDetail?.amountWei);
      console.log('Sending Sol...', response);
      if (response) {
        setLoader(false)
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Transaction Sucessfull',
          textBody: 'Congrats Your Transaction Sucessfully Completed',
        })
        navigation.navigate("MainPage")
      }else{
        Toast.show({
          type: ALERT_TYPE.INFO,
          title: 'Network Error',
          textBody: 'Network Issue Try Again Later',
        })
        navigation.navigate("MainPage")
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Network Error',
        textBody: 'Network Not Responding.',
      })
    }
  }

  const getEstimatedGas = async (data) => {
    try{
      setLoader(true)
      let gasData = await SolToken_estimatedGas(data?.privateKey, data?.recipientAddress,  data?.tokenAddress, data?.amountWei)
      setGasDetail(gasData)
      setLoader(false)
    }catch(error){
      setLoader(false)
    }
  }

  useEffect(() => {
    if (route?.params?.trxData) {
      getEstimatedGas(route?.params?.trxData)
      setTrxDetail(route?.params?.trxData);
    }
  }, [route?.params?.trxData]);

  const SwapCard = () => {
    return (
      <View
        style={[styles.swapCardWrapper, {backgroundColor: theme.menuItemBG}]}>
        <View style={styles.swapHeaderFlex}>
          <View style={styles.dropDownFlex}>
            <Text style={[styles.swapHeaderText, {color: theme.text}]}>
            {t('token')}
            </Text>
            <View style={styles.swapLeftSubFlex}>
              <View style={styles.currencyIconWrapper}>
                <Image source={SwapCurrencyIcon} style={styles.swapIconImage} />
              </View>
              <Text style={[styles.swapCurrencyName, {color: theme.text}]}>
                BTC
              </Text>
              <View>
                <Image source={SwapDrop} />
              </View>
            </View>
          </View>
          <View style={styles.dropDownFlex}>
            <Text style={[styles.swapHeaderText, {color: theme.text}]}>
              Blockchain
            </Text>
            <View style={styles.swapLeftSubFlex}>
              <View style={styles.currencyIconWrapper}>
                <Image source={SwapCurrencyIcon} style={styles.swapIconImage} />
              </View>
              <Text style={[styles.swapCurrencyName, {color: theme.text}]}>
                KDA
              </Text>
              <View>
                <Image source={SwapDrop} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.amountWrapper}>
          <View style={styles.amountInpWrapperFlex}>
            <View style={styles.amountImageLeftFlex}>
              {/* <View>
                                <Image source={SwapCurrencyBtcLarge} />
                            </View> */}
              <Text style={[styles.amountSwapLable, {color: theme.text}]}>
                balance: 01510501613
              </Text>
            </View>
            {/* <Text style={styles.amountSwapValue}>0</Text> */}
          </View>
        </View>
      </View>
    );
  };

  let validity = Number(gasDetail?.gasFeeInEther)
  let isvalid = validity >= ballance ?  false : true;
  
  return (
    <ScrollView
      style={[styles.mainWrapper, {backgroundColor: theme.screenBackgroud}]}>
      <Header
        title={t('confirm_transaction')}
        onBack={() => navigation.goBack()}
      />
      {/* <View style={styles.swapWrapper}>
        <SwapCard />
      </View> */}
      <View style={[styles.confirmAmountWrapperFlex ,{marginTop:50}]}>
        <View style={styles.confrimAmountCenterWrapper}>
          <Text style={[styles.confirmAmountHeding, {color: theme.text}]}>
          {t('review_your_transaction')}
          </Text>
          <View style={styles.confirmAmountFlex}>
            <View>
              {/* <Image source={SwapCurrencyBtcLarge} /> */}
            </View>
            <Text style={[styles.swapConfirmValue, {color: theme.text}]}>
              {/* {Number(trxDetail?.balance).toFixed(4)} */}
              {trxDetail?.amount} {trxDetail?.tokenSymbol}
            </Text>
            {/* <Text style={[ {color: theme.text}]}>
              {trxDetail?.symbol}
            </Text> */}
          </View>
          {/* <View style={styles.SwapConfirmTransferFlex}>
            <Image source={theme.type == 'dark' ? SwapConfirmTransfer : SwapConfirmTransferDark} />
          </View> */}
          {loader ? "" :
          <View style={styles.confirmAmountFlex}>
            <View>
              {/* <Image source={SwapCurrencyBtcLarge} /> */}
            </View>
            {/* <Text style={[styles.swapConfirmValue, {color: theme.text}]}>
            {(trxDetail?.balanceAmount - Number(gasDetail?.gasFeeInEther))?.toFixed(4)}
            </Text> */}
            {/* <Text style={[ {color: theme.text}]}>
              {trxDetail?.symbol}
            </Text> */}
          </View>
          }
        </View>
      </View>
      {loader ? <MaroonSpinner /> :
      <>
      <View
        style={[styles.gasFeeMainWrapper, {backgroundColor: theme.menuItemBG}]}>
        <View style={styles.gasFeeFlex}>
          <Text style={[styles.gasFeeLabel, {color: theme.text}]}>{t('amount_to_send')}</Text>
          <View>
            <Text style={[styles.gasFeeValue, {color: theme.emphasis}]}>
            {trxDetail?.amount}
            </Text>
            {/* <Text style={[styles.gasFeeMaxVal, {color: theme.text}]}>
            {trxDetail?.amount}
            </Text> */}
          </View>
        </View>
        <View style={styles.gasFeeFlex}>
          <Text style={[styles.gasFeeLabel, {color: theme.text}]}>{t('estimated_gas')}</Text>
          <View>
            {/* <Text style={[styles.gasFeeValue, {color: theme.emphasis}]}>
              0.00612061025
            </Text> */}
            <Text style={[styles.gasFeeMaxVal, {color: theme.text}]}>
             {gasDetail?.gasFeeInEther}
            </Text>
          </View>
        </View>
        <View style={styles.gasFeeFlex}>
          <Text style={[styles.gasFeeLabel, {color: theme.text}]}>{t('total')}</Text>
          <View>
            <Text style={[styles.gasFeeValue, {color: theme.emphasis}]}>
            {/* {trxDetail?.amount} */}
            {gasDetail?.gasFeeInEther}
            </Text>
            {/* <Text style={[styles.gasFeeMaxVal, {color: theme.text}]}>
              0.00612061025
            </Text> */}
          </View>
        </View>
      </View>
      <View style={styles.tokenImportBtnWrapper}>

{isvalid ? 
        <TouchableOpacity
        onPress={()=>confirmAndSend()}
          style={[
            styles.tokenImportButton,
            {
              backgroundColor: theme.tokenImportBtn,
              borderColor: theme.tokenImportBtn,
            },
          ]}>
          <Text style={[styles.tokenImportButtonText, {color: '#fff'}]}>
          {t('confirm_transaction')}
          </Text>
        </TouchableOpacity>

        :
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[styles.gasFeeValue, {color: theme.emphasis }]}>
        {t('insufficient_funds_for_gas')}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.tokenImportButton,
            {
              width:'100%',
              marginTop:10,
              backgroundColor: 'gray',
              borderColor: 'gray',
            },
          ]}>
          <Text style={[styles.tokenImportButtonText, {color: '#fff'}]}>
          {t('confirm_transaction')}
          </Text>
        </TouchableOpacity>
        </View>
        }
            {/* <TouchableOpacity
        onPress={()=>getEstimatedGas()}
          style={[
            styles.tokenImportButton,
            {
              backgroundColor: theme.tokenImportBtn,
              borderColor: theme.tokenImportBtn,
            },
          ]}>
          <Text style={[styles.tokenImportButtonText, {color: '#fff'}]}>
           getEstimatedGas
          </Text>
            </TouchableOpacity> */}
      </View>
      </>
      }
    </ScrollView>
  );
};

export default ConfirmErc20SolTransaction;

const styles = StyleSheet.create({
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
  amountInpWrapperFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
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
    textTransform: 'uppercase',
  },
  confirmAmountWrapperFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  confrimAmountCenterWrapper: {
    gap: 12,
  },
  confirmAmountHeding: {
    // color: "#FFF",
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  confirmAmountFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  swapConfirmValue: {
    // color: "#FFF",
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  SwapConfirmTransferFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gasFeeMainWrapper: {
    padding: 12,
    borderRadius: 16,
    // backgroundColor: "#362538",
    marginBottom: 15,
    gap: 16,
  },
  gasFeeFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gasFeeLabel: {
    // color: "white",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  gasFeeValue: {
    // color: "#F43459",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  gasFeeMaxVal: {
    // color: "white",
    fontSize: 8,
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tokenImportBtnWrapper: {
    marginBottom: 35,
  },
  tokenImportButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    // backgroundColor: '#009F53',
    // borderColor: '#009F53',
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
