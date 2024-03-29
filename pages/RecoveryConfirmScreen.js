import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, Alert } from 'react-native';
import Header from '../components/header';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const MnemonicComponent = ({ mnemonic, theme, hiddenIndices, setInputValues, inputValues }) => {
  const wordsArray = mnemonic.split(' ');

  const handleInputChange = (index, text) => {
    setInputValues(prevInputValues => {
      const newInputValues = [...prevInputValues]; // Create a copy of the previous inputValues array
      newInputValues[index] = text; // Update the value at the specified index
      return newInputValues; // Return the updated array
    });
  };

  return (
    <View style={{ padding: 2, borderWidth: 1, borderRadius: 5, borderColor: 'transparent', backgroundColor: 'transparent', marginBottom: 10 }}>
  <View style={{ marginBottom: 10 }}>
    <FlatList
      data={wordsArray}
      renderItem={({ item, index }) => (
        <View key={index} style={{ height: '20%', marginBottom: 5, width: '80%', marginRight: -87 }}>
          <View style={{ borderWidth: 1, borderRadius: 5, paddingHorizontal: 5, borderColor: theme.wordBorder, width: '60%', flexDirection: 'row', alignItems: 'center', height: 40 }}>
            {hiddenIndices.includes(index) ? (
              <>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <TextInput
                    style={{ color: theme.text, textAlign: 'center' }}
                    onChangeText={text => handleInputChange(index, text.toLowerCase().replace(/\s+/g, ''))}
                    value={inputValues[index]}
                    maxLength={20}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={{ color: theme.text, textAlign: 'center', flex: 2 }}>{`${item}`}</Text>
              </>
            )}
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  </View>
</View>

  );
};

export default function RecoveryConfirmScreen({ navigation, route }) {
  const { mnemonic } = route.params;
  const { theme } = useContext(ThemeContext);
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const maxHidden = Math.min(3, mnemonic.split(' ').length); // Maximum 3 words to hide
    setHiddenIndices(generateRandomIndices(maxHidden));
    setInputValues(new Array(mnemonic.split(' ').length).fill(''));
  }, [mnemonic]);

  const generateRandomIndices = (count) => {
    const indices = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * mnemonic.split(' ').length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  };

  const verifyInputs = () => {
    // Check if all hidden input fields are filled
    const hiddenInputsFilled = inputValues.filter((value, index) => hiddenIndices.includes(index)).every(value => value.trim() !== '');

    if (!hiddenInputsFilled) {
      setErrorMessage('Please fill in all hidden input fields.');
      return;
    }

    // Now, you can compare inputValues with the original mnemonic
    for (let i = 0; i < hiddenIndices.length; i++) {
      if (inputValues[hiddenIndices[i]] !== mnemonic.split(' ')[hiddenIndices[i]]) {
        setErrorMessage(`The entered value for word ${hiddenIndices[i] + 1} does not match the original mnemonic.`);
        return;
      }
    }

    // Log the input array
    console.log('User Input:', inputValues);
    setErrorMessage('');
    navigation.navigate('SetPasswordScreen');
  };

  return (
    <ScrollView style={{ backgroundColor: theme.screenBackgroud }}>
      <Header
        title="Secret Key"
        onBack={() => navigation.goBack()}
      />
      <View style={{ marginLeft: 16, marginRight: 16, marginBottom: 50 }}>
        <View style={{ gap: 0, marginBottom: 30 }}>
          <Text style={{ fontFamily: 'SF Pro Text', fontSize: 24, fontStyle: 'normal', fontWeight: '600', marginTop: 15, color: theme.text }}>
            Confirm your Recovery Phrase
          </Text>
          <Text style={{ fontSize: 14, marginTop: 12, color: theme.text }}>
            Fill in the blank boxes with right order
          </Text>
        </View>
        {errorMessage !== '' && (
          <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
        )}
        <View>
          <MnemonicComponent
            mnemonic={mnemonic}
            theme={theme}
            hiddenIndices={hiddenIndices}
            setInputValues={setInputValues}
            inputValues={inputValues}
          />
          <View>
            <TouchableOpacity
              style={{ paddingVertical: 14, paddingHorizontal: 12, borderStyle: 'solid', borderWidth: 1, borderRadius: 1000, borderColor: theme.buttonBorder }}
              onPress={verifyInputs}>
              <Text style={{ textAlign: 'center', fontFamily: 'SF Pro Text', fontSize: 14, fontWeight: '600', color: theme.text }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
