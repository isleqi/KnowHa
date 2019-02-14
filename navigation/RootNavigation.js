import React, {Component} from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import AuthLoadingScreen from '../modules/AuthLoadingScreen';
import HomeScreen from '../modules/HomeScreen';
import SignInScreen from '../modules/login/SignInScreen';
import UserScreen from '../modules/usercenter/UserScreen';
import RegisterScreen from '../modules/register/RegisterScreen';
import RegisterDetail from '../modules/register/RegisterDetail';
import AskQuestion from '../modules/index/AskQuestion';
import CreateArticle from '../modules/column/CreateArticle';
import OauthScreen from '../modules/login/OauthScreen';
import SearchQuestion from '../modules/index/SearchQuestion';
import SearchArticle from  '../modules/column/SearchArticle';
import AnswerList from '../modules/index/AnswerList';
import AllQuestion from '../modules/index/AllQuestion';
import AnswerListHeader from  '../modules/index/AnswerListHeader';
import QuestionByTag from '../modules/index/QuestionByTag';
import AnswerDetail from '../modules/index/AnswerDetail';
const AppStack = createStackNavigator({
   Home: HomeScreen,
   UserScreen:UserScreen,
   AskQuestion:AskQuestion,
   CreateArticle:CreateArticle,
   SearchQuestion:SearchQuestion,
   SearchArticle:SearchArticle,
   AnswerList:AnswerList,
   AllQuestion:AllQuestion,
   AnswerListHeader:AnswerListHeader,
   QuestionByTag:QuestionByTag,
   AnswerDetail:AnswerDetail
  });
const AuthStack = createStackNavigator({ SignIn: SignInScreen,Oauth:OauthScreen});
const RegisterStack=createStackNavigator({Register:RegisterScreen,RegisterDetail:RegisterDetail});
const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Register:RegisterStack
  
  },
  {
    initialRouteName: 'App',
  }
);


export class RootNavigation extends Component{
    constructor(props) {
          super(props);
     }
  
    render() {
          return (
            <RootStack></RootStack>
          );
    }
}