import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid, Modal, TextInput,
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
      avatarPath: '',
      description: '',
      fansNum: 0,
      followsNum: 0,
      //是否显示指示器
      animating: false,
      //是否刷新
      isRefreshing: false,
      show: false,
      updateName: "",
      updateDes: ""
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
  
    console.log(userToken)
    fetch(url, {
      method: 'POST',
      headers: {
        "token": userToken
    },
    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        DeviceEventEmitter.emit('navigateToAuth');
        return;
      }
      let data = responseData.data;

      let user = data.user;
      this.setState({
        userName: user.userName,
        avatarPath: user.userIconUrl,
        fansNum: data.fansNum,
        followsNum: data.followsNum,
        description: user.userDes == null ? '' : user.userDes,
        updateDes: user.userDes == null ? '' : user.userDes,
        updateName: user.userName

      })


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
      this.setState({
        avatarPath: data
      })
      this.updateUserInfo(data, null, null)
    })

  }


  toUpdateInfo = () => {
    this.setState({
      show: false
    });
    let des = this.state.updateDes;
    let name = this.state.updateName;
    this.updateUserInfo(null, des, name);
  }

  updateUserInfo = async (avatarPath, des, name) => {
    let formData = new FormData();
    let url = baseUrl + '/app/user/updateUserInfo';
    let token = await AsyncStorage.getItem("userToken");
    if (avatarPath != null) {
      formData.append("avatarPath", avatarPath);
    }
    if (des != null) {
      formData.append("des", des);
    }
    if (name != null) {
      formData.append("name", name);
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
      this.onRefresh();
    }
    )
  }

  renderUpdateScreen = () => {
    return (

      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',  justifyContent: "center",alignItems:"center", }}>
        <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10,width:300}}>
         <View style={{ backgroundColor: '#ffffff',alignItems:'center'} }>
           <Text style={{fontWeight:'bold'}}>修改个人信息</Text>
           </View>
          <TextInput placeholder="请输入昵称" onChangeText={(updateName) => this.setState({ updateName })} value={this.state.updateName}></TextInput>
          <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
          <TextInput placeholder="请输入简介" onChangeText={(updateDes) => this.setState({ updateDes })} value={this.state.updateDes}></TextInput>
          <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>

          <TouchableOpacity onPress={() => this.toUpdateInfo()}  >
            <View style={{ backgroundColor: "#0084ff", borderRadius: 5, marginTop: 10,padding:10,}}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: 'white' }}>
                修改 </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({
              show: false
            })
          }} 
          >
            <View style={{ backgroundColor: "gray", borderRadius: 5, marginTop: 10,padding:10,}}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: 'white' }}>
                取消 </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            colors={['rgb(217, 51, 58)']}
          />
        }
        style={{backgroundColor:'#ffffff'}}
      >
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.show}
            onRequestClose={() => { }}
          >
            {
              this.renderUpdateScreen()
            }

          </Modal>
          <View style={styles.content}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>

                <View style={{ alignItems: 'center', paddingBottom: 10, paddingTop: 20 }}>
                  <TouchableOpacity onPress={() => this.choosePicker()} >

                    <Image source={{ uri: this.state.avatarPath }}
                      style={{ width: 80, height: 80, borderRadius: 40 }}>
                    </Image>

                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                  <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}>
                    <Text>{this.state.userName}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                  <TouchableOpacity onPress={() => this.navigateToFollowUser()}>
                    <Text style={{ fontSize: 12 }}>关注 {this.state.followsNum}  |   </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.navigateToFanUser()}>
                    <Text style={{ fontSize: 12 }}>粉丝 {this.state.fansNum}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                  <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}>
                    <Text style={{ fontSize: 12 }}>简介：{this.state.description == '' ? '暂无个人简介' : this.state.description}</Text>
                  </TouchableOpacity>
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
    backgroundColor: '#ffffff',


  },
  content: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#ffffff',
  }
});