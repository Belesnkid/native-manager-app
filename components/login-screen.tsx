import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import Employee from '../dtos/employee';

export default function LoginScreen(props:{updateUser:Function}){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [manager,setManager] = useState(false);
    const url = 'https://djb-reimbursement-back-end.azurewebsites.net';

    async function login(){
        const payload = {
            username:username,
            pass:password
        }
        const response = await fetch(`${url}/login`,{
            method:"PATCH",
            body: JSON.stringify(payload),
            headers: { 'content-type': 'application/json' }
        })
        const employee:Employee = await response.json();
        if(!employee.id){
            alert("Login Failed");
        }
        else if(!employee.isManager){
            alert("You need to be a manager to use this application.");
        }
        else{
            props.updateUser({username:employee.uName, isManager:employee.isManager})
        }
    }

    useEffect(() => {
        async() =>{
            setUsername(await AsyncStorage.getItem('username')?? "");
            setManager(Boolean(await AsyncStorage.getItem('isManager'))?? false);
        }
        props.updateUser({username:username, isManager:manager})
    },[])

    return(<View style={{flexDirection:"column", alignItems:'center',justifyContent:'center', backgroundColor:'#4169e1', padding: 20, height:"100%"}}>
        <Text style={{color:'#fff', fontSize:25}}>Login Screen</Text>
        <View style={{padding: 5, width:'90%'}}>
        <TextInput style={{backgroundColor:'#fff', padding:5}} onChangeText={t => setUsername(t)} placeholder='Username'/>
        </View>
        <View style={{padding: 5, width:'90%', paddingBottom:20}}>
        <TextInput secureTextEntry={true} style={{backgroundColor:'#fff',padding: 5}} onChangeText={t => setPassword(t)} placeholder='Password'/>
        </View>
        <Button onPress={login} title='Login'/>
    </View>)
}