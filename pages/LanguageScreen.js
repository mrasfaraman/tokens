import React, {useState, useContext,useEffect} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import Header from '../components/header';
import {ThemeContext} from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';


const LANGUAGES = [
  {
    language: 'English',
    lang: 'en',
    flag: require('../assets/images/Eng.png'),
  },
  {
    language: 'Indian',
    lang: 'in',
    flag: require('../assets/images/Indian.png'),
  },
  {
    language: 'Spanish',
    lang: 'es',
    flag: require('../assets/images/Spain.png'),
  },
  {
    language: 'French',
    lang: 'fr',
    flag: require('../assets/images/French.png'),
  },
  {
    language: 'Russian',
    lang: 'ru',
    flag: require('../assets/images/Russian.png'),
  },
  {
    language: 'Arabic',
    lang: 'ar',
    flag: require('../assets/images/Arabic.png'),
  },
  {
    language: 'German',
    lang: 'de',
    flag: require('../assets/images/German.png'),
  },
  {
    language: 'Chinese',
    lang: 'zh',
    flag: require('../assets/images/Chinese.png'),
  },
  {
    language: 'English',
    lang: 'uk',
    flag: require('../assets/images/UK.png'),
  },
];
export default function LanguageScreen({navigation}) {
  const [language, setLanguage] = useState();
  const [name, setName] = useState();
  const {theme} = useContext(ThemeContext);
  const {t} = useTranslation();

  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (selectedLanguage) {
          setLanguage(selectedLanguage);
          i18n.changeLanguage(selectedLanguage);
        }
      } catch (error) {
        console.error('Error loading selected language:', error);
      }
    };
    loadSelectedLanguage();
  }, []);

  const setLanguageAndStore = async (lang, langName, flag) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', lang);
      await AsyncStorage.setItem('selectedName', langName);
      await AsyncStorage.setItem('selectedFlag', JSON.stringify(flag)); 
      setLanguage(lang);
      setName(langName);
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error setting selected language:', error);
    }
  };

  useEffect(() => {
    const loadName = async () => {
      try {
        const savedName = await AsyncStorage.getItem('selectedName');
        if (savedName) {
          setName(savedName);
        }
      } catch (error) {
        console.error('Error loading selected name:', error);
      }
    };
    loadName();
  }, []);

  function renderItem({item}) {
    // const {flag} = item;
    return (
      <TouchableOpacity
        onPress={() => setLanguageAndStore(item.lang, item.language, item.flag)}
        style={
          language === item.lang
            ? [
                {
                  backgroundColor: theme.menuItemBG,
                  borderColor: theme.langItmBorder,
                },
                styles.item,
                styles.selected,{ borderColor: theme.emphasis}
              ]
            : [
                {
                  backgroundColor: theme.menuItemBG,
                  borderColor: theme.langItmBorder,
                },
                styles.item,
              ]
        }>
        <View style={styles.itemLeft}>
          <Image source={item.flag} />
          <Text style={{color: theme.text}}>{item.language}</Text>
        </View>
        <View>
          <RadioButton value={item.lang}  color={theme.emphasis} />
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <ScrollView style={{backgroundColor: theme.screenBackgroud}}>
      <Header
        title={t('language')}
        skipOption={false}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={[styles.input, {backgroundColor: theme.menuItemBG}]}>
          <Image
            style={styles.imgStyle}
            source={theme.type == 'dark' ? require('../assets/images/search-md.png') : require('../assets/images/list-search-dark.png')}
          />
          <TextInput
            style={[styles.searchInput, {color: theme.text}]}
            placeholder="Search"
            placeholderTextColor={theme.text}
          />
        </View>
        <RadioButton.Group
  onValueChange={lang => {
    const selectedLanguage = LANGUAGES.find(item => item.lang === lang);
    if (selectedLanguage) {
      setLanguageAndStore(selectedLanguage.lang, selectedLanguage.language, selectedLanguage.flag);
    }
  }}
  value={language}
>
          <FlatList data={LANGUAGES} renderItem={renderItem} />
        </RadioButton.Group>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // screen: {
  //   // backgroundColor: '#280D2C',
  // },
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
    gap: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    // border: 1px solid #313843;
    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: '#313843',
    // marginVertical: 12,
    marginBottom: 12,
    // backgroundColor: '#362538',
  },
  itemLeft: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    // justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    // gap: 188,
    // alignSelf: 'stretch',
  },
  selected: {
    borderRadius: 16,
    // border: '2px solid var(--Secodary, #F43459)',
    borderWidth: 2,
    // borderColor: '#F43459',
    borderStyle: 'solid',

    // backgroundColor: '#362538',
  },
  input: {
    flexDirection: 'row',
    // backgroundColor: '#362538',
    alignItems: 'center',
    padding: 14,
    paddingVertical: 0,
    justifyContent: 'flex-start',
    borderRadius: 1000,
  },
  imgStyle: {
    width: 24,
    height: 24,
  },
  searchInput: {
    minWidth: '100%',
    // color: 'white',
  },
});
