import React, { useState, useRef , useContext , useEffect} from 'react';
import { Image, ScrollView, FlatList,Linking  , View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet , Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PanResponder } from 'react-native';
import WebViewComponent from '../components/Browser/WebViewComponent';
import HistoryModal from '../components/Browser/HistoryModal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import BottomMenu from '../components/BottomMenu';
import bg_lines from '../assets/images/bg_lines.png';
import bg_lines2 from '../assets/images/bg_lines2.png';
import bg_lines3 from '../assets/images/bg_lines3.png';
import bg_lines4 from '../assets/images/bg_lines4.png';
import bg_lines6 from '../assets/images/bg_lines6.png';
import bg_lines8 from '../assets/images/bg_lines8.png';
import greenLock from '../assets/images/green-lock.png';
import {ThemeContext} from '../context/ThemeContext';
import '@walletconnect/react-native-compat';
import { Core } from '@walletconnect/core';
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { useAuth } from '../context/AuthContext';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

function get_Image(ThemeName) {
  switch (ThemeName) {
    case 'theme1':
      return bg_lines;
    case 'theme2':
      return bg_lines2;
    case 'theme3':
      return bg_lines3;
    case 'theme4':
      return bg_lines4;
    case 'theme5':
      return '';
    case 'theme6':
      return bg_lines6;
    case 'theme7':
      return '';
    case 'theme8':
      return bg_lines8;
    default:
      return bg_lines;
  }
}

const BrowserScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
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

 
  const [address, setAddress] = useState();
  const [activeNet, setActiveNet] = useState()
  const [activeAccount, setActiveAccount] = useState();
  const Network = activeNet?.type;
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
  const [url, setUrl] = useState(
    'https://www.google.com');
        const [prev, setPrev] = useState(false);
        const [next, setNext] = useState(false);
        const [input, setInput] = useState('');
        const webviewRef = useRef(null);
        const [loading, setLoading] = useState(true);
        const [history, setHistory] = useState([]);
        const [histShow, setHistShow] = useState(false);
        const [currscale, setCurrScale] = useState(1);
        const [zoom, setZoom] = useState(false);

        useEffect(() => {
          const timeoutId = setTimeout(() => {
            setAddress(JSON.stringify(Network === 'solana' ? selectedAccount.solana.publicKey : selectedAccount.evm.address));
            setActiveAccount(JSON.stringify(Network === 'solana' ? selectedAccount.solana : selectedAccount.evm));
          }, 1000);
          return () => clearTimeout(timeoutId);
        }, [Network, selectedAccount]);


        // useEffect(()=>{
        //   console.log(">>>> listed and session",Session.length)
        //   console.log(">>>> listed and session",Session[Session.length - 1])
        //   console.log(">>>> listed and session",Session[Session.length - 1]?.session?.topic)
        //   console.log(">>>> listed and session",Session[Session.length - 1]?.session?.peer?.metadata?.url)
        //   const walletConnectUrl = `${Session[Session.length - 1]?.session?.peer?.metadata?.url}/?wcSession=${Session[Session.length - 1]?.session?.topic}&chainId=1`;
        //  console.log(address?.replace(/^"|"$/g, '') )
        //   // setUrl(url !== 'https://www.google.com' ? walletConnectUrl : url)
        //   // setUrl(walletConnectUrl)
          
        //   // handleAccountsChanged(address?.replace(/^"|"$/g, '') , Session[Session.length - 1]?.session?.topic)
        //   // Linking.openURL(walletConnectUrl);
        // },[Session])


        const handleConnectPress = async (wc_uri) => {
          console.log(">>>> run Connect");
          const core = new Core({
            projectId: 'c6cc849231f0c9770267752c7251f2b5',
          });
      
          const web3wallet = await Web3Wallet.init({
            core,
            metadata: {
              name: 'Crypto Wallet',
              description: 'Crypto Wallet to interface with Dapps',
              url: 'www.walletconnect.com',
              icons: [],
            },
          });
          setWeb3Wallet(web3wallet);
      
          const onSessionProposal = async (event) => {
            const { id, params } = event;
            try {
              const approvedNamespaces = buildApprovedNamespaces({
                proposal: params,
                supportedNamespaces: {
                  eip155: {
                    chains: ['eip155:1', 'eip155:137', 'eip155:56', 'eip155:97'],
                    methods: [
                      'eth_sendTransaction',
                      'personal_sign',
                      'eth_signTypedData',
                      'eth_sign',
                      'eth_call',
                      'eth_getTransactionReceipt',
                      'eth_getTransactionCount',
                      'eth_estimateGas',
                    ],
                    events: ['accountsChanged', 'chainChanged'],
                    accounts: [
                      `eip155:1:${address.replace(/^"|"$/g, '')}`,
                      `eip155:137:${address.replace(/^"|"$/g, '')}`,
                      `eip155:56:${address.replace(/^"|"$/g, '')}`,
                      `eip155:97:${address.replace(/^"|"$/g, '')}`
                    ],
                  },
                },
              });
              const session = await web3wallet.approveSession({
                id,
                namespaces: approvedNamespaces,
              });
              // console.log("Session approved:", session);
              saveSession({ id: Session.length + 1, session: session })
            } catch (error) {
              console.log('Error handling session proposal:', error);
            }
          };
      
          web3wallet.on('session_proposal', onSessionProposal);
      
          try {
            console.log("URI:", wc_uri);
            await web3wallet.pair({ uri: wc_uri });
            console.log("Connecting to wallet!");
          } catch (error) {
            console.log('Error pairing with the URI:', error);
          }
        };


        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.numberActiveTouches === 2;
            },
            onPanResponderGrant: () => {
                setZoom(true);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.numberActiveTouches === 2) {
                    const distance = Math.sqrt(
                        Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
                    );
                    const newScale = (currscale + (distance - 20) / 1000).toFixed(2);
                    if (newScale >= 1) {
                        setCurrScale(newScale);
                    }
                }
            },
            zoomFunction: () => {
                setZoom(false);
            },
        });
        const navStateFunction = (navState) => {
          const regex = /^wc:([0-9a-fA-F]+)@(\d+)\?relay-protocol=([^&]+)&symKey=([0-9a-fA-F]+)$/;
          const match = navState.url.match(regex);
          if (match) {
            handleConnectPress(navState.url).then(()=>{
              console.log(Session.length)
              console.log(Session)
              console.log(navState.url)
            })      .catch((e)=>{console.warn(`Failed to connect: ${e}`)});
            // const webUrl = 'https://pancakeswap.finance/'; 
            // const walletConnectUrl = `${webUrl}?wcSession=${topic}&chainId=${chainId}`;
      
            // Linking.openURL(walletConnectUrl);
          } else {
            setPrev(navState.canGoBack);
            setNext(navState.canGoForward);
            setHistory((prevHistory) => [navState.url, ...prevHistory]);
          }
        };
        const prevFunction = () => {
            if (prev) {
                webviewRef.current.goBack();
            }
        };
     
        const nextFunction = () => {
            if (next) {
                webviewRef.current.goForward();
            }
        };
     
        const reloadFunction = () => {
            webviewRef.current.reload();
        };
     
        const stopFunction = () => {
            webviewRef.current.stopLoading();
        };
     
        const increaseFontSize = () => {
            webviewRef.current.injectJavaScript(`
          var style = document.body.style;
          style.fontSize = (parseFloat(style.fontSize) || 16) + 2 + 'px';
        `);
        };
        const decreaseFontSize = () => {
            webviewRef.current.injectJavaScript(`
          var style = document.body.style;
          style.fontSize = (parseFloat(style.fontSize) || 16) - 2 + 'px';
        `);
        };
        const urlVisitFunction = () => {
            const inputTrimmed = input.trim();
            if (inputTrimmed === '') {
                return;
            }
            if (/^(https?|ftp):\/\//i.test(inputTrimmed)) {
                setUrl(inputTrimmed);
            } else {
                if (inputTrimmed.match(/^(www\.)?[a-z0-9-]+(\.[a-z]{2,})+/)) {
                    setUrl(`https://${inputTrimmed}`);
                } else {
                    const searchQuery = 
    `https://www.google.com/search?q=${encodeURIComponent(inputTrimmed)}`;
                    setUrl(searchQuery);
                }
            }
        };
        const histCleatFunction = () => {
            setHistory([]);
            Toast.show({
              type: ALERT_TYPE.INFO,
              title: 'History Cleared',
              textBody: 'Your browsing history has been cleared.',
            })
        };
        const loadHistFunction = () => {
            setHistShow(true);
        };



  return (
  //   <View>
  //   <ScrollView
  //     style={[
  //       styles.MainWrapper,
  //       {backgroundColor: theme.screenBackgroud, minHeight: '99%'},
  //     ]}>
  //     <ImageBackground
  //       style={styles.imgBackground}
  //       source={get_Image(theme.name)}
  //       resizeMode="cover">
  //       {/* <View style={{display: 'flex', flexDirection: 'row'}}>
          
  //         <View
  //           style={[
  //             styles.header,
  //             {
  //               backgroundColor: theme.menuItemBG,
  //               padding: 10,
  //               borderRadius: 1000,
  //               paddingHorizontal: 50
  //             },
  //           ]}>
  //           <TouchableOpacity>
  //             <Image source={greenLock} />
  //           </TouchableOpacity>
  //           <Text style={{color: theme.text}}>{'pancakeswap.com'}</Text>
  //         </View>
  //         <TouchableOpacity>
  //           <Text
  //             style={{
  //               color: theme.text,
  //               borderWidth: 1,
  //               paddingHorizontal: 20,
  //               paddingVertical: 15,
  //               borderColor: theme.emphasis,
  //               borderRadius: 1000,
  //             }}>
  //             {'2'}
  //           </Text>
  //         </TouchableOpacity>
  //       </View> */}
  //     </ImageBackground>
  //   </ScrollView>
  //   <View>
  //     <BottomMenu navigation={navigation} />
  //   </View>
  // </View>
<>

    <ImageBackground
      style={styles.imgBackground}
      source={get_Image(theme.name)}
      resizeMode="cover">
      <View style={[styles.container,{backgroundColor: theme.screenBackgroud}]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t('btx_browser')}</Text>
        </View>
        <Text style={[styles.subHeaderText, { color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('browser_in_btx_crypto_wallet')}</Text>
        <View style={styles.searchContainer}>
        <TextInput style={[styles.textInput, { color: theme.type === 'dark' ? 'white' : 'black' }]}
  placeholderTextColor={theme.type === 'dark' ? 'white' : 'black'}
  placeholder={t('enter_a_url_or_search_query')}
  onChangeText={(text) => setInput(text)} />
          <TouchableOpacity onPress={urlVisitFunction}
            style={styles.goButton}>
            <Text style={styles.goButtonText}>{t('go')}</Text>
          </TouchableOpacity>
        </View>
        <WebViewComponent url={url}
          prev={prev}
          next={next}
          loading={loading}
          setLoading={setLoading}
          webviewRef={webviewRef}
          navStateFunction={navStateFunction}
          reloadFunction={reloadFunction}
          stopFunction={stopFunction}
          increaseFontSize={increaseFontSize}
          decreaseFontSize={decreaseFontSize}
          zoom={zoom}
          panResponder={panResponder}
          currscale={currscale}
          
          />
        <View style={[styles.toolbar,{backgroundColor: theme.menuItemBG}]}>
        <TouchableOpacity style={[styles.navigationButton, { alignItems: 'center' }]} onPress={prevFunction} disabled={!prev}>
        <Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/backw.png')
                        : require('../assets/backb.png')
                    }
                    style={{ width: 20, height: 20 }}

                  />
<Text style={[styles.iconText, { color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('back')}</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.navigationButton, { alignItems: 'center' }]} onPress={nextFunction} disabled={!next}>
<Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/forwardw.png')
                        : require('../assets/forwardb.png')
                    }
                    style={{ width: 20, height: 20 }}

                  />
<Text style={[styles.iconText, { marginRight: -10, color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('forward')}</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.clearButton, { alignItems: 'center' }]} onPress={histCleatFunction}>
<Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/deleteb.png')
                        : require('../assets/deletew.png')
                    }
                    style={{ width: 20, height: 20 }}

                  /> 
                   <Text style={[styles.iconText, { color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('clear')}</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.historyButton, { alignItems: 'center' }]} onPress={loadHistFunction}>
  <Icon name="history" size={18} color={theme.type === 'dark' ? 'white' : 'black'} />
  <Text style={[styles.iconText, { color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('history')}</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.reloadButton, { alignItems: 'center' }]} onPress={reloadFunction}>
<Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/reloadw.png')
                        : require('../assets/reloadb.png')
                    }
                    style={{ width: 20, height: 20 }}

                  /> 
                    <Text style={[styles.iconText, { color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('reload')}</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.fontButton, { alignItems: 'center' }]} onPress={() => navigation.navigate('MainPage')}>
<Image
                    source={
                      theme.type == 'dark'
                        ? require('../assets/homew.png')
                        : require('../assets/homeb.png')
                    }
                    style={{ width: 20, height: 20 }}

                  />   
                  <Text style={[styles.iconText, { color: theme.type === 'dark' ? 'white' : 'black' }]}>{t('home')}</Text>
</TouchableOpacity>


          {/* <TouchableOpacity onPress={increaseFontSize} 
                                  style={styles.fontButton}>
                    <Icon name="font" size={18} color="black" />
                    <Text style={styles.iconText}>+ Font</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={decreaseFontSize} 
                                  style={styles.fontButton}>
                    <Icon name="font" size={18} color="black" />
                    <Text style={styles.iconText}>- Font</Text>
                </TouchableOpacity> */}
        </View>
        <HistoryModal history={history}
          histShow={histShow}
          setHistShow={setHistShow}
          setUrl={setUrl} />
      </View>
    </ImageBackground>
   {/* <View style={{marginTop:'10px'}}>
      <BottomMenu navigation={navigation} />
    </View> */}
    </>
  );
};

