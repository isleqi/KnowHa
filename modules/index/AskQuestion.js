import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar, Platform,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ToastAndroid,
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
  //  static navigationOptions;
  static navigationOptions = () => ({
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
      showTagList: false,
      addTag: false,
      tagList: [],
      tagName: '',
      searchTagList: [],
      hotTagList: [],
      quesTitle: '',
      quesDes: ''
    };

    that = this;
  }

  componentDidMount() {

    this.renderHotTag();
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
    let html = contentHtml + "<br/><img src=" + path + ' /><br/><br/>';
    this.richtext.setContentHTML(html);
  }



  addImage = () => {
    // alert("!!!")
    this.choosePicker();
  }

  addTag = () => {
    if (this.state.tagName == '') {
      ToastAndroid.show('请输入标签', ToastAndroid.SHORT);
      return;
    }
    if (this.state.addTag) {
      ToastAndroid.show('请稍候', ToastAndroid.SHORT);
      return;
    }
    this.state.addTag = true;
    let tagName = this.state.tagName;
    let url = 'http://192.168.1.100:8070/app/question/tag/add?tagName=' + tagName;

    fetch(url, {
      method: 'GET',

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        return;
      }

      let data = responseData.data;
      let tagList = this.state.tagList;
      console.log(data+'dsfds')
      tagList.push(data);
      this.state.addTag = false;
      this.setState({
        tagList: tagList,
        showTagList: false,
        tagName: ''
      });

    })

  }

  next = async () => {
    if (!this.state.next) {
      let content = await this.richtext.getContentHtml();
      this.setState({
        next: true,
        quesDes: content
      });

    }
    else {
      this.finish();
    }


  }

  navigateToAnswerList = (item) => {
    DeviceEventEmitter.emit('navigateToAnswerList', item);

}

  finish = async () => {

  
    let url = 'http://192.168.1.100:8070/app/question/add';
    let tagIds = [];
    let tagList = this.state.tagList;

    tagList.forEach(tag => {
      tagIds.push(tag.id);
    });


    let params = {
      "quesTitle": this.state.quesTitle,
      "quesDes": this.state.quesDes,
      "tagIds": tagIds,
    }

    console.log(params);

    let token = await AsyncStorage.getItem("userToken");
    console.log(token);

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

      this.navigateToAnswerList(data);


    })
  }


  delTag = (index) => {
       let tagList=this.state.tagList;
       tagList.splice(index,1);
       this.setState({
         tagList:tagList
       })
  }



  renderTag = () => {
    let tags = this.state.tagList;
    let view = [];

    for(let i=0;i<tags.length;i++){
      let tag=tags[i];
      view.push(
        <View style={{ backgroundColor: "gray", borderRadius: 5, paddingBottom: 10, paddingLeft: 10, margin: 5 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={()=>this.delTag(i)}>
              <Image source={require('../../resources/index/x.png')} style={{ width: 10, height: 10, margin: 3 }} />
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: 'center', fontSize: 12, color: 'white', paddingRight: 10 }}>
            {tag.tagName}
          </Text>
        </View>
      )
    }


// let index=0;
//     tags.forEach(tag => {
//       console.log(tag);
//       view.push(
//         <View style={{ backgroundColor: "gray", borderRadius: 5, paddingBottom: 10, paddingLeft: 10, margin: 5 }}>
//           <View style={{ alignItems: 'flex-end' }}>
//             <TouchableOpacity onPress={()=>this.delTag(index)}>
//               <Image source={require('../../resources/index/x.png')} style={{ width: 10, height: 10, margin: 3 }} />
//             </TouchableOpacity>
//           </View>
//           <Text style={{ textAlign: 'center', fontSize: 12, color: 'white', paddingRight: 10 }}>
//             {tag.tagName}
//           </Text>
//         </View>
//       )

//       index++;

//     });

    return view;
  }

  renderHotTag = () => {

    let url = 'http://192.168.1.100:8070/app/question/tag/getHot';

    fetch(url, {
      method: 'GET',

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        return;
      }

      let data = responseData.data;
      let tags = data;
      let view = [];
      tags.forEach(tag => {

        view.push(
          <TouchableOpacity onPress={() => this.setTag(tag)}>
            <View style={{ backgroundColor: "#ef8282", borderRadius: 5, padding: 10, margin: 5 }}>
              <Text style={{ textAlign: 'center', fontSize: 12, color: 'white' }}>
                {tag.tagName}
              </Text>
            </View>
          </TouchableOpacity>
        )

      });

      this.setState({
        hotTagList: view
      })

    })


  }

  setTag = (tag) => {
    let data = this.state.tagList;
    data.push(tag);
    this.setState({
      tagList: data,
      tagName: '',
      showTagList: false
    })
  }

  renderSearchTagList = () => {
    let tagList = this.state.searchTagList;
    let view = [];
    tagList.forEach(tag => {

      view.push(
        <TouchableOpacity onPress={() => this.setTag(tag)}>
          <View style={{ width: 300, backgroundColor: '#e6e5e5' }}>
            <Text style={{ fontSize: 12, padding: 10 }}>
              {tag.tagName}
            </Text>
            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
          </View>
        </TouchableOpacity>
      )

    });

    return view;
  }

  getSearchTagList = () => {
    if (this.state.tagName == '') {
      this.setState({
        showTagList: false
      });
      return;

    }
    let url = 'http://192.168.1.100:8070/app/question/tag/get?str=' + this.state.tagName;

    fetch(url, {
      method: 'GET',

    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      console.log(responseData);
      if (responseData.code != "200") {
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        return;
      }

      let data = responseData.data;

      this.setState({
        searchTagList: data,
        showTagList: data.length != 0 ? true : false
      })



    })
  }



  render() {

    const actions = [

    ];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {!this.state.next ? <View style={{ flex: 1 }}>

            <TextInput placeholder="请输入问题"
              onChangeText={(quesTitle) => this.setState({ quesTitle })}

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
            <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <TextInput style={{ flex: 1, }} placeholder="搜索或添加新标签"
                  onChangeText={(tagName) => {
                    this.setState({ tagName },
                      () => this.getSearchTagList()
                    );

                  }}
                  value={this.state.tagName}
                ></TextInput>


                <TouchableOpacity onPress={() => { this.addTag() }}

                >

                  <View style={{ backgroundColor: "#0084ff", borderRadius: 5, padding: 10 }}>

                    <Text style={{ textAlign: 'center', fontSize: 12, color: 'white' }}>
                      添加
                  </Text>
                  </View>
                </TouchableOpacity>

              </View>

              <View style={{ height: 1, backgroundColor: '#c1c1c1', marginBottom: 10 }}></View>

              <View style={{}}>

                {this.state.showTagList ? this.renderSearchTagList() : null}

              </View>


              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                {this.state.tagList.length != 0 ? <Text>标签 ： </Text> : null}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>

                  {this.renderTag()}

                </View>
              </View>
              <View style={{ marginTop: 20, }}>
                <Text>热门标签 ： </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap',paddingLeft:20 }}>
                  {this.state.hotTagList}
                </View>
              </View>
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