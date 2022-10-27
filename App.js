import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, TextInput, Button } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';

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


   if (isFirstLaunch == true){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
 
);
  }else if(loggedInStates == loggedInStates.LOGGED_IN){
    return <Navigation/>
  }
else if(loggedInState == loggedInStates.NOT_LOGGED_IN){
  return(<View>
    <TextInput style={styles.input}
    placeholderTextColor='#0000FF'
    placeholder='Phone Number'
    value ={phoneNumber}
    onChangeText={setPhoneNumber}>  
    </TextInput>
    <Button
    title='Send'
      style={styles.button}
      onPress={async()=>{
        
        if(phoneNumber == ""){
          alert('You have no power here without a phone number!')
          console.log('this fool did not enter a phone number!')
        }
        else if(phoneNumber.length < 10){
          alert('I am sorry, but your input needs to be a little longer, I cannot understand gibberish!')
          console.log('This dolt thinks they can get away with too short of a number!')
        }
        else if(phoneNumber.length > 10){
          alert('I am sorry, but your input needs to be a little shorter, I cannot understand gibberish!')
          console.log('This dope seems to think too much information is ok!')
        }
        else{
          console.log('As you wish, my liege.')
          alert("as you wish.")
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
    onChangeText={setOneTimePassword}>
    </TextInput>
    <Button
    title='Confirm'
    style={styles.button}
    onPress={async()=>{
      if(oneTimePassword == ""){
        alert('You did not give me the password, you must now ask again!')
        console.log('sending this dolt back to the phone number screed')
        setLoggedInState(loggedInStates.NOT_LOGGED_IN)
      }
      
      }}>      
    </Button>
  </View>
  )
}
}

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