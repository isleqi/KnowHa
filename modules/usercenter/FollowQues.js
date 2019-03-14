import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';



export default class FollowQues extends Component {
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
            isRefreshing: false
        };

    }

    componentDidMount() {
        this.getFollowQuesList();
    }

    getFollowQuesList = async () => {
        let limit = this.state.limit;
        let page = this.state.page + 1;
        let url = 'http://192.168.1.100:8070/app/user/getFollowQuesList?' + '&pageNum=' + page + '&pageSize=' + limit;
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

    navigateToAnswerList = (item) => {
        let data={
            id:item.quesId,
            quesTitle:item.ques.quesTitle,
            quesDes:item.ques.quesDes,
            followNum:item.ques.followNum,
            answerNum:item.ques.answerNum,
            answerVo:item,
            tagList:item.tagList

        }
        DeviceEventEmitter.emit('navigateToAnswerList', data);

    }


    navigateToAnswerDetail = (item) => {
        let data={
            id:item.quesId,
            quesTitle:item.ques.quesTitle,
            quesDes:item.ques.quesDes,
            followNum:item.ques.followNum,
            answerNum:item.ques.answerNum,
            answerVo:item,
            tagList:item.tagList

        }
        DeviceEventEmitter.emit('navigateToAnswerDetail', data);

    }

    renderItem = (data) => {
        let item = data.item;
        let answer = item;
        let tags = item.tagList;
        let ques=item.ques;

        return (
            <View>
                <View style={{ paddingLeft: 15, paddingTop: 20, flexDirection: 'row', }}>
                    {this.renderTag(tags)}
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>

                        <TouchableOpacity onPress={() => this.navigateToAnswerList(item)}>
                            <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{ques.quesTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        {answer == null ?
                            <Text style={{ fontSize: 11, color: '#bdbcbce8', paddingTop: 5, paddingBottom: 5 }}>暂无回答</Text>
                            :
                            <TouchableOpacity onPress={()=>this.navigateToAnswerDetail(item)}>
                            <View>
                                <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                                    <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                        numberOfLines={3}>
                                        {answer.ansContent}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{answer.likeNum} 赞同 · </Text>
                                    <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{answer.commentNum} 评论</Text>

                                </View>
                            </View>
                            </TouchableOpacity>
                        }

                    </View>

                </View>
                <View style={{ height: 8, backgroundColor: "#eae9e961" }}></View>
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
            this.getFollowQuesList();
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

        this.getFollowQuesList();
    }

    listHeader = () => {
        return (
            <View style={{ height: 100,backgroundColor:'#0084ff', flexDirection: 'row', alignItems: 'center' }}>
            <View>
                <Text style={{color:'white',paddingLeft:20,fontSize:18,fontWeight:'bold'}}>我的关注</Text>
                <Text style={{color:'white',paddingLeft:20,paddingTop:10, fontSize:10}}>共 {this.state.data.length} 个内容</Text>

                </View>
            </View>
        );
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