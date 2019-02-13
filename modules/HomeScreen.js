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
        DeviceEventEmitter.addListener('navigateToAuth', (e) => {
            this
                .props
                .navigation
                .navigate('Auth');
        });
        DeviceEventEmitter.addListener('navigateToSearchQuestion', (e) => {
            this
                .props
                .navigation
                .navigate('SearchQuestion');
        });
        DeviceEventEmitter.addListener('navigateToCreateArticle', (e) => {
            this
            .props
            .navigation
            .navigate('CreateArticle');
        });
        DeviceEventEmitter.addListener('navigateToSearchArticle', (e) => {
            this
                .props
                .navigation
                .navigate('SearchArticle');
        });
        DeviceEventEmitter.addListener('navigateToAnswerList', (e) => {
            console.log(e);
            this
                .props
                .navigation
                .navigate('AnswerList',{item:e});
        });
        DeviceEventEmitter.addListener('navigateToQuestionList', (e) => {
            console.log(e);
            this
                .props
                .navigation
                .navigate('QuestionByTag',{tag:e});
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
