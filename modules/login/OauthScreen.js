import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,WebView,ToastAndroid,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';

let width=Dimensions.get('window').width;
let height= Dimensions.get('window').heigth;
export default class OauthSreen extends Component {

    constructor(props) {
        super(props);
        this.state={

       }
      }

      onMessage = (event) => {

        //webview中的html页面传过来的的数据在event.nativeEvent.data上
      let msg=event.nativeEvent.data;
      let data=JSON.parse(msg);
      if(data.code=='200'){

      let userToken=data.token;

      AsyncStorage.setItem("userToken",userToken);
      
        this
        .props
        .navigation
        .navigate('App');
      }
      else{
        this
        .props
        .navigation
        .navigate('Auth');
      }
    
    }



    render() {
        let uri=this.props.navigation.state.params.uri;
        return (
            <View style={styles.container}>
         
            <WebView 
           onMessage={this.onMessage}
            bounces={false}
              scalesPageToFit={true}
              source={{uri:uri,method: 'GET'}}
              style={{flex:1}}
              renderLoading={() => {
                return <View  style={{width:100,height:100}}><Text>这是自定义Loading...</Text></View>
            }}
           >
            </WebView>
           
          </View>
        );
      }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});