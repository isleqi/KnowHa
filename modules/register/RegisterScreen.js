import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


let timerId;
export default class RegisterScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
        time:10,
        sendFlag:true,
    };

  }

  timer=()=>{
      let time=this.state.time-1;
      this.setState({
          time:time
      })
      if(time==0){
          clearInterval(timerId);
          this.setState({
            sendFlag:true,
            time:10
          })
      }
  }

  sendCode=()=>{
        console.log("!!!");
        timerId= setInterval(() => {
           this.timer()
          }, 1000);
          this.setState({
              sendFlag:false
          })
      
  }

  register=()=>{
    this
    .props
    .navigation
    .navigate('RegisterDetail');
  }


  render() {
      let bottonColor=this.state.sendFlag? '#c1c1c1':'white';
      let textColor=this.state.sendFlag? 'white':'black';
    return (
      <View style={styles.container}>

        <View style={styles.content}>
          <View style={{ alignItems: 'center', paddingBottom: 20 }}>
            <Text style={{ fontSize: 30 }}>知哈</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <TextInput placeholder="请输入手机号或者邮箱"></TextInput>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
              <View style={{flexDirection:'row'}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
             
              <TextInput style={{flex:1}} placeholder="请输入验证码" ></TextInput>
       
              <TouchableOpacity onPress={this.state.sendFlag? ()=>this.sendCode():()=>{}}>
             
              <View  style={{backgroundColor:bottonColor, borderRadius:5,padding:5}}><Text style={{ textAlign:'center',fontSize:12,color:textColor}}>{this.state.sendFlag? '获取验证码':this.state.time+' 秒'}</Text></View>
              </TouchableOpacity>

              </View>
              </View>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>

            </View>
          </View>
      
           <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
           <TouchableOpacity onPress={()=>this.register()} style={{ flex: 1,flexDirection: 'row',  }}>
            <View style={{
              flex: 1, backgroundColor: '#0084ff', borderRadius: 10, alignItems: 'center',
              justifyContent: 'center', paddingTop: 10, paddingBottom: 10
            }}>
              <Text style={{ fontSize: 15, color: 'white' }}>注册</Text>
             
            </View>
            </TouchableOpacity>
          </View>
          
        </View>


      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 80
  },
  content: {
    flex: 1,
    //  backgroundColor:'red',
    alignItems: "center",
  }

});