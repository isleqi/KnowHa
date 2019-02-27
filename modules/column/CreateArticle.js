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
import Base from '../../utils/Base';

let that;
let imagPath;
let baseUrl = Base.baseUrl;
export default class CreateArticle extends Component {
  //  static navigationOptions;
  static navigationOptions = () => ({
    title: '写文章',

    headerTitleStyle: { fontSize: 15, },

    headerRight: (

      <View style={{ flexDirection: 'row', paddingRight: 20 }}>
        <TouchableOpacity onPress={() => that.finish()}>
          <Text style={{ fontSize: 13 }}>完成</Text>
        </TouchableOpacity>
      </View>

    )



  });

  constructor(props) {
    super(props);
    this.state = {
      isPay: false,
      value: 0,
      articleTitle:''
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
    let url = 'http://192.168.1.100:8070/app/user/uploadImage';
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
    let html = contentHtml + "<br/><img src=" + path + ' / width="320" height="300"><br/><br/>';
    this.richtext.setContentHTML(html);
  }



  addImage = () => {
    // alert("!!!")
    this.choosePicker();
  }


  finish = async() => {

    let url = baseUrl + '/app/column/add';
    let articleContent = await this.richtext.getContentHtml();
    let articleTitle=this.state.articleTitle;
    let type = 0;
    if (this.state.isPay)
      type = 1;

    let params = {
      "articleContent": articleContent,
      "articleTitle": articleTitle,
      "type":type,
      "value":this.state.value

    }

    

    let token = await AsyncStorage.getItem("userToken");

    fetch(url, {
      method: 'POST',
      headers: {
        'token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        return;
      }

      let data = responseData.data;

     console.log(data);

      this.navigateToArticleDetail(data);


    })
  }

  
  navigateToArticleDetail = (item) => {
    this
        .props
        .navigation
        .navigate('ArticleDetail',{item:item});
}



  render() {


    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
              <TouchableOpacity onPress={() => this.setState({ isPay: !this.state.isPay })} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, }}>
                <Image source={this.state.isPay ? require('../../resources/register/activity.png') : require('../../resources/register/noActivity.png')} style={{ width: 20, height: 20, opacity: 0.8 }} />
                <Text>付费</Text>
              </TouchableOpacity>
              {
                this.state.isPay ?
                  <TextInput placeholder="请输入积分数值"
                    onChangeText={(value) => this.setState({ value })}

                    style={{ paddingLeft: 20, fontSize: 15 }}
                  >
                  </TextInput>
                  :
                  null
              }

            </View>


            <TextInput placeholder="请输入题目"
              onChangeText={(articleTitle) => this.setState({ articleTitle })}

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
              contentPlaceholder="请输入内容"
              editorInitializedCallback={() => this.onEditorInitialized()}
            />
            <RichTextToolbar
              getEditor={() => this.richtext}
              onPressAddImage={() => this.addImage()}
            //   actions={actions}

            />
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