import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';

import HTMLView from 'react-native-htmlview';

var { width, height } = Dimensions.get('window');
let token;


export default class AnswerDetail extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        let answerVo = this.props.navigation.state.params.item.answerVo;
        let user = answerVo.user;
        this.state = {
            like: false,
            followUser: false,
            followAns: false,
            user: user,
            answer: answerVo
        };


    }

    componentDidMount() {
        this.getToken();
    }

    getToken = async () => {
        token = await AsyncStorage.getItem("userToken");
        if (token != null) {
            this.hasFollowUser();
            this.hasFollowAns();
        }
    }

    setLike = () => {
        this.setState({
            like: !this.state.like,
        })

    }
    hasFollowAns = () => {
        let ansId = this.state.answer.ansId;
        let url = 'http://192.168.1.6:8070/app/answer/hasfollow?ansId=' + ansId;
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token
            }

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
                followAns: data,
            })

        })
    }

    hasFollowUser = () => {
        let useredId = this.state.user.id;
        let url = 'http://192.168.1.6:8070/app/user/hasfollow?useredId=' + useredId;
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token
            }

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
                followUser: data,
            })

        })
    }

    followAns = () => {
        let ansId = this.state.answer.ansId;
        let url;
        if (this.state.followAns)
            url = 'http://192.168.1.6:8070/app/answer/cancelFollow?ansId=' + ansId;
        else
            url = 'http://192.168.1.6:8070/app/answer/follow?ansId=' + ansId;
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token
            }

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
                followAns: !this.state.followAns,
            })

        })

    }

    followUser = () => {
        let useredId = this.state.user.id;
        let url = 'http://192.168.1.6:8070/app/user/follow?useredId=' + useredId;
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token
            }

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
                followUser: true,
            })

        })

    }


    commentDetail = () => {

    }

    cancelFollowAns = () => {
        let ansId = this.state.answer.ansId;
        let url = 'http://192.168.1.6:8070/app/answer/cancelFollow?ansId=' + ansId;
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token
            }

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
                followAns: false,
            })

        })

    }

    cancelFollowUser = () => {
        let useredId = this.state.user.id;
        let url = 'http://192.168.1.6:8070/app/user/cancelFollow?useredId=' + useredId;
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token
            }

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
                followUser: false,
            })

        })

    }



    render() {
        let text = '<img  src="http://192.168.1.6:8070/graduationproject/image/1550318822464image.jpg" />';
        let user = this.state.user;
        let answer = this.state.answer;
        let quesTitle = this.props.navigation.state.params.item.quesTitle;
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, backgroundColor: '#ffffff' }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#eaeaea', borderRadius: 5, flex: 1
                        , paddingLeft: 10, paddingRight: 10
                    }}>
                        <TouchableOpacity onPress={() => { this.goBack() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Image source={require("../../resources/index/jt.png")} style={{ height: 25, width: 25, marginRight: 10 }} />

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.navigateToSearchQuestion() }} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                <TextInput placeholder='搜索答案' style={{ flex: 1, fontSize: 12 }} editable={false} />
                                <Image source={require("../../resources/index/ss.png")} style={{ height: 25, width: 25 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 2, backgroundColor: '#fffff' }} />









                {/* 回答内容 */}
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                        {/* 问题题目 */}


                        <View style={{ flexDirection: 'row', backgroundColor: '#ffffff' }}>
                            <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{quesTitle}</Text>
                            </View>
                        </View>


                        {/* 问题题目-end */}

                        {/* 回答者信息 */}

                        <View style={{ flexDirection: 'row', padding: 5, backgroundColor: '#f1ebeb' }} />


                        <View style={{ backgroundColor: '#ffffff', padding: 10, flexDirection: 'row', alignItems: 'center', }}>


                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ alignItems: 'center', paddingRight: 10 }}>
                                    <TouchableOpacity >
                                        <Image source={{ uri: user.userIconUrl }}
                                            style={{ width: 30, height: 30, borderRadius: 15 }}>
                                        </Image>

                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 13, }}>{user.userName}</Text>
                            </View>
                            {
                                this.state.followUser ?
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.cancelFollowUser()} >
                                            <View style={{ backgroundColor: "gray", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                    已关注 </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.followUser()} >
                                            <View style={{ backgroundColor: "#0084ff", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                    关注 </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                            }



                        </View>

                        {/* 回答者信息-end */}

                        <View style={{ height: 2, backgroundColor: '#fffff' }} />
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <HTMLView value={answer.ansContent} stylesheet={htmlStyles}> </HTMLView>
                        </View>
                    </ScrollView>
                    <View style={{ height: 60, justifyContent: 'flex-end', backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <TouchableOpacity onPress={() => this.setLike()}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={
                                        this.state.like ?
                                            require('../../resources/index/a_dz.png')
                                            :
                                            require('../../resources/index/dz.png')
                                    } style={{ width: 25, height: 25 }} />
                                    <Text style={{ marginLeft: 10, fontSize: 12, color: 'gray', textAlign: 'center' }}>{answer.likeNum}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.followAns()}>
                                    <View>
                                        <Image source={
                                            this.state.followAns ?
                                                require('../../resources/index/a_sc.png')
                                                :
                                                require('../../resources/index/sc.png')
                                        } style={{ width: 25, height: 25, marginRight: 20 }} />
                                        <Text style={{ fontSize: 10, color: 'gray' }}>收藏</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.commentDetail()}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Image source={require('../../resources/index/pl.png')} style={{ width: 25, height: 25 }} />
                                        <Text style={{ fontSize: 10, color: 'gray' }}>{answer.commentNum}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>





            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ffffff',
    },

});
const htmlStyles = StyleSheet.create({
    
});