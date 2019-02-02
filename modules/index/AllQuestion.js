import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';


export default class AllQuestion extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            data: new Array(10),
        };

    }

    renderItem = (data) => {
        return (
            <View>
                <View style={{ paddingLeft: 15,paddingTop: 20,flexDirection:'row', }}>
                <View style={{backgroundColor:'gray',padding:4,borderRadius:5,marginRight:5}}>
                    <Text style={{ fontSize: 10,color:'white'}}>海贼王</Text>
                </View>
                <View style={{backgroundColor:'gray',padding:4,borderRadius:5}}>
                    <Text style={{ fontSize: 10,color:'white'}}>海王</Text>
                </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, }}>


                        <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>的水电费第三方大单身单身</Text>
                        </View>

                        <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Text style={[{ lineHeight: 17, fontSize: 12 }]}
                                numberOfLines={3}
                            >东方大道过过过过发的森特图打广告广东省第三方的地方大动干戈东方大道风格的是第三范式特特
                                        个非官方个适当方式的方式的大杀四方水电费额额发的所发生的电话
                    </Text>
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 20 }}>
                            <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>2.7k 赞同 · </Text>
                            <Text style={{ fontSize: 11, color: '#bdbcbce8' }}>300 评论</Text>

                        </View>
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