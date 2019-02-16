import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


let token;
export default class AnswerListHeader extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            quesData: this.props.data,
            isFollow: false,
            followNum: this.props.data.followNum,
        };

    }

    componentDidMount() {
        this.getToken();
    }

    getToken = async () => {
        token = await AsyncStorage.getItem("userToken");
        if (token != null) {
            this.hasFollowQues();
        }
    }

    navigateToCreateaAnswer=(quesId)=>{
        this.props.navigateToCreateaAnswer(quesId);
    }



    renderTag = () => {
        let tags = this.state.quesData.tagList;
        let view = [];

        for (let i = 0; i < tags.length; i++) {

            let tag = tags[i];
            view.push(
                <View style={{ backgroundColor: 'gray', padding: 4, borderRadius: 5, marginRight: 5 }}>
                    <Text style={{ fontSize: 9, color: 'white' }}>{tag.tagName}</Text>
                </View>
            )
        }

        return view;
    }

    goBack = () => {
        this.props.back();
    }

    hasFollowQues = () => {
        let quesId = this.state.quesData.id;
        let url = 'http://192.168.1.6:8070/app/question/hasfollow?quesId=' + quesId;
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
                isFollow: data.hasFollow,
                followNum: data.followNum,
            })

        })
    }

    followQues = () => {
        let quesId = this.state.quesData.id;
        let url = 'http://192.168.1.6:8070/app/question/follow?quesId=' + quesId;
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
                isFollow: true,
                followNum: this.state.followNum + 1

            })

        })
    }

    cancelFollowQues = () => {
        let quesId = this.state.quesData.id;
        let url = 'http://192.168.1.6:8070/app/question/cancelFollow?quesId=' + quesId;
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
                isFollow: false,
                followNum: this.state.followNum - 1
            })

        })
    }






    render() {
        let quesData = this.state.quesData;
        return (
            <View style={styles.container}>
                <View >
                    <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
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

                    <View style={{ paddingLeft: 20, paddingTop: 20, flexDirection: 'row', }}>
                        {this.renderTag()}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>


                            <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{quesData.quesTitle}</Text>
                            </View>

                            <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                    numberOfLines={3}>{quesData.quesDes} </Text>
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{this.state.followNum} 人关注 </Text>
                                </View>
                                {this.state.isFollow ?
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => { this.cancelFollowQues() }} >
                                            <View style={{ backgroundColor: "gray", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                    已关注 </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                    :
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => { this.followQues() }} >
                                            <View style={{ backgroundColor: "#0084ff", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                    关注问题 </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                }


                            </View>

                            <View style={{ flexDirection: 'row', }}>

                                <View style={{ flex: 1, borderRightWidth: 1, borderTopWidth: 1, borderColor: '#e8e8e7', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                    <Image source={require("../../resources/index/yq.png")} style={{ height: 15, width: 15, marginRight: 5 }} />
                                    <Text style={{ fontSize: 13, color: '#949491' }}>邀请回答</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.navigateToCreateaAnswer(quesData.id)} style={{flex:1}} >
                                    <View style={{ flex: 1, borderTopWidth: 1, borderColor: '#e8e8e7', justifyContent: 'center', flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                                        <Image source={require("../../resources/index/tw.png")} style={{ height: 15, width: 15, marginRight: 5, opacity: 0.5 }} />
                                        <Text style={{ fontSize: 13, color: '#949491' }}>写回答</Text>
                                    </View>
                                    </TouchableOpacity>
                            </View>

                                <View style={{ flexDirection: 'row', backgroundColor: '#eae9e961' }}>
                                    <Text style={{ fontSize: 10, color: '#949491', paddingLeft: 20, paddingRight: 20, paddingBottom: 10, paddingTop: 10 }}>222 个回答</Text>
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
                backgroundColor: '#ffffff',
                //    paddingLeft:20,
                //    paddingRight:20
            },
        
});