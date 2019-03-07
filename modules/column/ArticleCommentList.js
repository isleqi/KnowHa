import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid, TextInput,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';


let baseUrl=Base.baseUrl;
let commentUrl=Base.baseUrl+"/app/column/comment";
let replyUrl=Base.baseUrl+"/app/column/comment/reply";
export default class ArticleCommentList extends Component {
    static navigationOptions = () => ({
        title: '评论列表',

        headerTitleStyle: { fontSize: 15, },





    });
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            articleId: this.props.navigation.state.params.articleId,
            placeholder:'添加评论',
            commetUrl:commentUrl,
            add:this.addComment,
            item:{},
            comment: '',
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

    componentDidMount() {
        this.getCommentList();
    }

    getCommentList = async () => {
        let limit = this.state.limit;
        let page = this.state.page + 1;
        let articleId = this.state.articleId;
        let url =baseUrl+ '/app/column/getCommentList?articleId=' + articleId + '&pageNum=' + page + '&pageSize=' + limit;
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

   
    navigateToCommentReplyList=(item)=>{
        this
        .props
        .navigation
        .navigate('ArticleCommentReplyList', { articleCommentId: item });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    addComment = async () => {
        let item=this.state.item;
        let articleId = this.state.articleId;
        let comment = this.state.comment;
        if (comment == '') {
            ToastAndroid.show("评论不能为空", ToastAndroid.SHORT);
            return;
        }
        let url =baseUrl+'/app/column/comment';
        let formData = new FormData();
        formData.append("articleId", articleId);
        formData.append("comment", comment);

        let token = await AsyncStorage.getItem("userToken");
        fetch(url, {
            method: 'POST',
            headers: {
                "token": token,
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
            let item = responseData.data;
            let data = this.state.data;
            data.splice(0, 0, item);
            this.setState({
                data: data,
                comment: '',
            })


        })
    }

    toReply=async ()=>{
        let item=this.state.item;
        let articleId=item.articleId;
        let commentId = item.id;
        let useredId=item.userId;
        let comment = this.state.comment;
        if (comment == '') {
            ToastAndroid.show("回复不能为空", ToastAndroid.SHORT);
            return;
        }
        let url = Base.baseUrl+'/app/column/comment/reply';
        let formData = new FormData();
        formData.append("commentId", commentId);
        formData.append("replyedUserId", useredId);
        formData.append("comtent", comment);


        let token = await AsyncStorage.getItem("userToken");
        fetch(url, {
            method: 'POST',
            headers: {
                "token": token,
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
            let item = responseData.data;
         
            this.setState({
                comment: '',
                placeholder:'添加评论'
            });

            this.navigateToCommentReplyList(commentId);


        })
    }


    reply=async(item)=>{
        let usered=item.user;
        let useredName=usered.userName;
        let text='回复：'+useredName;
         this.setState({
             placeholder:text,
             add:this.toReply,
             item:item
         }
        );
         
        
        
    }



    renderItem = (data) => {
        let item = data.item;
        let user = item.user;
        let date = new Date(item.creatTime);
        let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return (
            <View>


                <View style={{ flexDirection: 'row' }}>

                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, flexDirection: 'row' }}>

                        <View style={{ flex: 0.2 }}>
                            <TouchableOpacity onPress={() => { }} >
                                <Image source={{ uri: user.userIconUrl }}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}>
                                </Image>

                            </TouchableOpacity>
                        </View>
                       
                        <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={()=>this.reply(item)}>

                            <Text style={{ fontSize: 13, }}>{user.userName}</Text>
                            <Text style={{ fontSize: 13, }}>{item.commentContent}</Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row' }} >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, color: 'gray' }}>{time}</Text>
                                </View>
                                {
                                    item.replyNum!=0? 
                                    <TouchableOpacity onPress={()=>this.navigateToCommentReplyList(item.id)}>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 10, flex: 1, color: 'gray' }}>查看对话</Text>
                                    </View>
                                    </TouchableOpacity>
                                    :
                                    null
                                }
                               
                            </View>
                        </View>

                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: "#eae9e961" }}></View>

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
            this.getCommentList();
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
                        justifyContent: 'flex-start'
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
                        justifyContent: 'center'
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
                        justifyContent: 'flex-start'
                    }}>
                    <Text></Text>
                </View>
            );
        } else {
            return (
                <View style={{ height: ScreenUtil.scaleSize(30), alignItems: 'center', justifyContent: 'flex-start', }}>
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

        this.getCommentList();
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
                    style={{ flex: 1 }}
                />

                <View style={{ height: 80, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <View style={{ flex: 1, }}>
                            <TextInput style={{ padding: 10 }} value={this.state.comment} placeholder={this.state.placeholder} onChangeText={(comment) => this.setState({ comment })} />
                            <View style={{ height: 1, backgroundColor: "gray" }}></View>
                        </View>
                        <TouchableOpacity onPress={() => this.state.add()}>
                            <Image source={require('../../resources/index/tw.png')} style={{ width: 30, height: 30, paddingRight: 10 }} />
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
        backgroundColor: '#ffffff'
    },

});