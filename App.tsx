import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import ReimbursementScreen from './components/reimbursements-screen';
import LoginScreen from './components/login-screen';

export default function App() {
  const [user,setUser] = useState({username:'', isManager:false});
  
  return (
    <View>
      <StatusBar/>
        {!user.username ?
          <LoginScreen updateUser={setUser}/> 
          :<ReimbursementScreen updateUser={setUser}/>}
    </View>
  );
}