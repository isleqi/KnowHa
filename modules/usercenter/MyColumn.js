import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';
import HTMLView from 'react-native-htmlview';



let baseUrl=Base.baseUrl;


export default class MyColumn extends Component {
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
        this.getFollowArticleList();
    }

    getFollowArticleList = async () => {
        let limit = this.state.limit;
        let page = this.state.page + 1;
        let url = baseUrl+'/app/user/getMyArticle?' + '&pageNum=' + page + '&pageSize=' + limit;
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

    navigateToArticleDetail = (item, index) => {
     
       
            let data = {
                item: item,
                index: index,
                refreshItem: this.refreshItem
            }
            DeviceEventEmitter.emit('navigateToArticleDetail', data);
        

    }


    
    editItem=(item)=>{
        this
        .props
        .navigation
        .navigate('UpdateArticle', {article:item}); 
       }




    renderItem = (data) => {
        let item = data.item;
        let index = data.index;
        let user = item.user;

        return (
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

                      {
                        this.state.edit ?
                            <View style={{ flex: 1, justifyContent: 'flex-end',alignItems:"center",paddingLeft:20, paddingRight: 20, flexDirection: 'row' }}>
                                  
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

                                <TouchableOpacity onPress={() => this.navigateToArticleDetail(item, index)} activeOpacity={1}>


                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>


                            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.articleTitle}</Text>
                            </View>

                                <View style={{ paddingTop: 5, paddingBottom: 5,height:50}}>
                                <HTMLView value= {item.articleContent} > </HTMLView>

                                {/* <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                    numberOfLines={3}>
                                    {item.articleContent}
                                </Text> */}
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20 ,backgroundColor:'#ffffff'}}>
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
            this.getFollowArticleList();
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

        this.getFollowArticleList();
    }

    listHeader = () => {
        return (
            <View style={{ height: 100,backgroundColor:'#0084ff', flexDirection: 'row', alignItems: 'center' }}>
            <View>
                <Text style={{color:'white',paddingLeft:20,fontSize:18,fontWeight:'bold'}}>我的专栏</Text>
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