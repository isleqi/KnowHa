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



let baseUrl=Base.baseUrl;
export default class FollowUser extends Component {
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
        this.getFollowUserList();
    }

    getFollowUserList = async () => {
        let limit = this.state.limit;
        let page = this.state.page + 1;
        let url = baseUrl+'/app/user/getFollowUsers?' + '&pageNum=' + page + '&pageSize=' + limit;
        console.log(url);
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

    followUser = async(useredId,index) => {
        let url = baseUrl+'/app/user/follow?useredId=' + useredId;
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
           let data=this.state.data;
           data[index].hasFollow=true;
    
            this.setState({
                data:data
            })
    
        })
    
    }
    
    cancelFollowUser =async (useredId,index) => {
      let url = baseUrl+'/app/user/cancelFollow?useredId=' + useredId;
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
      
    
          let data=this.state.data;
          data[index].hasFollow=false;
   
           this.setState({ 
               data:data
           })
    
      })
    
    }
    navigateToUserHome = (item) => {
     
        DeviceEventEmitter.emit('navigateToUserHome', item);
    
}

    renderItem = (data) => {
        let item = data.item;
        let user = item.user;
        let index=data.index;
       
        return (
       

            <View style={{ backgroundColor: '#ffffff', padding: 10, flexDirection: 'row', alignItems: 'center', }}>


                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ alignItems: 'center', paddingRight: 10 }}>
                    <TouchableOpacity onPress={() => this.navigateToUserHome(user.id)} >
                            <Image source={{ uri: user.userIconUrl }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}>
                            </Image>

                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 13, }}>{user.userName}</Text>
                    {
                                item.hasFollow ?
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.cancelFollowUser(user.id,index)} >
                                            <View style={{ backgroundColor: "gray", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                    已关注 </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.followUser(user.id,index)} >
                                            <View style={{ backgroundColor: "#0084ff", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                    关注 </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                            }
                </View>
              
                      
                



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
            this.getFollowUserList();
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

        this.getFollowUserList();
    }

    listHeader = () => {
        return (
            <View style={{ height: 100,backgroundColor:'#0084ff', flexDirection: 'row', alignItems: 'center' }}>
            <View>
                <Text style={{color:'white',paddingLeft:20,fontSize:18,fontWeight:'bold'}}>我关注的人</Text>

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