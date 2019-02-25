import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import AnswerListHeader from './AnswerListHeader';


export default class QuestionByTag extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            AnswerList: [],
            tagData: {},
        };

    }

    componentDidMount() {
        this.getQuestionListByTagId();
    }

    getQuestionListByTagId = () => {
        let tagId = this.props.navigation.state.params.tag.id;
        let url = 'http://192.168.1.100:8070/app/question/getByTag?pageNum=1&pageSize=10&tagId=' + tagId;

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

            let data = responseData.data.list;
            this.setState({
                AnswerList: data
            })

        })
    }


    goBack = () => {
        this.props.navigation.goBack();
    }






    renderItem = (data) => {
        let item = data.item;
        let answer = item.answerVo;
        return (
            <View>
                <View style={{ height: 8, backgroundColor: "#eae9e961" }}></View>


                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>

                        <TouchableOpacity onPress={() => this.navigateToAnswerList(item)}>
                            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.quesTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        {answer==null? 
                            <Text style={{fontSize:11,color:'#bdbcbce8', paddingTop: 5, paddingBottom: 5 }}>暂无回答</Text>
                        :
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
                    }

                       
                    </View>

                </View>
            </View>

        );
    }

    renderHeader=()=>{
        let tag= this.props.navigation.state.params.tag;
        return(
            <View>
            <View style={{alignItems:'center',justifyContent:'center',padding:20}}>
                  <View style={{ backgroundColor: '#38b2cc', padding: 10, borderRadius: 5, marginRight: 5 }}>
                    <Text style={{ fontSize: 18, color: 'white' }}>{tag.tagName}</Text>
                </View >
                <Text style={{ fontSize: 12, color: '#8e8d8d',paddingTop:10}}>{tag.num} 人关注</Text>
                </View>
               
                </View>
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
                    data={this.state.AnswerList}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.1}
                // ListFooterComponent={this.renderFooter}
                  ListHeaderComponent={this.renderHeader}
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