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
import KeyboardSpacer from 'react-native-keyboard-spacer';
import  ImagePicker from 'react-native-image-picker'; 

let that;
var {height, width} = Dimensions.get('window'); 
export default class AskQuestion extends Component {
  static navigationOptions = {
    title: '提问',

    headerTitleStyle: { fontSize: 15, },

    headerRight:(
      <View style={{ flexDirection: 'row', paddingRight: 20 }}>
      <TouchableOpacity onPress={()=>that.getHTML()}>
      <Text style={{ fontSize: 13 }}>下一步</Text>
      </TouchableOpacity>
    </View>
   
    )
          
   
    
    
  };
  constructor(props) {
    super(props);
    this.state = {

    };
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
    that=this;
  }

  componentDidMount(){
    
  
  }

  choosePicker=()=>{
        
    const photoOptions = {
        title:'',
        quality: 0.8,
        cancelButtonTitle:'取消',
        takePhotoButtonTitle:'拍照',
        chooseFromLibraryButtonTitle:'选择相册',
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
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            // this.setState({
            //     avatarSource: source
            // });
           // alert( response.uri)
        //   this.richtext.insertImage(  { uri: 'tw.png' });
   //     var url1 = window.URL.createObjectURL("file:///D:/workplace/knowha/resources/login/github.png");
        this.richtext.setContentHTML('<img src='+response.uri+' width="128" height="128"/>')
      //this.richtext.setTitleHTML('<p>sdfsdsf</p>')
        }
    });
}


 

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    alert(titleHtml + ' ' + contentHtml)
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }

  addImage=()=>{
   // alert("!!!")
    this.choosePicker();
  }




  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {/* <View style={{ flexDirection: 'row' }} >
            <View style={{ flex: 1 }}>
              <TextInput placeholder="请输入标题" />
              <View style={{ height: 2, backgroundColor: 'gray' }} />
            </View>
          </View> */}
          {/* <View  style={{flex:1,width:width}}> */}
          <RichTextEditor
             ref={(r) => this.richtext = r}
            // ref={"editor"}
            style={styles.richText}
            titlePlaceholder="请输入问题标题"
            contentPlaceholder="请输入问题描述"
            editorInitializedCallback={() => this.onEditorInitialized()}
          />
          </View>
            <RichTextToolbar 
            getEditor={() => this.richtext}
            onPressAddImage={()=>this.addImage()}

          />

             {Platform.OS === 'ios' && <KeyboardSpacer/>}

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
    paddingTop:20,
    paddingRight:5,
    paddingLeft:5
    
  },
  richText: {
   fontSize:10,
    backgroundColor: 'transparent',
    flex: 1,
    // backgroundColor:'red'

  },

});