import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import AllQuestion from './AllQuestion';
import FollowQuestion from './FollowQuestion';


export default class IndexScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  navigateToAskQuestion = () => {
    DeviceEventEmitter.emit('navigateAskQuestion');
  }

  navigateToSearchQuestion=()=>{
    DeviceEventEmitter.emit('navigateToSearchQuestion');
   
  }

  navigateToAnswerList=()=>{
    DeviceEventEmitter.emit('navigateToAnswerList');
   
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 15 }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#eaeaea', borderRadius: 5, flex: 1,padding:10          }}>
           <TouchableOpacity onPress={()=>{this.navigateToAskQuestion()}} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           
              <Image source={require("../../resources/index/tw.png")} style={{ height: 25, width: 25, marginRight: 5 }} />
              <Text style={{ fontSize: 13, color: '#b1afaf', paddingRight: 5 }}> 提问  |</Text>
            
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.navigateToSearchQuestion()}} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#b1afaf', paddingRight: 5,flex:1 }}> 搜索问题  </Text>
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



          <AllQuestion tabLabel='全部问题' ></AllQuestion>
          <FollowQuestion tabLabel='关注的问题'></FollowQuestion>
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