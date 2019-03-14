import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';
import ImagePicker from 'react-native-image-picker';


let baseUrl = Base.baseUrl;
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
      //是否显示指示器
      animating: false,
      //是否刷新
      isRefreshing: false
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
  navigateToMyWallet = () => {
    DeviceEventEmitter.emit('navigateToMyWallet');
  }

  getUserInfo = () => {
    let url = baseUrl + '/app/user/getBaseUserInfo';
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

  //上拉刷新
  onRefresh = () => {
    //重置参数
    this.setState({
      isRefreshing: true,
      animating: false
    }, () => {
      this.getUserInfo();
      this.setState({ isRefreshing: false });
    });
  }


  choosePicker = () => {

    const photoOptions = {
      title: '',
      quality: 0.8,
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择相册',
      allowsEditing: true,
      noData: false,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };


    ImagePicker.showImagePicker(photoOptions, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        this.setState({
          avatarSource: source

      });
        this.uploadImage(response.uri);
      }
    });
  }

  uploadImage = (path) => {
    let url = baseUrl + '/app/user/uploadAvatar';
    let file = { uri: path, type: 'application/octet-stream', name: 'image.jpg' };
    let formData = new FormData();
    formData.append("file", file);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;charset=utf-8',

      },

      body: formData

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        return;
      }
      let data = responseData.data;
     this.updateUserInfo(data,"")
    })

  }

  updateUserInfo =async (avatarPath, des) => {
    let formData = new FormData();
    let url = baseUrl + '/app/user/updateUserInfo';
    let token = await AsyncStorage.getItem("userToken");
    if (avatarPath != "") {
      formData.append("avatarPath", avatarPath);
    }

    if (des != "") {
      formData.append("des", des);
    }

    fetch(url, {
      method: 'POST',
      headers: {
          "token": token,
      },
      body: formData

  }).then((response) => {
      return response.json();
  }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200") {
          ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
          return;
      }
      ToastAndroid.show("更新成功", ToastAndroid.SHORT);

  }
  )
  }

  render() {
    console.log(this.state.avatarSource);
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            colors={['rgb(217, 51, 58)']}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.content}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>

                <View style={{ alignItems: 'center', paddingBottom: 10, paddingTop: 20 }}>
                  <TouchableOpacity onPress={() => this.choosePicker()} >

                    <Image source={
                      this.state.avatarSource != '' ?
                      { uri: this.state.avatarSource }
                      :
                        (this.state.sex == 1 ? require('../../resources/register/boy.png') :
                          require('../../resources/register/girl.png')) 
                       
                    }
                      style={{ width: 80, height: 80, borderRadius: 40 }}>
                    </Image>

                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                  <Text>{this.state.userName}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                  <TouchableOpacity onPress={() => this.navigateToFollowUser()}>
                    <Text style={{ fontSize: 10 }}>关注 {this.state.followsNum}  |   </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.navigateToFanUser()}>
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

            <TouchableOpacity onPress={() => this.navigateToMyWallet()} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image source={require("../../resources/user/qb.png")} style={{ height: 30, width: 30 }} />

                <View style={{ flex: 1 }}>
                  <Text style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }}>我的钱包</Text>
                  <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
                </View>
              </View>
            </TouchableOpacity>


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