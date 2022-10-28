// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert, ScrollView } from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createStackNavigator } from '@react-navigation/stack';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

//import historyJson from '/history.json'; 
var historyJson = require('/history.json');
 
var historyJson2
var test
var globalVar
//SecureStore.setItemAsync('@historyjson', value, options)
getData()

  async function storeData() {
    try {
      //alert("storing it")
      //alert("next")
      await AsyncStorage.setItem('@history', JSON.stringify(historyJson))
      //alert(`stored historyjson`)
    } catch (e) {
      alert('error storing')
    }
  }
  
  async function getData() { 
    try {
      //alert('running')
      var value = await AsyncStorage.getItem('@history')
      if(value !== null) {
        //alert(value) 
        historyJson2 = value
        try{
          historyJson2 = JSON.parse(historyJson2)
          test = historyJson2.data[0]
        } catch {
          test = 1
        } 
        //alert(test)
        if(test != 1){
          //alert('its good')
          historyJson = historyJson2
        }

      } else{
        //alert("its null")
      }
    } catch(e) { 
      alert('error getting')
    }
  }

//






function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      Alert.alert( '',`Barcode Type: ${type}\nData: ${data}`,[{text: 'OK', onPress: () => setScanned(false)}])
      //alert(`${data}`)
      historyJson.type.push(`${type}`)
      historyJson.data.push(`${data}`)
      storeData()


      //storeData(historyJson)
    };

    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }



  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={''} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const Stack = createStackNavigator();

function HistoryScreen() {
  return (
    <Stack.Navigator initialRouteName="HistoryDetails">
      <Stack.Screen name="History" component={HistoryDetailsScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

var historyButtons
var historyNum = 0
var bruh = <Text></Text>
var textElem
var historyNav
var fake

function HistoryDetailsScreen({ navigation, bruh2 }) {
  historyNav = navigation
  historyButtons = []
  fake = bruh2
  
  //alert(historyJson)

  for(let i=0; i < historyJson.type.length; i++){ 
     textElem = React.createElement(List.Item, {title:historyJson.data[`${i}`], description:historyJson.type[`${i}`], right:props => <List.Icon icon="arrow-right"/>, onPress:() => {historyNum = `${i}`; navigation.navigate('Details')}} , null);
     historyButtons.unshift(textElem)
  }

  bruh = <Text></Text>
  React.useEffect(
    () => navigation.addListener('focus', () => navigation.navigate("History", "a") ,
    []
  ));




  



  return(
      <ScrollView style={{ flex: 1 }}>

      

      {historyButtons}
      

      </ScrollView>
  )
}

function yeet(){
  //alert('yeet')
  historyButtons = []
  for(let i=0; i < historyJson.type.length; i++){ 
     textElem = React.createElement(List.Item, {title:historyJson.data[`${i}`], description:historyJson.type[`${i}`], right:props => <List.Icon icon="arrow-right"/>, onPress:() => {historyNum = `${i}`; historyNav.navigate('Details')}} , null);
     historyButtons.unshift(textElem)
  }
}


/*
function renderSomething({ num }){
  return(
  <Button title= {historyJson.data['${num}']} onPress={() => {historyNum = '${num}'}}/>  
  )
}
*/
function DetailsScreen({navigation}) {
  //alert(`${historyNum}`)
  //alert(`${historyJson.type[0]}`)

  
  return(
      <View style={{ flex: 1, alignItems: 'center' }}> 
      <Text> </Text>
        <Text selectable>Type: {historyJson.type[historyNum]}</Text>
        <Text> </Text>
        <Text selectable>Data: {historyJson.data[historyNum]}</Text>
      </View>
  )
}

const Tab = createBottomTabNavigator();


export default function App() {
  
  return (

    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Camera') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'bookmark-multiple' : 'bookmark-multiple-outline';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>



  );
}
