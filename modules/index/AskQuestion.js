import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar, Platform,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import Aa from "./Aa"

var {height, width} = Dimensions.get('window'); 
export default class AskQuestion extends Component {
  static navigationOptions = {
    title: '提问',

    headerTitleStyle: { fontSize: 15, },

    headerRight:
      <View style={{ flexDirection: 'row', paddingRight: 20 }}>
        <Text style={{ fontSize: 13 }}>下一步</Text>
      </View>
  };
  constructor(props) {
    super(props);
    this.state = {

    };

  }




  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={{ flexDirection: 'row' }} >
            <View style={{ flex: 1 }}>
              <TextInput placeholder="请输入标题" />
              <View style={{ height: 2, backgroundColor: 'gray' }} />
            </View>
          </View>
          <View  style={{flex:1,width:width}}>
          <RichTextEditor
            ref={(r) => this.richtext = r}
           
            initialTitleHTML={'Title!!'}
            initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
            editorInitializedCallback={() => this.onEditorInitialized()}
          />
          </View>
            <RichTextToolbar 
            getEditor={() => this.richtext}
          />

        </View>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    flex: 1,
    //  backgroundColor:'red',
    // alignItems: "center",
  },
  richText: {
    // alignItems:'center',
    // justifyContent: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    // backgroundColor:'red'

  },

});