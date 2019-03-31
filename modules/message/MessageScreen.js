import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import moment from 'moment';
import Base from '../../utils/Base';


let baseUrl = Base.baseUrl;
export default class MessageScreen extends Component {
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
      edit:false
    };

  }

  componentDidMount() {
    this.getNotifyList();
  }

  getNotifyList = async () => {
    let limit = this.state.limit;
    let page = this.state.page + 1;
    let url = baseUrl + '/app/remind/get?' + 'pageNum=' + page + '&pageSize=' + limit;;
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
      let data = responseData.data;
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


    }
    )

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
      this.getNotifyList();
      this.setState({ isRefreshing: false });
    });
  }


  onRefresh_ = () => {

    this.state.data=[];
    this.state.page=0;
    this.state.totalPage=0;
    this.state.showFoot=0;

    

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
    this.getNotifyList();


  }

  updateHadRead=async(notifyId,index)=>{
    let data=this.state.data;
    data[index].hasRead=1;
    this.setState({
      data:data
    });
    let token = await AsyncStorage.getItem("userToken");
    let url = baseUrl + '/app/remind/hadRead?notifyId='+notifyId;
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
    })


  }

  navigateToAnswerDetail = (item) => {
   
    let data={
      answerVo:item,
      quesTitle:item.ques.quesTitle

    }
     DeviceEventEmitter.emit('navigateToAnswerDetail', data);
  

  }
  navigateToAnswerList = (item) => {
   
    DeviceEventEmitter.emit('navigateToAnswerList', item);
   
  }
  navigateToArticleDetail = (item) => {

    let data = {
      item: item
    };
    if(item.type==1)
    ToastAndroid.show("该文章为付费文章，请移步专栏区查看",ToastAndroid.SHORT);
    else
    DeviceEventEmitter.emit('navigateToArticleDetail', data);

  }

  navigateToArticleComment=(item)=>{
    DeviceEventEmitter.emit('navigateToArticleComment', item);
  }

  navigateToAnswerComment=(item)=>{
    DeviceEventEmitter.emit('navigateToAnswerComment', item);
  }



  renderTarget(targetType, item,index) {
    let target = item.target;
    let date = moment(item.createTime).format('YYYY-MM-DD');
    

    switch (targetType) {
      case 1:
        return (
          <TouchableOpacity onPress={() => { this.navigateToAnswerDetail(target); this.updateHadRead(item.id,index) }} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ fontSize: 16 }} >{item.type} </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', width: 150 }} numberOfLines={1} >{target.ques.quesTitle}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', flex: 1, paddingTop: 10 }} >
              <Text style={{ fontSize: 12, color: 'gray' }}>{date}</Text>

            </View>
          </TouchableOpacity>
        );
      case 2:
        return (
          <TouchableOpacity onPress={() => { this.navigateToAnswerList(target.ques); this.updateHadRead(item.id,index) }} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ fontSize: 16 }} >{item.type} </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', width: 150 }} numberOfLines={1}>{target.ques.quesTitle}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', flex: 1, paddingTop: 10 }} >
              <Text style={{ fontSize: 12, color: 'gray' }}>{date}</Text>

            </View>
          </TouchableOpacity>
        );
      case 3:
        return (
          <TouchableOpacity onPress={() => {this.navigateToArticleDetail(target); this.updateHadRead(item.id,index)}} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ fontSize: 16 }} >{item.type} </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', width: 150 }} numberOfLines={1}   >{target.articleTitle}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', flex: 1, paddingTop: 10 }} >
              <Text style={{ fontSize: 12, color: 'gray' }}>{date}</Text>

            </View>
          </TouchableOpacity>
        );
      case 4:
        return (
          <TouchableOpacity onPress={() => {this.navigateToAnswerComment(target) ; this.updateHadRead(item.id,index) }} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ fontSize: 16,width:150 }} numberOfLines={1}>{item.type}了你: {item.content}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', flex: 1, paddingTop: 10 }} >
              <Text style={{ fontSize: 12, color: 'gray' }}>{date}</Text>

            </View>
          </TouchableOpacity>
        );
      case 5:
        return (
          <TouchableOpacity onPress={() => {this.navigateToArticleComment(target) ; this.updateHadRead(item.id,index)}} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ fontSize: 16 ,width:150}} numberOfLines={1}>{item.type}了你: {item.content}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', flex: 1, paddingTop: 10 }} >
              <Text style={{ fontSize: 12, color: 'gray' }}>{date}</Text>

            </View>
          </TouchableOpacity>
        );
        case 6:
        return (
          <TouchableOpacity onPress={() => { this.navigateToAnswerList(target); this.updateHadRead(item.id,index) }} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ fontSize: 16 }} >{item.type} </Text>
              <Text style={{ fontSize: 16 }} >你回答 </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', width: 150 }} numberOfLines={1}>{target.quesTitle}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', flex: 1, paddingTop: 10 }} >
              <Text style={{ fontSize: 12, color: 'gray' }}>{date}</Text>

            </View>
          </TouchableOpacity>
        );
    }
  }


  navigateToUserHome = (item) => {
     
    DeviceEventEmitter.emit('navigateToUserHome', item);

}


  renderItem = (data) => {
    let item = data.item;
    let sendUser = item.sendUser;
    let target = item.target;
    let targetType = item.targetType;
    let receiveUser = target == null ? null : target.user;
    let index=data.index;
    let Bcolor = item.hasRead == 0 ? '#d3eff1' : "#ffffff";

    if(target==null)
    return;
    return (
      <View>


        <View style={{ flexDirection: 'row', backgroundColor: Bcolor }}>

          <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, flexDirection: 'row' }}>

            <View style={{ flex: 0.2, paddingRight: 10 }}>
            <TouchableOpacity onPress={() => this.navigateToUserHome(sendUser.id)} >
                <Image source={{ uri: sendUser.userIconUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}>
                </Image>

              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>

              <Text style={{ fontSize: 16, }}>{sendUser.userName} </Text>
              {
               
                this.renderTarget(targetType, item,index)
              }


            </View>


          </View>



        </View>
        <View style={{ height: 1, backgroundColor: "#eae9e961" }}></View>

      </View>


    );
  }

  setAllRead=async()=>{
    let token = await AsyncStorage.getItem("userToken");
    let url = baseUrl + '/app/remind/hadReadAll';
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
      ToastAndroid.show("标记成功", ToastAndroid.SHORT);

    })
  }

  showNotRead=async()=>{
    let limit = this.state.limit;
    let page = this.state.page + 1;
    let url = baseUrl + '/app/remind/getNotReadAll?' + 'pageNum=' + page + '&pageSize=' + limit;;
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
      let data = responseData.data;
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


    }
    )


  }

  clearAll=async()=>{
    let token = await AsyncStorage.getItem("userToken");
    let url = baseUrl + '/app/remind/clearAll';
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
      ToastAndroid.show("清空成功", ToastAndroid.SHORT);
         this.setState({
           data:[]
         })
    })



  }



  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, padding: 15, fontWeight: 'bold' }} >消息</Text>
        <View style={{ height: 3, backgroundColor: "#eae9e961" }}></View>

        <View style={{flexDirection:"row",paddingTop:10,paddingBottom:10}}>
        {
                        this.state.edit ?
                            <View style={{ flex: 1, justifyContent: 'flex-end',alignItems:"center",paddingLeft:20, paddingRight: 20, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.setAllRead()} >
                                        <View style={{ backgroundColor: "#0084ff",marginRight:10, borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                全部已读 </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {this.onRefresh_();this.showNotRead()}} >
                                        <View style={{ backgroundColor: "gray",marginRight:10, borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                显示未读 </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.clearAll()} >
                                        <View style={{ backgroundColor: "red",marginRight:20, borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                                清空 </Text>
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

                  <View style={{ height: 3, backgroundColor: "#eae9e961" }}></View>


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