export default BrowserScreen;
const styles = StyleSheet.create({
  imgBackground: {
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  MainWrapper: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 15,
    marginLeft: 16,
    marginRight: 16,
  },

	container: {
		flex: 1,
		// backgroundColor: 'transparent',
		// padding: 10,
	},
	header: {
		marginTop: 20,
		alignItems: 'center',
	},
	headerText: {
		fontSize: 28,
		color: 'purple',
	},
	subHeaderText: {
    marginTop:10,
		fontSize: 16,
		color: 'white',
		textAlign: 'center',
		marginBottom: 5,
	},
	searchContainer: {
    marginTop:5,
		flexDirection: 'row',
		alignItems: 'center',
		// marginBottom: 10,
    paddingHorizontal:15,
    paddingVertical:12
	},
	textInput: {
		flex: 1,
		height: 40,
		borderColor: 'purple',
    color: 'white',
		borderWidth: 2,
		marginRight: 10,
    borderRadius:20,
    paddingHorizontal:20    
	},
	goButton: {
		backgroundColor: 'purple',
		paddingVertical: 13,
		borderRadius: 5,
		alignItems: 'center',
		width: 70,
    borderRadius:20
	},
	goButtonText: {
		color: 'white',
	},
	toolbar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
    textAlign:'center',
		padding: 5,
    paddingHorizontal:15
	},
	navigationButton: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 5,
	},
	clearButton: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 5,
	},
	historyButton: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 5,
	},
	webviewContainer: {
		flex: 1,
		position: 'relative',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFill,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	historyItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'lightgray',
	},
	closeModalButton: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	closeModalButtonText: {
		color: 'white',
	},
	iconText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 10,
	},
	noHistoryText: {
		fontSize: 18,
		color: 'black',
		textAlign: 'center',
		marginVertical: 20,
	},
	reloadButton: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 5,
	},
	stopButton: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 5,
	},
	fontButton: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 5,
	},
});
