import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar, Platform,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePicker from 'react-native-image-picker';

let that;
let imagPath;
let next = false;
export default class AskQuestion extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '提问',

    headerTitleStyle: { fontSize: 15, },

    headerRight: (

      <View style={{ flexDirection: 'row', paddingRight: 20 }}>
        <TouchableOpacity onPress={() => that.next()}>
          <Text style={{ fontSize: 13 }}>下一步</Text>
        </TouchableOpacity>
      </View>

    )



  });

  constructor(props) {
    super(props);
    this.state = {
      next: false,
    };

    that = this;
  }

  componentDidMount() {


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
        this.uploadImage(response.uri);
      }
    });
  }

  uploadImage = (path) => {
    let url = 'http://192.168.1.6:8070/app/user/uploadImage';
    let file = { uri: path, type: 'application/octet-stream', name: 'image.jpg' };
    let formData = new FormData();
    formData.append("files", file);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;charset=utf-8',

      },

      body: formData

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      let data = responseData.data
      this.insertImage(data[0]);
    })

  }

  onEditorInitialized() {
  }

  insertImage = async (path) => {
    let contentHtml = await this.richtext.getContentHtml();
    let html = contentHtml + "<img src=" + path + ' />';
    this.richtext.setContentHTML(html);
  }



  addImage = () => {
    // alert("!!!")
    this.choosePicker();
  }

  next = () => {
    this.setState({
      next: true,
    });

  }







  render() {

    const actions = [

    ];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {!this.state.next ? <View style={{ flex: 1 }}>

            <TextInput placeholder="请输入问题"
              onChangeText={(title) => this.setState({ title })}

              style={{ paddingBottom: 10, paddingLeft: 20, fontSize: 17 }}
            >
            </TextInput>
            <View style={{ height: 1, backgroundColor: '#c1c1c1', marginBottom: 10 }}></View>



            <RichTextEditor
              ref={(r) => this.richtext = r}
              // ref={"editor"}
              style={styles.richText}
              // titlePlaceholder="请输入问题标题"
              hiddenTitle={true}
              contentPlaceholder="请输入问题描述"
              editorInitializedCallback={() => this.onEditorInitialized()}
            />
            <RichTextToolbar
              getEditor={() => this.richtext}
              onPressAddImage={() => this.addImage()}
            //   actions={actions}

            />
          </View> :
            <View style={{ flex: 1,paddingLeft:15,paddingRight:15}}>
            
              <View style={{  flexDirection: 'row',alignItems:'center' }}>

                <TextInput style={{ flex: 1 ,}} placeholder="搜索或添加新标签"
                 onChangeText={() => this.setState({  })} ></TextInput>

                <TouchableOpacity onPress={()=>{}}  >

                  <View style={{ backgroundColor: "#0084ff", borderRadius: 5, padding: 10 }}>

                  <Text style={{ textAlign: 'center', fontSize: 12, color: 'white' }}>
                  添加
                  </Text>
                  </View>
                </TouchableOpacity>

              </View>
              <View style={{ height: 1, backgroundColor: '#c1c1c1', marginBottom: 10 }}></View>

              

            </View>
          }
        </View>





      </View>
      // </View>
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
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5

  },
  richText: {
    fontSize: 10,
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 10
    // backgroundColor:'red'

  },

});