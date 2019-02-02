import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput,ImageBackground,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import  ImagePicker from 'react-native-image-picker'; 


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
            avatarSource:''
        };

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
                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    selectSex = (sex) => {
        console.log(sex)
        this.setState({
            sex: sex,
            activity: sex
        });
    }

    navigateHome=()=>{
        this
        .props
        .navigation
        .navigate('App');
      }

    render() {
        let bottonColor = this.state.sendFlag ? '#c1c1c1' : 'white';
        let textColor = this.state.sendFlag ? 'white' : 'black';
        return (
            <View style={styles.container}>

                <View style={styles.content}>
                    <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                    <TouchableOpacity onPress={() =>this.choosePicker() } >
                   
                        <Image source={
                            this.state.avatarSource==''?
                            (this.state.sex == 1 ? require('../../resources/register/boy.png') :
                               require('../../resources/register/girl.png') ):
                            this.state.avatarSource
                        }
                               style={{ width: 80, height: 80,borderRadius:40}}>
                              </Image>
                              
                    </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.selectSex(1)}  style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={this.state.activity == 1 ? require('../../resources/register/activity.png') : require('../../resources/register/noActivity.png')} style={{ width: 20, height: 20, opacity: 0.8 }} />
                        <Text style={{ color: '#666' }}> 男 </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectSex(0)} style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={this.state.activity == 0 ? require('../../resources/register/activity.png') : require('../../resources/register/noActivity.png')} style={{ width: 20, height: 20, opacity: 0.8 }} />
                        
                        <Text style={{ color: '#666' }}> 女</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 40 }}>
                        <View style={{ flex: 1 }}>
                            <TextInput placeholder="请输入昵称" clearButtonMode="always"></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
                            <TextInput placeholder="请输入用户简介"></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
                            <TextInput placeholder="请输入密码" secureTextEntry={true}></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>
                            <TextInput placeholder="请确认密码" secureTextEntry={true}></TextInput>
                            <View style={{ height: 1, backgroundColor: '#c1c1c1' }}></View>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={()=>this.navigateHome()} style={{ flex: 1,flexDirection: 'row',  }}>

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