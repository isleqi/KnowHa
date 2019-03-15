import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet, TouchableOpacity, SafeAreaView, TextInput,ToastAndroid,
  View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import Base from '../../utils/Base';
import ScreenUtil from '../../utils/ScreenUtil';
import HTMLView from 'react-native-htmlview';


let baseUrl = Base.baseUrl;
let tempStr = '';
export default class SearchQuestion extends Component {
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
  search2 = async() => {
    let url = baseUrl + '/app/question/search';
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

search = async() => {
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
    ()=>{
        let url = baseUrl + '/app/question/search';
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

listHeader = () => {
        return (
            <View style={{ height: 8, backgroundColor: "#eae9e961" }}></View>
        );
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
      <View style={{backfaceVisibility:'#ffffff'}}>
          <View style={{ paddingLeft: 15, paddingTop: 20, flexDirection: 'row', }}>
              {this.renderTag(tags)}
          </View>

          <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>

                  <TouchableOpacity onPress={() => this.navigateToAnswerList(item)} activeOpacity={1}>
                      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                          <Text style={{ fontWeight: 'bold', fontSize:16 ,}}>{item.quesTitle}</Text>
                      </View>
                  </TouchableOpacity>
                  {answer == null ?
                      <Text style={{ fontSize: 11, color: '#bdbcbce8', paddingTop: 5, paddingBottom: 5 }}>暂无回答</Text>
                      :
                      <TouchableOpacity onPress={()=>this.navigateToAnswerDetail(item)} activeOpacity={1}>
                      <View>
                      <View style={{ paddingTop: 5, paddingBottom: 5, height: 50, backgroundColor: '#ffffff' }}>
                          <HTMLView value={answer.ansContent}> </HTMLView>

                              {/* <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                  numberOfLines={3}>
                                  {answer.ansContent}
                              </Text> */}
                          </View>

                                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20, backgroundColor: '#ffffff' }}>
                              <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{answer.likeNum} 赞同 · </Text>
                              <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>{answer.commentNum} 评论</Text>

                          </View>
                      </View>
                      </TouchableOpacity>
                  }

              </View>

          </View>
          <View style={{ height: 8, backgroundColor: "#f3f3f3" }}></View>
      </View>

  );
}

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row',padding:15}}>
        <View  style={{
        flexDirection: 'row',
        backgroundColor:'#eaeaea',borderRadius:5,flex:1
      ,padding:10
        }}>
      
          <View style={{ flexDirection: 'row',flex:1,alignItems:'center'}}>
            <TextInput placeholder='搜索问题' style={{flex:1,fontSize:12,paddingVertical: 0}} 
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