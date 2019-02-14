import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


export default class FollowQuestion extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };

    }

    componentDidMount() {
        this.getFollowQuestionList();
    }

    getFollowQuestionList =async () => {
        let url = 'http://192.168.1.6:8070/app/question/getFollowQuesList?pageNum=1&pageSize=10';
            let token = await AsyncStorage.getItem("userToken");
            if (token == null) {
                ToastAndroid.show("请先登录", ToastAndroid.SHORT);
                DeviceEventEmitter.emit('navigateToAuth');

              }
        fetch(url, {
            method: 'GET',
            headers:{
                "token":token,
            }
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
            if (responseData.code != "200") {
                ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
                return;
            }
            let data = responseData.data.list;

            this.setState({
                data: data
            })

        })
    }

    navigateToAnswerList = (item) => {
        DeviceEventEmitter.emit('navigateToAnswerList', item);

    }

    navigateToQuestionList = (item) => {
        DeviceEventEmitter.emit('navigateToQuestionList', item);

    }
    navigateToAnswerDetail = (item) => {
        DeviceEventEmitter.emit('navigateToAnswerDetail', item);

    }

    renderTag = (tagList) => {
        let tags = tagList;
        let view = [];

        for (let i = 0; i < tags.length; i++) {

            let tag = tags[i];
            view.push(
                <TouchableOpacity onPress={() => this.navigateToQuestionList(tag)}>
                    <View style={{ backgroundColor: 'gray', padding: 4, borderRadius: 5, marginRight: 5 }}>
                        <Text style={{ fontSize: 9, color: 'white' }}>{tag.tagName}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return view;
    }


    renderItem = (data) => {
        let item = data.item;
        let answer = item.answerVo;
        let tags = item.tagList;

        return (
            <View>
                <View style={{ paddingLeft: 15, paddingTop: 20, flexDirection: 'row', }}>
                    {this.renderTag(tags)}
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>

                        <TouchableOpacity onPress={() => this.navigateToAnswerList(item)}>
                            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.quesTitle}</Text>
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

    listHeader = () => {
        return (
            <View style={{ height: 8, backgroundColor: "#eae9e961" }}></View>
        );
    }


    render() {
        return (
            <View style={styles.container}>

                <FlatList keyExtractor={(item, index) => index.toString()}
                    // refreshControl={  //设置下拉刷新组件
                    //     <RefreshControl
                    //         refreshing={this.state.isRefreshing}
                    //         onRefresh={this.onRefreshHistory}
                    //         tintColor='white'
                    //         title={this.state.isRefreshing ? '刷新中....' : '下拉刷新'}
                    //     />
                    //}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter}
                    ListHeaderComponent={this.listHeader}
                //ListEmptyComponent={this._listEmptyComponent}
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