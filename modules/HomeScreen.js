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
            this
                .props
                .navigation
                .navigate('AnswerList',{item:e});
        });
        DeviceEventEmitter.addListener('navigateToQuestionList', (e) => {
            this
                .props
                .navigation
                .navigate('QuestionByTag',{tag:e});
        });
          DeviceEventEmitter.addListener('navigateToAnswerDetail', (e) => {
            this
                .props
                .navigation
                .navigate('AnswerDetail',{item:e});
        });
        DeviceEventEmitter.addListener('navigateToFollowAnswer', (e) => {
            this
                .props
                .navigation
                .navigate('FollowAnswer');
        });
        DeviceEventEmitter.addListener('navigateToMyQuestion', (e) => {
            this
                .props
                .navigation
                .navigate('MyQuestion');
        });
        DeviceEventEmitter.addListener('navigateToMyAnswer', (e) => {
            this
                .props
                .navigation
                .navigate('MyAnswer');
        });
        DeviceEventEmitter.addListener('navigateToMyColumn', (e) => {
            this
                .props
                .navigation
                .navigate('MyColumn');
        });
        DeviceEventEmitter.addListener('navigateToFollowQues', (e) => {
            this
                .props
                .navigation
                .navigate('FollowQues');
        });
        DeviceEventEmitter.addListener('navigateToFollowUser', (e) => {
            this
                .props
                .navigation
                .navigate('FollowUser');
        });
        DeviceEventEmitter.addListener('navigateToFanUser', (e) => {
            this
                .props
                .navigation
                .navigate('FanUser');
        });
        DeviceEventEmitter.addListener('navigateToArticleDetail', (e) => {
            this
                .props
                .navigation
                .navigate('ArticleDetail',{item:e});
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
