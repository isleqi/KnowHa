import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import {baseUrl} from '../../utils/Base';


let userToken;
export default class UserScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      sex: 1,    //1 男  0 女
      activity: 1,
      userName: '',
      avatarSource: '',
      description: '',
      fansNum: 0,
      followsNum: 0,

    };

  }
  componentWillMount() {
    this._bootstrapAsync();
    //  this.getUserInfo();
  }

  _bootstrapAsync = async () => {
    userToken = await AsyncStorage.getItem('userToken');
    //  ToastAndroid.show(userToken,ToastAndroid.SHORT);
    if (userToken == null) {
      ToastAndroid.show("请先登录", ToastAndroid.SHORT);
      DeviceEventEmitter.emit('navigateToAuth');
    }
    this.getUserInfo();
  }

  navigateToFollowAnswer = () => {
    DeviceEventEmitter.emit('navigateToFollowAnswer');
  }
  navigateToMyQuestion = () => {
    DeviceEventEmitter.emit('navigateToMyQuestion');
  }
  navigateToMyAnswer = () => {
    DeviceEventEmitter.emit('navigateToMyAnswer');
  }
  navigateToMyColumn = () => {
    DeviceEventEmitter.emit('navigateToMyColumn');
  }
  navigateToFollowQues = () => {
    DeviceEventEmitter.emit('navigateToFollowQues');
  }
  navigateToFollowUser = () => {
    DeviceEventEmitter.emit('navigateToFollowUser');
  }
  navigateToFanUser = () => {
    DeviceEventEmitter.emit('navigateToFanUser');
  }

  getUserInfo = () => {
    let url = 'http://192.168.1.100:8070/app/user/getBaseUserInfo';
    let formData = new FormData();
    formData.append("token", userToken);
    let params = {
      "token": userToken
    }
    console.log(userToken)
    fetch(url, {
      method: 'POST',
      body: formData

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      let data = responseData.data;
      if (data.code != 'undefined' && data.code == 403) {
        ToastAndroid.show("token失效，请重新登录", ToastAndroid.SHORT);
        DeviceEventEmitter.emit('navigateToAuth');
      } else {
        let user = data.user;
        this.setState({
          userName: user.userName,
          avatarSource: user.userIconUrl == null ? '' : user.userIconUrl,
          fansNum: data.fansNum,
          followsNum: data.followsNum,
          description: user.userDes == null ? '' : user.userDes,
        })
      }

    })
  }

  quit = async () => {
    await AsyncStorage.clear();
    DeviceEventEmitter.emit('navigateToAuth');
  }

  render() {
    console.log(this.state.avatarSource);
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>

                <View style={{ alignItems: 'center', paddingBottom: 10, paddingTop: 20 }}>
                  <TouchableOpacity onPress={() => this.choosePicker()} >

                    <Image source={
                      this.state.avatarSource == '' ?
                        (this.state.sex == 1 ? require('../../resources/register/boy.png') :
                          require('../../resources/register/girl.png')) :
                        { uri: this.state.avatarSource }
                    }
                      style={{ width: 80, height: 80, borderRadius: 40 }}>
                    </Image>

                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                  <Text>{this.state.userName}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                 <TouchableOpacity onPress={()=>this.navigateToFollowUser()}>
                  <Text style={{ fontSize: 10 }}>关注 {this.state.followsNum}  |   </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.navigateToFanUser()}>
                  <Text style={{ fontSize: 10 }}>粉丝 {this.state.fansNum}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                  <Text style={{ fontSize: 10 }}>简介：{this.state.description == '' ? '暂无个人简介' : this.state.description}</Text>
                </View>
                <View style={{ height: 4, backgroundColor: "#f1efef" }}></View>

              </View>
            </View>


            <TouchableOpacity onPress={() => this.navigateToMyQuestion()} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image source={require("../../resources/user/wt.png")} style={{ height: 30, width: 30 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>我的提问</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navigateToMyAnswer()} style={{ flexDirection: 'row', alignItems: 'center' }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image source={require("../../resources/user/hd.png")} style={{ height: 30, width: 30 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>我的回答</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navigateToFollowAnswer()} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image source={require("../../resources/user/sc.png")} style={{ height: 30, width: 30 }} />

                <View style={{ flex: 1 }}>
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>我的收藏</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.navigateToMyColumn()} style={{ flexDirection: 'row', alignItems: 'center' }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image source={require("../../resources/user/wz.png")} style={{ height: 25, width: 25 }} />

                <View style={{ flex: 1 }}>
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15 }}>我的专栏</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navigateToFollowQues()} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image source={require("../../resources/user/gz.png")} style={{ height: 30, width: 30 }} />

                <View style={{ flex: 1 }}>
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>关注的问题</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </View>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
              <Image source={require("../../resources/user/qb.png")} style={{ height: 30, width: 30 }} />

              <View style={{ flex: 1 }}>
                <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>我的钱包</Text>
                <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
              <Image source={require("../../resources/user/sz.png")} style={{ height: 30, width: 30 }} />

              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => this.quit()} >
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>退出</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </TouchableOpacity>
              </View>
            </View>





          </View>
        </View>
      </ScrollView>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',


  },
  content: {
    flex: 1,
    alignItems: "center",
  }
});