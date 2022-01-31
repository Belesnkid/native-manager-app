import axios from "axios";
import React, { useEffect, useState } from "react";
import {Button, FlatList, Text, TextInput, ToastAndroid, View } from "react-native";
import ReimbursementRequest from "../dtos/reimbursement-request";
import  AsyncStorage  from '@react-native-async-storage/async-storage';

export default function ReimbursementScreen(props:{updateUser:Function}){

    const url = 'https://djb-reimbursement-back-end.azurewebsites.net/reimbursements'
    const [requests,setRequests] = useState<ReimbursementRequest[]>([]);
    const [manReason, setManReason] = useState('');

    async function getRequests(){
        const response = await axios.get(`${url}/open`);
        setRequests(response.data);
    }

    useEffect(()=>{
        getRequests();
    }, []);

    function requestItem(props:{r:ReimbursementRequest, myRefresh:Function, reason:string, setReason:Function}){        
    
        async function approve(){
            if(props.reason === ''){
                props.setReason('Default Approve');
            }
                let update:ReimbursementRequest = props.r;
                update.pending = false;
                update.approved = true;
                update.manReason = props.reason;
                await fetch(url, {
                    method:"PATCH",
                    body:JSON.stringify(update),
                    headers: { 'content-type': 'application/json' }
                })
                ToastAndroid.show(`Approved request ${update.id}`, ToastAndroid.SHORT);
                props.myRefresh();
        }
    
        async function deny(){
            if(props.reason === ''){
                props.setReason('Default Deny')
            }
                let update:ReimbursementRequest = props.r;
                update.pending = false;
                update.approved = false;
                update.manReason = props.reason;
                await fetch(url, {
                    method:"PATCH",
                    body:JSON.stringify(update),
                    headers: { 'content-type': 'application/json' }
                })
                ToastAndroid.show(`Denied request ${update.id}`, ToastAndroid.SHORT);
                props.myRefresh();
                
        }
    
        return (<View style={{flexDirection:"column", alignItems:'center', backgroundColor:'#4169e1', paddingTop: 20,}}>
            <Text style={{color:'#fff'}}>Request ID: {props.r.id}</Text>
            <Text style={{color:'#fff'}}>Employee ID: {props.r.employeeId}</Text>
            <Text style={{color:'#fff'}}>Amount: {props.r.amount}</Text>
            <Text style={{color:'#fff'}}>Given Reason: {props.r.empReason}</Text>
            <TextInput style={{backgroundColor:'#fff',padding: 5, width:'90%',}} onChangeText={t => props.setReason(t)} placeholder="Reason"/>
            <View style={{flexDirection:'row', justifyContent:"space-evenly", width:"100%", padding: 10, paddingBottom:25}}>
                <Button onPress={approve} title="Approve"/>
                <Button onPress={deny} title="Deny"/>
            </View>
        </View>)
    }

    function logout(){
        alert("Logout");
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('isManager');
        props.updateUser({username:'', isManager:false});
    }

    return(
    <View style={{height:"120%"}}>
        <View><Button title="Logout" onPress={logout}></Button></View>
    <View>
        <FlatList data={requests} renderItem={({item}) => requestItem({r:item, myRefresh:getRequests, reason:manReason, setReason:setManReason})} keyExtractor={item => item.id}/>
    </View>
    </View>
    );
}