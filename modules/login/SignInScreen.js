import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  View,
  Text,
  DeviceEventEmitter,
  Image,
  ScrollView,
  Dimensions,
  ToastAndroid
} from 'react-native';


export default class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      accountL:'',
      password:''
    };

  }

  navigateToRegister = () => {
    this
      .props
      .navigation
      .navigate('Register');
  }


  navigateToOauth = (type) => {
    let uri_;
    if (type == 'sina') {
     uri_ = "https://api.weibo.com/oauth2/authorize?client_id=" +
        "524337518" +
        "&response_type=code" +
        "&redirect_uri=" +
        "http://192.168.1.6:8070/app/login/sinaOauth";
    }
    else if (type == 'github') {
       uri_ = "https://github.com/login/oauth/authorize?client_id=" + "742507a3c11705661108";
    }
    else {
      ToastAndroid.show('尚未支持该登陆', ToastAndroid.SHORT);
      return ;
    }
    this
      .props
      .navigation
      .navigate('Oauth', { uri: uri_ });
  }

  submit=()=>{
    let url = 'http://192.168.1.6:8070/app/login/submit';
    let formData = new FormData();
    formData.append("account", this.state.account);
    formData.append("password",this.state.password);
    
    fetch(url, {
      method: 'POST',
      body: formData

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if(responseData.code!="200"){
        ToastAndroid.show(responseData.message,ToastAndroid.SHORT);
        return;
      }

      let data=responseData.data;

      AsyncStorage.setItem("userToken",data);
      
      this
      .props
      .navigation
      .navigate('App');



    })
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
              <TextInput placeholder="请输入手机号或者邮箱"  onChangeText={(account) => this.setState({account})}></TextInput>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
              <TextInput placeholder="请输入密码" onChangeText={(password) => this.setState({password})}></TextInput>
              <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
          <TouchableOpacity onPress={() => this.submit()} style={{ flex: 1,flexDirection: 'row',  }}>
            <View style={{
              flex: 1, backgroundColor: '#0084ff', borderRadius: 10, alignItems: 'center',
              justifyContent: 'center', paddingTop: 10, paddingBottom: 10
            }}>
              <Text style={{ fontSize: 15, color: 'white' }}>登录</Text>
            </View>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: 40 }}>
            <Text style={{ fontSize: 13, color: '#c1c1c1' }}>没有账号？</Text>
            <TouchableOpacity onPress={() => this.navigateToRegister()}>
              <Text style={{ fontSize: 13, color: '#0084ff' }}> 注册</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => this.navigateToOauth('wechat')}>
                <Image source={require("../../resources/login/weixin.png")} style={{ height: 40, width: 40 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.navigateToOauth('qq')}>
                <Image source={require("../../resources/login/qq.png")} style={{ height: 40, width: 40 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.navigateToOauth('sina')}>
                <Image source={require("../../resources/login/weibo.png")} style={{ height: 40, width: 40 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.navigateToOauth('github')}>
                <Image source={require("../../resources/login/github.png")} style={{ height: 40, width: 40 }} />
              </TouchableOpacity>
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