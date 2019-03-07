import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput, BackAndroid,
    Platform, ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView,
    RefreshControl, FlatList, Dimensions
} from 'react-native';

import HTMLView from 'react-native-htmlview';

var { width, height } = Dimensions.get('window');
let token;


export default class ArticleDetail extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        console.log(this.props.navigation.state.params.data);
        let articleVo = this.props.navigation.state.params.data.item;
        let index = this.props.navigation.state.params.data.index;
        let refreshItem = this.props.navigation.state.params.data.refreshItem;
        let user = articleVo.user;
        this.state = {
            like: false,
            followUser: false,
            user: user,
            article: articleVo,
            index: index,
            refreshItem: refreshItem
        };


    }

    componentDidMount() {
        this.getToken();
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener("hardwareBackPress", this.refreshItem);
        } else {

        }
    }

    refreshItem = () => {
        if(this.state.refreshItem!=undefined)
           this.state.refreshItem(this.state.article.articleId, this.state.index);
          
      
    }

    getToken = async () => {
        token = await AsyncStorage.getItem("userToken");
        if (token != null) {
            this.hasFollowUser();

        }
    }

    setLike = () => {
        this.setState({
            like: !this.state.like,
        })

    }


    hasFollowUser = () => {
        let useredId = this.state.user.id;
        let url = 'http://192.168.1.100:8070/app/user/hasfollow?useredId=' + useredId;
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



    followUser = () => {
        let useredId = this.state.user.id;
        let url = 'http://192.168.1.100:8070/app/user/follow?useredId=' + useredId;
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



    cancelFollowUser = () => {
        let useredId = this.state.user.id;
        let url = 'http://192.168.1.100:8070/app/user/cancelFollow?useredId=' + useredId;
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

    navigateToArticleCommentList = (item) => {

        this
            .props
            .navigation
            .navigate('ArticleCommentList', { articleId: item });

    }



    render() {
        let user = this.state.user;
        let article = this.state.article;
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
                        <TouchableOpacity onPress={() => { this.navigateToSearchArtice() }} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                <TextInput placeholder='搜索文章' style={{ flex: 1, fontSize: 12 }} editable={false} />
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
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{article.articleTitle}</Text>
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
                            <HTMLView value={article.articleContent} stylesheet={htmlStyles}> </HTMLView>
                        </View>
                    </ScrollView>
                    <View style={{ height: 60, justifyContent: 'flex-end', backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, paddingRight: 15, paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => this.setLike()}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={
                                        this.state.like ?
                                            require('../../resources/index/a_dz.png')
                                            :
                                            require('../../resources/index/dz.png')
                                    } style={{ width: 25, height: 25 }} />
                                    <Text style={{ marginLeft: 10, fontSize: 12, color: 'gray', textAlign: 'center' }}>{article.likeNum}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => this.navigateToArticleCommentList(article.articleId)}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Image source={require('../../resources/index/pl.png')} style={{ width: 25, height: 25 }} />
                                        <Text style={{ fontSize: 10, color: 'gray' }}>{article.commentNum}</Text>
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