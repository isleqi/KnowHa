import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


export default class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  navigateToRegister=()=>{
    this
        .props
        .navigation
        .navigate('Register');
}



  render() {
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
              <TextInput placeholder="请输入密码"></TextInput>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
            <View style={{
              flex: 1, backgroundColor: '#0084ff', borderRadius: 10, alignItems: 'center',
              justifyContent: 'center', paddingTop: 10, paddingBottom: 10
            }}>
              <Text style={{ fontSize: 15, color: 'white' }}>登录</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: 40 }}>
            <Text style={{ fontSize: 13, color: '#c1c1c1' }}>没有账号？</Text>
            <TouchableOpacity onPress={()=>this.navigateToRegister()}>
            <Text style={{ fontSize: 13, color: '#0084ff' }}> 注册</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', paddingBottom: 10,paddingLeft:10,paddingRight:10}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
            <Image source={require("../../resources/login/weixin.png")} style={{ height: 40, width: 40 }} />
            <Image source={require("../../resources/login/qq.png")} style={{ height: 40, width: 40 }} />
            <Image source={require("../../resources/login/weibo.png")} style={{ height: 40, width: 40 }} />
            <Image source={require("../../resources/login/github.png")} style={{ height: 40, width: 40 }} />
         </View>
          </View>







        </View>

      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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