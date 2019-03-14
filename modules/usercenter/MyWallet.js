import React, { Component } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid, Modal,
    View, Button, Text, DeviceEventEmitter, TouchableNativeFeedback, Image, ScrollView, RefreshControl, FlatList, Dimensions
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import Base from '../../utils/Base';
import QRCode from 'react-native-qrcode';


let baseUrl = Base.baseUrl;
export default class MyWallet extends Component {
    static navigationOptions = {
        header: null
    };



    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            showCode: false
        };

    }

    componentDidMount() {
        this.getMyValue();
    }

    getMyValue = async () => {
        let url = baseUrl + '/app/user/getMyValue';
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
            this.setState({
                value: data.value
            })

        }
        )

    }


    payForValue = async (price, orderId) => {
        let url = baseUrl + '/app/user/payForValue';
        let token = await AsyncStorage.getItem("userToken");
        let formData = new FormData();
        formData.append("price", price);
        formData.append("orderId", orderId);
        fetch(url, {
            method: 'POST',
            headers: {
                "token": token,
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


        }
        )
    }

    pay = (price) => {
        let url = 'http://120.78.142.80/myPay/pay_api';

        let appId = 'XNVrrgVgVcg8EB92E001BC00C5E85DC0';
        let payTo = 'alipay_any';
        let date = new Date();
        let playerId = '' + date.getTime();
        let money = price;

        var details = {
            'appId': appId,
            'payTo': payTo,
            'playerId': playerId,
            "money": money
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody,

        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
            let data = responseData;

            if (data.code == 200) {
                let orderInfo = data.orderInfo;
                let orderId = orderInfo.orderId;
                this.payForValue(price, orderId);
                let url = 'http://' + orderInfo.qrcodeURL;
                this.setState({
                    codeUrl: url,
                    showCode: true
                })
            } else {
                ToastAndroid.show("创建订单失败", ToastAndroid.SHORT);
            }

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
    close = () => {
        this.setState({
            showCode: !this.state.showCode
        })
    }




    render() {


        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                        colors={['rgb(217, 51, 58)']}
                    />
                }
            >
                <View style={styles.container}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.showCode}
                        onRequestClose={() => { }}
                    >

                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems:'center' }}>

                            <View style={{ backgroundColor: '#ffffff',width:250, alignItems:'center',padding:10,borderRadius:20}}>
                            <Text style={{paddingBottom:10}}>请使用支付宝</Text>

                                    <QRCode
                                        value={this.state.codeUrl}
                                        size={200}
                                        bgColor='purple'
                                        fgColor='white' />

                                    <TouchableOpacity onPress={() => this.close()}>
                                        <Text style={{paddingTop:10}}>关闭</Text>
                                    </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>

                    <View style={{ height: 100, marginBottom: 20, backgroundColor: '#0084ff', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'white', paddingLeft: 20, fontSize: 18, fontWeight: 'bold' }}>我的积分</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={{ color: 'white', paddingRight: 20, fontSize: 50, fontWeight: 'bold' }}>{this.state.value}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1 }} >
                        <TouchableOpacity onPress={() => this.pay(1)}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 15 }}>
                                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 20 }}>10 积分</Text>
                                    <View style={{ alignContent: 'flex-end', backgroundColor: 'red', padding: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 5, marginRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'white' }}>￥1</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.pay(1)}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 15 }}>
                                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 20 }}>20 积分</Text>
                                    <View style={{ alignContent: 'flex-end', backgroundColor: 'red', padding: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 5, marginRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'white' }}>￥2</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.pay(1)}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 15 }}>
                                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 20 }}>40 积分</Text>
                                    <View style={{ alignContent: 'flex-end', backgroundColor: 'red', padding: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 5, marginRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'white' }}>￥4</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.pay(1)}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 15 }}>
                                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 20 }}>80 积分</Text>
                                    <View style={{ alignContent: 'flex-end', backgroundColor: 'red', padding: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 5, marginRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'white' }}>￥8</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.pay(1)}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 15 }}>
                                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 20 }}>200 积分</Text>
                                    <View style={{ alignContent: 'flex-end', backgroundColor: 'red', padding: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 5, marginRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'white' }}>￥20</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={{ height: 150, padding: 15 }} >
                        <Text style={{ color: 'gray' }} >温馨提示：</Text>
                        <Text style={{ color: 'gray' }}>1：扫描生成的二维码进行付款，付款成功后请刷新该页面</Text>
                        <Text style={{ color: 'gray' }}>2：充值金额请严格按照标价写，输错充值将会失败，费用不给于退换</Text>
                        <Text style={{ color: 'gray' }}>3：充值遇到其他问题请联系1595341949@qq.com</Text>

                    </View>


                </View>
            </ScrollView>


        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },

});