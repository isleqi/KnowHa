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


export default class ColumnScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {

    };

  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row',paddingLeft:15,paddingRight:15, paddingTop:15}}>
        <View  style={{
        flexDirection: 'row',
        backgroundColor:'#eaeaea',borderRadius:5,flex:1
        ,paddingLeft:10,paddingRight:10
        }}>
          <View style={{ flexDirection: 'row',alignItems:'center'}}>
            <Image source={require("../../resources/index/tw.png")} style={{ height: 25, width: 25,marginRight:5}} />
            <Text style={{ fontSize: 13, color: '#b1afaf',paddingRight:5 }}> 写文章  |</Text>
          </View>
          <View style={{ flexDirection: 'row',flex:1,alignItems:'center'}}>
            <TextInput placeholder='搜索文章' style={{flex:1,fontSize:12}}  />
            <Image source={require("../../resources/index/ss.png")} style={{ height: 25, width: 25 }} />
          </View>
          </View>
        </View>
        <ScrollableTabView
          // initialPage={0}
          renderTabBar={() => <ScrollableTabBar />}
          tabBarBackgroundColor='#FFFFFF'
          tabBarActiveTextColor='#0084ff'
          tabBarUnderlineStyle={{backgroundColor:'#0084ff'}}
          >



          <AllColumn tabLabel='全部文章' ></AllColumn>
          <Text tabLabel='关注的人'>favorite</Text>
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