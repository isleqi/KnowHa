import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import Base from '../../utils/Base';
import ScreenUtil from '../../utils/ScreenUtil';
import HTMLView from 'react-native-htmlview';


let baseUrl = Base.baseUrl;
let tempStr = '';
export default class SearchArticle extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            str: '',
            data: [],
            //条数限制
            limit: 10,
            //当前页数
            page: 0,
            //总页数
            totalPage: 0,
            showFoot: 0,
            //是否显示指示器
            animating: false,
            //是否刷新
            isRefreshing: false

        };

    }

    search2 = async () => {
        let url = baseUrl + '/app/column/search';
        let token = await AsyncStorage.getItem("userToken");
        let limit = this.state.limit;
        let page = this.state.page + 1;
        let formData = new FormData();
        formData.append("str", this.state.str);
        formData.append("pageNum", page);
        formData.append("pageSize", limit);
        console.log(this.state.str);
        fetch(url, {
            method: 'POST',
            headers: {
                "token": token
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

            //   let data = responseData.data.list;
            let list = responseData.data.list;

            //当前页数
            let currPage = responseData.data.pageNum;
            //总页数
            let totalPage = responseData.data.pages;

            //将请求到的数据拼接到原来数据的后面
            list = this.state.data.concat(list);
            let foot = 1;
            let animating = true;
            if (currPage >= totalPage) {
                foot = 2; //没有更多数据了    
                animating = false;
            }
            if (list == null || list.length == 0) {
                //没有数据
                foot = 0;
                animating = false;
            }


            this.setState({
                data: list,
                showFoot: foot,
                totalPage: totalPage,
                animating: animating,
                page: currPage
            });

        })

    }

    search = async () => {
        if (tempStr == this.state.str)
            return
        tempStr = this.state.str;
        let token = await AsyncStorage.getItem("userToken");
        this.setState({
            isRefreshing: true,
            page: 0,
            totalPage: 0,
            data: [],
            showFoot: 0,
            animating: false
        },
            () => {
                let url = baseUrl + '/app/column/search';
                let limit = this.state.limit;
                let page = this.state.page + 1;
                let formData = new FormData();
                formData.append("str", this.state.str);
                formData.append("pageNum", page);
                formData.append("pageSize", limit);
                console.log(this.state.str);
                fetch(url, {
                    method: 'POST',
                    headers: {
                        "token": token
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

                    //   let data = responseData.data.list;
                    let list = responseData.data.list;

                    //当前页数
                    let currPage = responseData.data.pageNum;
                    //总页数
                    let totalPage = responseData.data.pages;

                    //将请求到的数据拼接到原来数据的后面
                    list = this.state.data.concat(list);
                    let foot = 1;
                    let animating = true;
                    if (currPage >= totalPage) {
                        foot = 2; //没有更多数据了    
                        animating = false;
                    }
                    if (list == null || list.length == 0) {
                        //没有数据
                        foot = 0;
                        animating = false;
                    }


                    this.setState({
                        data: list,
                        showFoot: foot,
                        totalPage: totalPage,
                        animating: animating,
                        page: currPage
                    });

                })
            });


    }

  //底部组件
  listFooterComponent = () => {
    if (this.state.showFoot == 2) {
        return (
            <View
                style={{
                    height: ScreenUtil.scaleSize(50),
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor:'#ffffff'
                }}>
                <Text
                    style={{
                        color: '#999999',
                        fontSize: ScreenUtil.scaleSize(12),
                        marginTop: ScreenUtil.scaleSize(15),
                        marginBottom: ScreenUtil.scaleSize(10)
                    }}>
                    没有更多数据了
                    </Text>
            </View>
        );
    } else if (this.state.showFoot == 1) {
        return (
            <View
                style={{
                    height: ScreenUtil.scaleSize(50),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:'#ffffff'
                }}>
                <ActivityIndicator animating={this.state.animating} size="small" color="grey" />
                <Text>正在加载更多数据...</Text>
            </View>
        );
    } else if (this.state.showFoot == 0) {
        return (
            <View
                style={{
                    height: ScreenUtil.scaleSize(30),
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor:'#ffffff'
                }}>
                <Text></Text>
            </View>
        );
    } else {
        return (
            <View style={{ height: ScreenUtil.scaleSize(30), alignItems: 'center', justifyContent: 'flex-start' ,
            backgroundColor:'#ffffff'}}>
                <Text></Text>
            </View>
        );
    }
}

    onEndReached = () => {
        //最后一页，直接返回
        if (this.state.page >= this.state.totalPage && this.state.page > 0) {
            return;
        }

        this.search2();
    }

    navigateToArticleDetail = (item, index) => {
        if (item.type == 1) {
            this.payArticle(item, index);
        }
        else {
            let data = {
                item: item,
                index: index,
                refreshItem: this.refreshItem
            }
            DeviceEventEmitter.emit('navigateToArticleDetail', data);
        }

    }

    finishPay = async (item, index) => {
        let url = baseUrl + '/app/column/payForArticle?articleId=' + item.articleId + '&value=' + item.value;
        let token = await AsyncStorage.getItem("userToken");
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
            let data = this.state.data;
            item.hasPay = true;
            data.splice(index, 1, item);
            this.setState({
                data: data
            })
            let params = {
                item: item,
                index: index,
                refreshItem: this.refreshItem
            }
            DeviceEventEmitter.emit('navigateToArticleDetail', params);
        })
    }

    payArticle = (item, index) => {
        let value = item.value;

        if (item.hasPay || item.myArticle) {
            let params = {
                item: item,
                index: index,
                refreshItem: this.refreshItem
            }
            DeviceEventEmitter.emit('navigateToArticleDetail', params);
        }

        else
            Alert.alert(
                '付费',
                "该内容为付费内容，查看需" + value + "积分，是否继续",
                [
                    { text: '取消', onPress: () => console.log('Cancel Pressed!') },
                    { text: '继续', onPress: () => this.finishPay(item, index) },
                ]
            )
    }

    renderTag = (item) => {

        let isMyArticle = item.myArticle;
        if (isMyArticle)
            return (
                <View style={{ backgroundColor: '#efbb09', padding: 4, borderRadius: 5, marginRight: 10 }}>
                    <Text style={{ fontSize: 9, color: 'white' }}>我的原创</Text>
                </View>
            );
        else {
            if (item.hasPay)
                return (
                    <View style={{ backgroundColor: 'gray', padding: 4, borderRadius: 5, marginRight: 10 }}>
                        <Text style={{ fontSize: 9, color: 'white' }}>已付费</Text>
                    </View>
                );
            else {
                if (item.type == 0)
                    return (
                        <View style={{ backgroundColor: '#26e671', padding: 4, borderRadius: 5, marginRight: 5 }}>
                            <Text style={{ fontSize: 9, color: 'white' }}>免费</Text>
                        </View>
                    );
                else
                    return (
                        <View style={{ backgroundColor: 'red', padding: 4, borderRadius: 5, marginRight: 5 }}>
                            <Text style={{ fontSize: 9, color: 'white' }}>付费</Text>
                        </View>
                    );
            }
        }

    }

    renderItem = (data) => {
        let item = data.item;
        let index = data.index;
        let user = item.user;
        return (
            <TouchableOpacity onPress={() => this.navigateToArticleDetail(item, index)} activeOpacity={1}>
            <View style={{ backgroundColor: '#ffffff' }}>
                    <View style={{ paddingLeft: 15, paddingTop: 20, flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ alignItems: 'center', paddingRight: 10 }}>
                                <TouchableOpacity onPress={() => { }} >
                                    <Image source={{ uri: user.userIconUrl }}
                                        style={{ width: 25, height: 25, borderRadius: 13 }}>
                                    </Image>

                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 13, }}>{user.userName}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 20 }} >
                            {this.renderTag(item)}
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>


                            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.articleTitle}</Text>
                            </View>

                            <View style={{ paddingTop: 5, paddingBottom: 5, height: 50, backgroundColor: '#ffffff' }}>
                                        <HTMLView value={item.articleContent}> </HTMLView>
                                {/* <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                    numberOfLines={3}>
                                    {item.articleContent}
                                </Text> */}
                            </View>

                                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20, backgroundColor: '#ffffff' }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{item.likeNum} 赞同 · </Text>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{item.commentNum} 评论</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Image source={require('../../resources/column/yj.png')}
                                        style={{ width: 20, height: 12, opacity: 0.3, marginRight: 10 }} />
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8', marginRight: 15 }}>{item.browse}</Text>
                                </View>

                            </View>
                        </View>

                    </View>
                    <View style={{ height: 8, backgroundColor: "#f3f3f3" }}></View>
                </View>
            </TouchableOpacity>

        );
    }

    listHeader = () => {
        return (
            <View style={{ height: 8, backgroundColor: "#eae9e961" }}></View>
        );
    }



    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row',padding:15 }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#eaeaea', borderRadius: 5, flex: 1
                        , padding:10
                    }}>

                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <TextInput placeholder='搜索文章' style={{ flex: 1, fontSize: 12 ,paddingVertical: 0,}}
                                onChangeText={(str) => {
                                    this.setState({ str });
                                }}
                            />
                            <TouchableOpacity onPress={() => this.search()} >
                                <Image source={require("../../resources/index/ss.png")} style={{ height: 25, width: 25 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <FlatList keyExtractor={(item, index) => index.toString()}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    //  refreshing={this.state.isRefreshing}
                    // onRefresh={this.onRefresh}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1}
                    ListFooterComponent={this.listFooterComponent}
                    ListHeaderComponent={this.listHeader}
                />


            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

});