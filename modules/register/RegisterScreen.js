import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,ToastAndroid,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import Base from '../../utils/Base';
import ScreenUtil from '../../utils/ScreenUtil';


let baseUrl = Base.baseUrl;

let timerId;
export default class RegisterScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      sendFlag: true,
      account: '',
      password: '',
      code: '',
      type: ''
    };

  }

  timer = () => {
    let time = this.state.time - 1;
    this.setState({
      time: time
    })
    if (time == 0) {
      clearInterval(timerId);
      this.setState({
        sendFlag: true,
        time: 10
      })
    }
  }

  sendCode = () => {
    console.log("!!!");
    timerId = setInterval(() => {
      this.timer()
    }, 1000);
    this.setState({
      sendFlag: false
    })
    let type;
    let str;
    let formData = new FormData();

    if (this.state.account.indexOf('@') != -1) {
      type = 'email';
      str = 'sendUserEmail';
      formData.append("Email", this.state.account);
    }
    else {
      type = 'mobile';
      str = 'sendUserMsm';
      formData.append("mobile", this.state.account);
    }

    this.setState({
      type: type
    });

    let url =baseUrl+ '/app/register/' + str;



    fetch(url, {
      method: 'POST',
      body: formData

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200")
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
    })

  }

  register = () => {
    let formData = new FormData();
    let str;
    if (this.state.type == 'email') {
      str = 'checkEmilCode';
      formData.append("email", this.state.account);
    }
    else {
      str = 'checkPhoneCode';
      formData.append("phone", this.state.account);
    }
    formData.append('code', this.state.code);

    let url = baseUrl+'/app/register/' + str;
    fetch(url, {
      method: 'POST',
      body: formData

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200")
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        else{
          this
          .props
          .navigation
          .navigate('RegisterDetail',{
            'account':this.state.account,
            'type':this.state.type
          });
        }
    })
  
  }


  render() {
    let bottonColor = this.state.sendFlag ? '#c1c1c1' : 'white';
    let textColor = this.state.sendFlag ? 'white' : 'black';
    return (
      <View style={styles.container}>

        <View style={styles.content}>
          <View style={{ alignItems: 'center', paddingBottom: 20 }}>
            <Text style={{ fontSize: 30 ,fontWeight:'bold'}}>知哈</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <TextInput placeholder="请输入手机号或者邮箱" onChangeText={(account) => this.setState({ account })}></TextInput>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                  <TextInput style={{ flex: 1 }} placeholder="请输入验证码" onChangeText={(code) => this.setState({ code })} ></TextInput>

                  <TouchableOpacity onPress={this.state.sendFlag ? () => this.sendCode() : () => { }}>

                    <View style={{ backgroundColor: bottonColor, borderRadius: 5, padding: 5 }}><Text style={{ textAlign: 'center', fontSize: 12, color: textColor }}>{this.state.sendFlag ? '获取验证码' : this.state.time + ' 秒'}</Text></View>
                  </TouchableOpacity>

                </View>
              </View>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>

            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => this.register()} style={{ flex: 1, flexDirection: 'row', }}>
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