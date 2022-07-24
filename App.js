import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Switch, StyleSheet, Text, View, Button, Platform} from 'react-native';
import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Network from 'expo-network';

import Details from './Details';
import Categories from './Categories';

import ListContainer from './components/ListContainer'

import styles from './Appstyles'

function HomeScreen({navigation}) {
  fetch(`https://dwacrudapidemo1.herokuapp.com/api/v1/cars`)
  .then(res => res.json())
  .then(data=> console.log(data))
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  Network.getNetworkStateAsync().then(data=>{
    console.log({data})
  })
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.largeHeading, styles.italicFont]}>List of Cars</Text>
      <Button title="Go to Details" onPress={()=> navigation.navigate('Details') }/>
      <ListContainer />
      <StatusBar style="auto" />
    </SafeAreaView>
  );

}
const Stack = createNativeStackNavigator();
export default function App() {
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"App Name"}}/>
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Categories" component={Categories} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

