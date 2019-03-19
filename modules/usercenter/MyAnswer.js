import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,Alert,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import Base from '../../utils/Base';
import ScreenUtil from '../../utils/ScreenUtil';
import HTMLView from 'react-native-htmlview';


let baseUrl = Base.baseUrl;


export default class MyAnswer extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
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
            isRefreshing: false,
            edit: false
        };

    }

    componentDidMount() {
        this.getMyAnswerList();
    }

    getMyAnswerList = async () => {
        let limit = this.state.limit;
        let page = this.state.page + 1;
        let url = baseUrl + '/app/user/getMyAnswer?' + '&pageNum=' + page + '&pageSize=' + limit;
        let token = await AsyncStorage.getItem("userToken");
        fetch(url, {
            method: 'GET',
            headers: {
                "token": token,
            }

        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
            if (responseData.code != "200") {
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
                return;
            }
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
            })

        })
    }

    navigateToCreateaAnswer = (item) => {
        this
            .props
            .navigation
            .navigate('CreateAnswer', { quesId: item });
    }


    goBack = () => {
        this.props.navigation.goBack();
    }

    renderTag = (tagList) => {
        let tags = tagList;
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


    editItem=(item)=>{
        this
        .props
        .navigation
        .navigate('UpdateAnswer', { answerId: item.ansId ,ansContent:item.ansContent}); 
       }

    deleteItem=(item,index)=>{
        Alert.alert(
            '删除',
            "是否删除该回答",
            [
                { text: '取消', onPress: () => console.log('Cancel Pressed!') },
                { text: '继续', onPress: () => this.toDeleteItem(item, index) },
            ]
        )
    }

    toDeleteItem=(item,index)=>{
        let ansId=item.ansId;
        let quesId=item.quesId;
        let url = baseUrl + '/app/answer/deleteAnswer?ansId='+ ansId + '&quesId=' + quesId;
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
            let data=this.state.data;
            data.splice(index,1);
            this.setState({
                data:data
            });
            ToastAndroid.show("删除成功", ToastAndroid.SHORT);
        })
    }


    renderItem = (data) => {
        let item = data.item;
        let user = item.user;
        let ques = item.ques;
        let index=data.index;
        return (
            <View style={{ backgroundColor: '#ffffff' }}>
                <View style={{ paddingLeft: 15, paddingTop: 20, flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{ alignItems: 'center', paddingRight: 10 }}>
                        <TouchableOpacity onPress={() => { }} >
                            <Image source={{ uri: user.userIconUrl }}
                                style={{ width: 20, height: 20, borderRadius: 10 }}>
                            </Image>

                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 11, }}>{user.userName}</Text>
                    {
                        this.state.edit ?
                            <View style={{ flex: 1, justifyContent: 'flex-end',alignItems:"center",paddingLeft:20, paddingRight: 20, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.deleteItem(item, index)} >
                                        <View style={{ backgroundColor: "red",marginRight:10, borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                删除 </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.editItem(item)} >
                                        <View style={{ backgroundColor: "#0084ff",marginRight:10, borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                编辑 </Text>
                                        </View>
                                    </TouchableOpacity>
                                <TouchableOpacity onPress={() =>this.setState({edit:false})} >

                                <Image source={require('../../resources/user/jt.png')} style={{ height: 20, width: 20 }} />
                                </TouchableOpacity>

                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'flex-end', paddingRight: 20, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() =>this.setState({edit:true})} >

                                <Image source={require('../../resources/user/zk.png')} style={{ height: 15, width: 15 }} />
                                </TouchableOpacity>

                            </View>

                    }

                </View>
                <View style={{ paddingLeft: 15, paddingBottom: 15, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ fontWeight: 'bold' }}>{ques.quesTitle}</Text>

                </View>
                <TouchableOpacity onPress={() => this.navigateToAnswerDetail(item)} activeOpacity={1}>


                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>



                            <View style={{ paddingTop: 5, paddingBottom: 5, height: 50 }}>
                                <HTMLView value={item.ansContent} > </HTMLView>

                                {/* <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                numberOfLines={3}>
                                {item.ansContent}
                            </Text> */}
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20, backgroundColor: '#ffffff' }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{item.likeNum} 赞同 · </Text>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{item.commentNum} 评论</Text>
                                </View>


                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: "#f3f3f3" }}></View>
            </View>

        );
    }

    //上拉刷新
    onRefresh = () => {
        //重置参数
        this.setState({
            isRefreshing: true,
            page: 0,
            totalPage: 0,
            data: [],
            showFoot: 0,
            animating: false
        }, () => {
            this.getMyAnswerList();
            this.setState({ isRefreshing: false });
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
                        backgroundColor: '#ffffff'
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
                        backgroundColor: '#ffffff'
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
                        backgroundColor: '#ffffff'
                    }}>
                    <Text></Text>
                </View>
            );
        } else {
            return (
                <View style={{
                    height: ScreenUtil.scaleSize(30), alignItems: 'center', justifyContent: 'flex-start',
                    backgroundColor: '#ffffff'
                }}>
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

        this.getMyAnswerList();
    }

    listHeader = () => {
        return (
            <View style={{ height: 100, backgroundColor: '#0084ff', flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <Text style={{ color: 'white', paddingLeft: 20, fontSize: 18, fontWeight: 'bold' }}>我的回答</Text>
                    <Text style={{ color: 'white', paddingLeft: 20, paddingTop: 10, fontSize: 10 }}>共 {this.state.data.length} 个内容</Text>

                </View>
            </View>
        );
    }

    navigateToAnswerDetail = (item) => {
        let data = {
            answerVo: item,
            quesTitle: item.ques.quesTitle
        }
        DeviceEventEmitter.emit('navigateToAnswerDetail', data);

    }

    render() {


        return (
            <View style={styles.container}>

                <FlatList keyExtractor={(item, index) => index.toString()}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh}
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
        backgroundColor: '#ffffff'
    },

});