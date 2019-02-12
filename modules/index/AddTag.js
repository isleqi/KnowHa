import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let that;
export default class AddTag extends Component {

   static navigationOptions = ({ navigation }) => ({
    title: '提问',

    headerTitleStyle: { fontSize: 15, },

    headerRight: (

      <View style={{ flexDirection: 'row', paddingRight: 20 }}>
        <TouchableOpacity onPress={() => that.toBack()}>
          <Text style={{ fontSize: 13 }}>上一步</Text>
        </TouchableOpacity>
      </View>

    )
  });

  constructor(props) {
    super(props);
    that = this;
  }

  toBack=()=>{
    this
    .props
    .navigation
    .navigate('AskQuestion');
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        <TextInput style={{ flex: 1, }} placeholder="搜索或添加新标签"
          onChangeText={() => this.setState({})} ></TextInput>

        <TouchableOpacity onPress={() => { }}  >

          <View style={{ backgroundColor: "#0084ff", borderRadius: 5, padding: 10 }}>

            <Text style={{ textAlign: 'center', fontSize: 12, color: 'white' }}>
              添加
          </Text>
          </View>
        </TouchableOpacity>

      </View>
      <View style={{ height: 1, backgroundColor: '#c1c1c1', marginBottom: 10 }}></View>



    </View>

    </View>
    );
  }

 
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  content: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5

  },
});