import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ToastAndroid, Modal,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';

import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';



let baseUrl = Base.baseUrl;
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
            showFollowList: false,
            isChecked: false,   //是否被选中
            dataSource: [],  //列表数据源
            selectMap: new Map(), // 被选中的item集合
            isAllSelect: false,  //是否被全选
            isadmin:false  //是否为管理员
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

    navigateToCreateaAnswer = (quesId) => {
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

    isAdmin = () => {
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
                isadmin:data
            })

        })
    }


    hasFollowQues = () => {
        let quesId = this.state.quesData.id;
        let url = baseUrl+'/app/question/hasfollow?quesId=' + quesId;
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
        let url = baseUrl+'/app/question/follow?quesId=' + quesId;
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
        let url = baseUrl+'/app/question/cancelFollow?quesId=' + quesId;
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

    toInvitation=()=>{
       
        let quesId = this.state.quesData.id;
        let map=this.state.selectMap;
        let userIds=[];
        let str=""
        for (var x of map) { // 遍历Map
         str=str+'&userIds[]='+x[1].id
           //userIds.push(x[1].id);
        }
        let url = baseUrl+'/app/question/invitation?quesId=' + quesId+str;
        console.log(url)
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
           ToastAndroid.show("邀请成功",ToastAndroid.SHORT);
           this.setState({
               showFollowList:false
           })
        })
    }


    renderFollowUserList = () => {
        return (
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 30, justifyContent: "center" }}>
             
                <View style={{ backgroundColor: '#ffffff', padding: 10, borderRadius: 10, flex: 1 }}>
                <View style={{ backgroundColor: '#ffffff',alignItems:'center',paddingBottom:10} }>
           <Text style={{fontWeight:'bold'}}>我关注的人</Text>
           </View>
                    <FlatList keyExtractor={(item, index) => index.toString()}
                        data={this.state.dataSource}
                        renderItem={this.renderFollowUserItem}
                        extraData={this.state}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={1}
                        ListFooterComponent={this.listFooterComponent}

                    />

                    <TouchableOpacity onPress={() => this.toInvitation()} >
                        <View style={{ backgroundColor: "#0084ff", borderRadius: 5,marginTop: 10, paddingBottom: 10, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                            <Text style={{ textAlign: 'center', fontSize: 15, color: 'white' }}>
                                邀请 </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>{
                         this.setState({
                            showFollowList:false
                        }) 
                    }}
                    >
                        <View style={{ backgroundColor: "gray", borderRadius: 5,marginTop:10, paddingBottom: 10, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                            <Text style={{ textAlign: 'center', fontSize: 15, color: 'white' }}>
                                取消 </Text>
                        </View>
                    </TouchableOpacity>
                </View>


            </View>
        );

    }

    renderFollowUserItem = (data) => {

        let item = data.item;
        let user = item.user;
        let index = data.index;
        let map = this.state.selectMap;
        let isChecked = map.has(parseInt(index));

        return (
            <View style={{ backgroundColor: '#ffffff', padding: 10, flexDirection: 'row', }}>


                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ alignItems: 'center', paddingRight: 10 }}>
                        <TouchableOpacity >
                            <Image source={{ uri: user.userIconUrl }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 13, }}>{user.userName}</Text>
                </View>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }} >
                    {
                        <TouchableOpacity onPress={
                            () => this.selectItem(parseInt(index), user, isChecked)}>

                            <Image source={isChecked ? require("../../resources/register/activity.png") :

                                require("../../resources/register/noActivity.png")}
                                style={{ width: ScreenUtil.scaleSize(20), height: ScreenUtil.scaleSize(20), justifyContent: 'center', marginRight: ScreenUtil.scaleSize(10) }} />

                        </TouchableOpacity>

                    }
                </View>


            </View>
        )
    }


    selectItem = (rowId, item, isChecked) => {
        this.setState({ isChecked: !isChecked }, () => {
            let map = this.state.selectMap;
            if (isChecked) {
                map.delete(rowId, item) // 再次点击的时候,将map对应的key,value删除
            } else {
                //console.log(rowId);
                map.set(rowId, item) // 勾选的时候,重置一下map的key和value
            }
            this.setState({ selectMap: map });  //更新选中集合
        });
    }

    allSelect = (isChecked) => {
        this.setState({
            isAllSelect: !isChecked
        });
        if (isChecked) { // 如果已经勾选了,则取消选中

            selectMap = new Map();
            this.setState({ selectMap: selectMap })
        } else { // 没有勾选的, 全部勾选
            let newMap = new Map();
            for (let key = 0; key < this.state.data.length; key++) {
                let value = this.state.data[key]; // 拿到数组的collectItem
                newMap.set(key, value) // 第一个key, 第二个是value
            }
            this.setState({ selectMap: newMap });
            // console.log(this.state.selectMap);
        }

    }


    invitation = () => {
        this.setState({
            showFollowList: true
        });
        this.getFollowUserList();
    }

    getFollowUserList = async () => {

        let url = baseUrl + '/app/user/getFollowUsers?' + '&pageNum=' + 1 + '&pageSize=' + 100000;

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

            this.setState({
                dataSource: list,

            })

        })
    }




    render() {
        let quesData = this.state.quesData;
        let num=this.state.quesData.answerNum;
        return (
            <View style={styles.container}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showFollowList}
                    onRequestClose={() => { }}
                >
                    {
                        this.renderFollowUserList()
                    }

                </Modal>
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
                                <TouchableOpacity onPress={() => this.invitation()} style={{ flex: 1 }} >
                                    <View style={{ flex: 1, borderRightWidth: 1, borderTopWidth: 1, borderColor: '#e8e8e7', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                        <Image source={require("../../resources/index/yq.png")} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={{ fontSize: 13, color: '#949491' }}>邀请回答</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.navigateToCreateaAnswer(quesData.id)} style={{ flex: 1 }} >
                                    <View style={{ flex: 1, borderTopWidth: 1, borderColor: '#e8e8e7', justifyContent: 'center', flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                                        <Image source={require("../../resources/index/tw.png")} style={{ height: 15, width: 15, marginRight: 5, opacity: 0.5 }} />
                                        <Text style={{ fontSize: 13, color: '#949491' }}>写回答</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', backgroundColor: '#eae9e961' }}>
                                <Text style={{ fontSize: 10, color: '#949491', paddingLeft: 20, paddingRight: 20, paddingBottom: 10, paddingTop: 10 }}>{num} 个回答</Text>
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