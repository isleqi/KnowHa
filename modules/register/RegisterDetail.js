import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ImageBackground,ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';


let baseUrl = Base.baseUrl;
let timerId;
export default class RegisterDetail extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            sex: 1,    //1 男  0 女
            activity: 1,
            avatarSource: '',
            avatarPath:"",
            identityType: this.props.navigation.state.params.type,
            account: this.props.navigation.state.params.account,
            userName: '',
            description: '',
            password: ''
        };

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
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    avatarSource: source

                });

                this.uploadImage(response.uri);

            }
        });
    }

    uploadImage = (path) => {
        let url =baseUrl+ '/app/user/uploadAvatar';
        let file = { uri: path, type: 'application/octet-stream', name: 'image.jpg' };
        let formData = new FormData();
        formData.append("file", file);
    
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
    
          },
    
          body: formData
    
        }).then((response) => {
          return response.json();
        }).then((responseData) => {
            if (responseData.code != "200") {
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
                return;
            }
            let data=responseData.data;
            this.setState({
               avatarPath:data
            })
        })
    
      }
    

    selectSex = (sex) => {
        console.log(sex)
        this.setState({
            sex: sex,
            activity: sex
        });
    }

    navigateHome = () => {

        let url = 'http://192.168.1.100:8070/app/register/submit';
        let formData = new FormData();
        formData.append("account", this.state.account);
        formData.append("identityType", this.state.identityType);
        formData.append("userName", this.state.userName);
        formData.append("description", this.state.description);
        formData.append("password", this.state.password);
        let params={
            "account":this.state.account,
            "identityType": this.state.identityType,
            "password": this.state.password,
            "userName": this.state.userName,
            "description":this.state.description,
            'avatarPath':this.state.avatarPath
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)

        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
            if (responseData.code != "200")
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
            else {
                AsyncStorage.setItem("userToken", responseData.data);
                this
                    .props
                    .navigation
                    .navigate('App');
            }
        })

    }

    render() {
        let bottonColor = this.state.sendFlag ? '#c1c1c1' : 'white';
        let textColor = this.state.sendFlag ? 'white' : 'black';
        return (
            <View style={styles.container}>

                <View style={styles.content}>
                    <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                        <TouchableOpacity onPress={() => this.choosePicker()} >

                            <Image source={
                                this.state.avatarSource == '' ?
                                    (this.state.sex == 1 ? require('../../resources/register/boy.png') :
                                        require('../../resources/register/girl.png')) :
                                    this.state.avatarSource
                            }
                                style={{ width: 80, height: 80, borderRadius: 40 }}>
                            </Image>

                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.selectSex(1)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={this.state.activity == 1 ? require('../../resources/register/activity.png') : require('../../resources/register/noActivity.png')} style={{ width: 20, height: 20, opacity: 0.8 }} />
                            <Text style={{ color: '#666' }}> 男 </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectSex(0)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={this.state.activity == 0 ? require('../../resources/register/activity.png') : require('../../resources/register/noActivity.png')} style={{ width: 20, height: 20, opacity: 0.8 }} />

                            <Text style={{ color: '#666' }}> 女</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 40 }}>
                        <View style={{ flex: 1 }}>
                            <TextInput placeholder="请输入昵称" onChangeText={(userName) => this.setState({ userName })}></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
                            <TextInput placeholder="请输入用户简介" onChangeText={(description) => this.setState({ description })}></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
                            <TextInput placeholder="请输入密码" secureTextEntry={true} onChangeText={(password) => this.setState({ password })}></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
                            <TextInput placeholder="请确认密码" secureTextEntry={true}></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <TouchableOpacity onPress={() => this.navigateHome()} style={{ flex: 1, flexDirection: 'row', }}>

                            <View style={{
                                flex: 1, backgroundColor: '#0084ff', borderRadius: 10, alignItems: 'center',
                                justifyContent: 'center', paddingTop: 10, paddingBottom: 10
                            }}>
                                <Text style={{ fontSize: 15, color: 'white' }}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 80
    },
    content: {
        flex: 1,
        //  backgroundColor:'red',
        alignItems: "center",
    }

});