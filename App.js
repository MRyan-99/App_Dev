import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppStack = createNativeStackNavigator();
const loggedInStates={
  NOT_LOGGED_IN: 'NOT_LOGGED_IN',
  LOGGED_IN: 'LOGGED_IN',
  CODE_SENT: 'CODE_SENT'
}

const App = () =>{
  const [isFirstLaunch, setFirstLaunch] = React.useState(true);
  const [loggedInState, setLoggedInState] = React.useState(loggedInStates.NOT_LOGGED_IN);
  const [homeTodayScore, setHomeTodayScore] = React.useState(0);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [oneTimePassword, setOneTimePassword] = React.useState(null);

  useEffect(()=>{
    const getSessionToken = async()=>{
      const sessionToken = await AsyncStorage.getItem('sessionToken')
      console.log('retrieving ID', sessionToken)
      const validateResponse = await fetch('https://dev.stedi.me/validate/' +sessionToken,
      {
        method:'GET',
        headers: {
          'content-type' : 'application/text'
        }
      })
      if(validateResponse.status==200){
        const userName = await validateResponse.text()
        console.log('Logged in')
        await AsyncStorage.setItem('userName', userName)
        console.log('User Name', userName)
        setLoggedInState(loggedInStates.LOGGED_IN)
      }

    }
    getSessionToken();
  })


   if (isFirstLaunch == true){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
 
);
  }else if(loggedInState == loggedInStates.LOGGED_IN){
    return <Navigation/>
  }
else if(loggedInState == loggedInStates.NOT_LOGGED_IN){
  return(<View>
    <TextInput style={styles.input}
    placeholderTextColor='#0000FF'
    placeholder='10-digit phone number'
    value ={phoneNumber}
    onChangeText={setPhoneNumber}
    keyboardType ="numeric">  
    </TextInput>
    <Button
    title='Send'
      style={styles.button}
      onPress={async()=>{
        
        if(phoneNumber == ""){
          Alert.alert('Failure!','You have no power here without a phone number!')
          console.log('This fool did not enter a phone number!')
        }
        else if(phoneNumber.length < 10){
          Alert.alert('Failure','I am sorry, but your input needs to be a little longer, I cannot understand gibberish!')
          console.log('This dolt thinks they can get away with too short of a number!')
        }
        else if(phoneNumber.length > 10){
          Alert.alert('Failure!','I am sorry, but your input needs to be a little shorter, I cannot understand gibberish!')
          console.log('This dope seems to think too much information is ok!')
        }
        else{
          console.log('As you wish, my liege.')
          Alert.alert("Success!",'As you wish.')
        await fetch('https://dev.stedi.me/twofactorlogin/' +phoneNumber,
        {
         method:'POST', 
         headers:{
          'content-type':'application/text'
         }
        }
        )
        setLoggedInState(loggedInStates.CODE_SENT)

      }
      
    }
  }
      />
      </View>)

  } 
else if(loggedInState == loggedInStates.CODE_SENT){
  return(
  <View>
    <TextInput style={styles.input}
    placeholderTextColor='#0000FF'
    placeholder='Code'
    value={oneTimePassword}
    onChangeText={setOneTimePassword}
    keyboardType ="numeric">
    </TextInput>
    <Button
    title='Confirm'
    style={styles.button}
    onPress={async()=>{
      console.log('login request was made')
      const loginResponse=await fetch(
        "https://dev.stedi.me/twofactorlogin",
        {
          method:'POST',
          headers:{
            'content-type':'application/text'
          },
          //11/1/22 code body in class
         body:JSON.stringify({
           phoneNumber,
           oneTimePassword
         })
          })      
      
      if(oneTimePassword == ""){
        Alert.alert('Failure!','You did not give me the password, you must now ask again!')
        console.log('Sending this dolt back to ask for a password')
        setLoggedInState(loggedInStates.NOT_LOGGED_IN)
      }
      //11/1/22 code below in class, make sure it is a .status request
      else if(loginResponse.status==200){
        Alert.alert('Success!', 'You are now logged in')
        console.log('This wizard has finally been able to log in correctly')
        console.log('Phone Number', phoneNumber)
        console.log('Onetime Password', oneTimePassword)
        setLoggedInState(loggedInStates.LOGGED_IN)
        const sessionToken=await loginResponse.text()
        console.log('Session Token', sessionToken)
        await AsyncStorage.setItem('sessionToken', sessionToken)

      }
      else{
        Alert.alert('Failure!','Your password does not match' , )
        console.log('This doofus thought they could sneak by without the correct password!')
        setLoggedInState(loggedInStates.NOT_LOGGED_IN)
      }
      }
    }
          
    />
  </View>)}}

export default App;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center'
  },
  input: {
    height:40,
    marginTop:100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  margin:{
    marginTop:100
  },
  button: {
    alignItems: "center",
    backgroundColor: "#EB00C7",
    padding: 10
  }
  
})