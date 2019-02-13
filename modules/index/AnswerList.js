import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import AnswerListHeader from './AnswerListHeader';


export default class AnswerList extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            AnswerList: new Array(10),
            quesData: {},
        };

    }

    componentDidMount() {

    }

    getAnswerListById= () => {
        let url = 'http://192.168.1.6:8070/app/question/getAllQuestion?pageNum=1&pageSize=10';

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
                data: data
            })

        })
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




    renderItem = (data) => {
        return (
            <View>
                <View style={{ paddingLeft: 15, paddingTop: 20, flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{ alignItems: 'center', paddingRight: 10 }}>
                        <TouchableOpacity onPress={() => { }} >
                            <Image source={require('../../resources/register/girl.png')}
                                style={{ width: 20, height: 20, borderRadius: 10 }}>
                            </Image>

                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 11, }}>海贼王</Text>

                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>



                        <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                numberOfLines={3}
                            >东方大道过过过过发的森特图打广告广东省第三方的地方大动干戈东方大道风格的是第三范式特特
                                                个非官方个适当方式的方式的大杀四方水电费额额发的所发生的电话
                    </Text>
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>2.7k 赞同 · </Text>
                                <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>300 评论</Text>
                            </View>


                        </View>
                    </View>

                </View>
                <View style={{ height: 8, backgroundColor: "#eae9e961" }}></View>
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
                    ListHeaderComponent={<AnswerListHeader back={this.goBack} data={this.props.navigation.state.params.item} />}
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