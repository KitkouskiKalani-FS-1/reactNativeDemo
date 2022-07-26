import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Switch, StyleSheet, Text, View, Button, Platform, TextInput, TouchableHighlight, TouchableOpacity, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Card} from 'react-native-paper';
import {AntDesign} from '@expo/vector-icons'


import Details from './Details';
import Categories from './Categories';

import styles from './Appstyles'



function HomeScreen({navigation}) {
  
  const[cars, setCars] = useState(null)
  const[loading, setLoading] = useState(false)
  const[error, setError] = useState(null)

  const [carMake, onChangeCarMake]= useState("")
  const [carModel, onChangeCarModel]= useState("")
  let ignore = false;
  useEffect(()=>{

    if(!ignore){
      getCars();
    }

    return()=>{
      ignore = true;
    }
}, [])

  const getCars = async () =>{
    setLoading(true)
    try{
      await fetch(`https://dwacrudapidemo1.herokuapp.com/api/v1/cars`)
        .then(res => res.json())
        .then(data =>{
          console.log({data})
          setCars(data)
        })
    } catch(error){
      setError(error.message || "Unexpected Error")
    } finally{
      setLoading(false)
    }
  }
  const createCar = async (make, model)=> {
    try{
        await fetch(`https://dwacrudapidemo1.herokuapp.com/api/v1/cars`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
              "make": carMake,
              "model": carModel,
            })
        })
          .then(()=> getCars())
      } catch(error){
        setError(error.message || "Unexpected Error")
      } finally{
        setLoading(false)
      }
  }
  const deleteCar = async (id)=> {
    try{
        await fetch(`https://dwacrudapidemo1.herokuapp.com/api/v1/cars/${id}`, {
            method: 'DELETE'
        })
          .then(res => res.json())
          .then(data =>{
            setCars(data)
            navigate("/dashboard", {replace: true})
          })
      } catch(error){
        setError(error.message || "Unexpected Error")
      } finally{
        setLoading(false)
      }
}
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.largeHeading, styles.italicFont]}>List of Cars</Text>
  
      <Text>Create new car:</Text>
      <TextInput label="Make" style={styles.input} type="text" onChangeText={(text) => onChangeCarMake(text)}/>
      <TextInput label="Model" style={styles.input} type="text" onChangeText={(text) => onChangeCarModel(text)}/>
      <Button title="Add" onPress={()=>createCar(carMake,carModel)}>
        <View style={styles.button}>
          <Text>Submit Car</Text>
        </View>
      </Button>
      <Text>List of all Cars:</Text>
      <FlatList
        data={cars}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({item}) => {
          return(
            <Card style={{ padding: 16, margin: 16}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
              <Text>{item.make}</Text>
              <Text>{item.model}</Text>
              <TouchableOpacity onPress={()=>deleteCar(item._id)}>
                  <AntDesign name="delete" size="24"/>
              </TouchableOpacity>
              <Button title="View Car Details" onPress={()=> navigation.navigate('Details') }/>
              </View>
            </Card>
          )
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );

}
const Stack = createNativeStackNavigator();
export default function App() {
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"Cars Dashboard"}}/>
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Categories" component={Categories} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

