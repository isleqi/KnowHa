import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import AllColumn from '../column/AllColumn';
import FollowUserArticle from '../column/FollowUserArticle';
import Base from '../../utils/Base';
import ScreenUtil from '../../utils/ScreenUtil';


let baseUrl = Base.baseUrl;
export default class ColumnScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {

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

  getUserInfo = () => {
    let url = baseUrl+'/app/user/getBaseUserInfo';
    
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
      let data = responseData.data;
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        DeviceEventEmitter.emit('navigateToAuth');
        return;
    }
      
    })
  }

  navigateToCreateArticle=()=>{
    
    DeviceEventEmitter.emit('navigateToCreateArticle');

  }

  navigateToSearchArticle=()=>{
    
    DeviceEventEmitter.emit('navigateToSearchArticle');

  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 15 }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#eaeaea', borderRadius: 5, flex: 1
            ,padding:10,alignItems:'center'
          }}>
            <TouchableOpacity onPress={() => { this.navigateToCreateArticle() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require("../../resources/index/tw.png")} style={{ height: 25, width: 25, marginRight: 5 }} />
                <Text style={{ fontSize: 13, color: '#b1afaf', paddingRight: 5 }}> 写文章  |</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.navigateToSearchArticle()}} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: '#b1afaf', paddingRight: 5,flex:1 }}> 搜索文章  </Text>
                <Image source={require("../../resources/index/ss.png")} style={{ height: 25, width: 25 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollableTabView
          // initialPage={0}
          renderTabBar={() => <ScrollableTabBar />}
          tabBarBackgroundColor='#FFFFFF'
          tabBarActiveTextColor='#0084ff'
          tabBarUnderlineStyle={{ backgroundColor: '#0084ff' }}
        >



          <AllColumn tabLabel='全部文章' ></AllColumn>
          <FollowUserArticle tabLabel='关注的人'></FollowUserArticle>
        </ScrollableTabView>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

});