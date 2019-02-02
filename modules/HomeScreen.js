import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Button,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import HomeNavigation from './HomeNavigation';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        DeviceEventEmitter.addListener('navigateAskQuestion', (e) => {
            this
                .props
                .navigation
                .navigate('AskQuestion');
        });
    }



    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this
            .props
            .navigation
            .navigate('Auth');
    };

    render() {

        return (

            <HomeNavigation></HomeNavigation>
        );
    }
}
