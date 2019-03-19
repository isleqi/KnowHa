import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid, Modal, TextInput,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';
import ImagePicker from 'react-native-image-picker';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import UserAnswer from './UserAnswer';
import UserArticle from './UserArticle';

let baseUrl = Base.baseUrl;
let userToken;
export default class UserHome extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {

            userId: this.props.navigation.state.params.userId,
            userName: '',
            avatarPath: '',
            description: '',
            fansNum: 0,
            followsNum: 0,

        };

    }
    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo = () => {
        let url = baseUrl + '/app/user/getUserInfo';
        let formData = new FormData();
        formData.append("userId", this.state.userId);

        fetch(url, {
            method: 'POST',
            body: formData

        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
            if (responseData.code != "200") {
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
                return;
            }
            let data = responseData.data;

            let user = data.user;
            this.setState({
                userName: user.userName,
                avatarPath: user.userIconUrl,
                fansNum: data.fansNum,
                followsNum: data.followsNum,
                description: user.userDes == null ? '' : user.userDes,


            })


        })
    }


    //上拉刷新
    onRefresh = () => {
        //重置参数
        this.setState({
            isRefreshing: true,
            animating: false
        }, () => {
            this.getUserInfo();
            this.setState({ isRefreshing: false });
        });
    }





    render() {
        return (
            // <ScrollView
            //     refreshControl={
            //         <RefreshControl
            //             refreshing={this.state.isRefreshing}
            //             onRefresh={this.onRefresh}
            //             colors={['rgb(217, 51, 58)']}
            //         />
            //     }
            //     style={{ backgroundColor: '#ffffff' }}
            // >
                <View style={styles.container}>

                    <View style={styles.content}>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>

                                <View style={{ alignItems: 'center', paddingBottom: 10, paddingTop: 20 }}>


                                    <Image source={{ uri: this.state.avatarPath }}
                                        style={{ width: 80, height: 80, borderRadius: 40 }}>
                                    </Image>

                                </View>
                                <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                                    <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}>
                                        <Text>{this.state.userName}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                                        <Text style={{ fontSize: 12 }}>关注 {this.state.followsNum}  |   </Text>
                                        <Text style={{ fontSize: 12 }}>粉丝 {this.state.fansNum}</Text>
                                </View>

                                <View style={{ alignItems: 'center', paddingBottom: 10 }}>

                                    <Text style={{ fontSize: 12 }}>简介：{this.state.description == '' ? '暂无个人简介' : this.state.description}</Text>

                                </View>
                                <View style={{ height: 4, backgroundColor: "#f1efef" }}></View>

                            </View>
                        </View>
                        <ScrollableTabView
                            // initialPage={0}
                            renderTabBar={() => <ScrollableTabBar />}
                            tabBarBackgroundColor='#ffffff'
                            tabBarActiveTextColor='#0084ff'
                            tabBarUnderlineStyle={{ backgroundColor: '#0084ff' }}
                            style={{flex:1}}
                        >

                            <UserAnswer tabLabel='ta的回答' userId={this.state.userId} ></UserAnswer>
                            <UserArticle tabLabel='ta的专栏' userId={this.state.userId}></UserArticle>


                        </ScrollableTabView>
                    </View>
                </View>
            // </ScrollView>
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
        alignItems: "center",
        backgroundColor: '#ffffff',
    }
});