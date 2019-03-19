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
import Base from '../../utils/Base';
import ScreenUtil from '../../utils/ScreenUtil';


let baseUrl = Base.baseUrl;
let that;
let imagPath;
let next = false;
export default class AskQuestion extends Component {
    //  static navigationOptions;
    static navigationOptions = () => ({
        title: '编辑回答',

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
            ansContent:this.props.navigation.state.params.ansContent,
            answerId:this.props.navigation.state.params.answerId,
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
        let url = baseUrl+'/app/user/uploadImage';
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
            if (responseData.code != "200") {
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
                return;
              }
            let data = responseData.data
            this.insertImage(data[0]);
        })

    }


    insertImage = async (path) => {
        let contentHtml = await this.richtext.getContentHtml();
        let html = contentHtml + "<img src=" + path + ' / width="320" height="300"><br/>';
        this.richtext.setContentHTML(html);
    }



    addImage = () => {
        this.choosePicker();
    }


    navigateToAnswerDetail = (item) => {
        this
            .props
            .navigation
            .navigate('AnswerDetail',{item:item});
    }

    finish = async () => {


        let url = baseUrl+'/app/answer/updateAnswer';
      let ansContent=await this.richtext.getContentHtml();
      let formData=new FormData();
      formData.append("ansId",this.state.answerId);
      formData.append("content",ansContent);
 
        let token = await AsyncStorage.getItem("userToken");

        fetch(url, {
            method: 'POST',
            headers: {
                'token': token,
            },
            body: formData

        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
            if (responseData.code != "200") {
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
                return;
            }

            ToastAndroid.show("更新回答成功", ToastAndroid.SHORT);
         
            this.props.navigation.goBack();


        })
    }



    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ flex: 1,paddingTop:20 }}>
                        <RichTextEditor
                            ref={(r) => this.richtext = r}
                            // ref={"editor"}
                            style={styles.richText}
                            // titlePlaceholder="请输入问题标题"
                            hiddenTitle={true}
                            contentPlaceholder="请输入回答"
                            initialContentHTML={this.state.ansContent}
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