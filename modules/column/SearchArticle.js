import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


export default class SearchArticle extends Component {
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
      
          <View style={{ flexDirection: 'row',flex:1,alignItems:'center'}}>
            <TextInput placeholder='搜索文章' style={{flex:1,fontSize:12}}  />
            <Image source={require("../../resources/index/ss.png")} style={{ height: 25, width: 25 }} />
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
  },

});