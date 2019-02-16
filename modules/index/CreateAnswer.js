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
        title: '写回答',

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
            ansContent:'',
            quesId:this.props.navigation.state.params.quesId,
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


    insertImage = async (path) => {
        let contentHtml = await this.richtext.getContentHtml();
        let html = contentHtml + "<br/><img src=" + path + ' / width="320" height="300"><br/><br/>';
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


        let url = 'http://192.168.1.6:8070/app/answer/add';
      let ansContent=await this.richtext.getContentHtml();

        let params = {
            "ansContent":ansContent,
            "quesId":this.state.quesId,
        }

        console.log(params);

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

            let quesTitle=data.ques.quesTitle;
            let quesDes=data.ques.quesDes;
            let id=data.ques.id;

            let params={
                id:id,
                quesTitle:quesTitle,
                quesDes:quesDes,
                answerVo:data,
            }

            this.navigateToAnswerDetail(params);


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