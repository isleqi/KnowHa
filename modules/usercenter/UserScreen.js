import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


export default class UserScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      sex: 1,    //1 男  0 女
      activity: 1,
      avatarSource: ''
    };

  }


  render() {
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
                      this.state.avatarSource
                  }
                    style={{ width: 80, height: 80, borderRadius: 40 }}>
                  </Image>

                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                <Text>风雪归人</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>关注 1  |   </Text>
                <Text style={{ fontSize: 10 }}>粉丝 1</Text>
              </View>

              <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                <Text  style={{ fontSize: 10 }}>简介：暂无个人简介</Text>
              </View>
              <View style={{ height: 4, backgroundColor: "#f1efef" }}></View>

            </View>
          </View>

          <View style={{ flexDirection: 'row',alignItems:'center',paddingLeft:15}}>
          <Image source={require("../../resources/user/wt.png")} style={{height:30,width:30}}/>
            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15,paddingLeft:10}}>我的提问</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
            </View>
          </View>

          <View style={{ flexDirection: 'row',alignItems:'center',paddingLeft:15 }}>
          <Image source={require("../../resources/user/hd.png")} style={{height:30,width:30}}/>
            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15 ,paddingLeft:10}}>我的回答</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
            </View>
          </View>

          <View style={{ flexDirection: 'row' ,alignItems:'center',paddingLeft:15}}>
          <Image source={require("../../resources/user/sc.png")} style={{height:30,width:30}}/>

            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15,paddingLeft:10 }}>我的收藏</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
            </View>
          </View>

           <View style={{ flexDirection: 'row' ,alignItems:'center',paddingLeft:15}}>
           <Image source={require("../../resources/user/wz.png")} style={{height:25,width:25}}/>

            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15,paddingLeft:15 }}>我的专栏</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
            </View>
          </View>

            <View style={{ flexDirection: 'row' ,alignItems:'center',paddingLeft:15}}>
            <Image source={require("../../resources/user/gz.png")} style={{height:30,width:30}}/>

            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15,paddingLeft:10 }}>关注的问题</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
            </View>
          </View>

            <View style={{ flexDirection: 'row' ,alignItems:'center',paddingLeft:15}}>
            <Image source={require("../../resources/user/qb.png")} style={{height:30,width:30}}/>

            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15,paddingLeft:10 }}>我的钱包</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
            </View>
          </View>

             <View style={{ flexDirection: 'row' ,alignItems:'center',paddingLeft:15}}>
             <Image source={require("../../resources/user/sz.png")} style={{height:30,width:30}}/>

            <View style={{ flex: 1 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15,paddingLeft:10 }}>设置</Text>
              <View style={{ height: 1, backgroundColor: "#e0dfdf" }}></View>
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