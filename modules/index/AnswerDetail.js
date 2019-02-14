import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';

import HTMLView from 'react-native-htmlview';




export default class AnswerDetail extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        let answerVo= this.props.navigation.state.params.item.answerVo;
        let user=answerVo.user;
        this.state = {
            like: false,
            follow: false,
            user:user,
            answer:answerVo
        };
    

    }

    componentDidMount(){
       
    }

    setLike = () => {
        this.setState({
            like: !this.state.like,
        })

    }

    follow = () => {
        this.setState({
            follow: !this.state.follow,
        })
    }

    commentDetail = () => {

    }


    render() {
        let text = '<p>ddd发生过梵蒂冈梵蒂冈电饭锅电饭锅发鬼地方个</p>';
        let user=this.state.user;
        let answer=this.state.answer;
        let quesTitle= this.props.navigation.state.params.item.quesTitle;
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, backgroundColor: '#ffffff' }}>
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

                <View style={{ height: 2, backgroundColor: '#fffff' }} />



                {/* 问题题目 */}


                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff' }}>
                    <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 20, paddingBottom: 20 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{quesTitle}</Text>
                    </View>
                </View>


                {/* 问题题目-end */}

                <View style={{ height: 10, backgroundColor: '#fffff' }} />




                {/* 回答内容 */}
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                        {/* 回答者信息 */}

                        <View style={{ backgroundColor: '#ffffff', padding: 10, flexDirection: 'row', alignItems: 'center', }}>


                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ alignItems: 'center', paddingRight: 10 }}>
                                    <TouchableOpacity onPress={() => { }} >
                                        <Image source={{uri:user.userIconUrl}}
                                            style={{ width: 30, height: 30, borderRadius: 15 }}>
                                        </Image>

                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 13, }}>{user.userName}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                <TouchableOpacity  >
                                    <View style={{ backgroundColor: "#0084ff", borderRadius: 5, paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 11, color: 'white' }}>
                                            关注 </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>

                        {/* 回答者信息-end */}

                        <View style={{ height: 2, backgroundColor: '#fffff' }} />

                        <HTMLView value={answer.ansContent} style={{ paddingLeft: 15, paddingRight: 15, backgroundColor: '#ffffff' }} > </HTMLView>

                    </ScrollView>
                    <View style={{ height: 50, justifyContent: 'flex-end', backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'row', padding: 20 }}>
                            <TouchableOpacity onPress={() => this.setLike()}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={
                                        this.state.like ?
                                            require('../../resources/index/a_dz.png')
                                            :
                                            require('../../resources/index/dz.png')
                                    } style={{ width: 25, height: 25 }} />
                                    <Text style={{ marginLeft: 10, fontSize: 12, color: 'gray', textAlign: 'center' }}>{answer.likeNum}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.follow()}>
                                    <View>
                                        <Image source={
                                            this.state.follow ?
                                                require('../../resources/index/a_sc.png')
                                                :
                                                require('../../resources/index/sc.png')
                                        } style={{ width: 25, height: 25, marginRight: 20 }} />
                                        <Text style={{ fontSize: 10, color: 'gray' }}>收藏</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.commentDetail()}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Image source={require('../../resources/index/pl.png')} style={{ width: 25, height: 25 }} />
                                        <Text style={{ fontSize: 10, color: 'gray' }}>{answer.commentNum}</Text>
                                    </View>
                                </TouchableOpacity>
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
        // backgroundColor: '#ffffff',
    },

});
const htmlStyles = StyleSheet.create({
   p:{
      
   }

});