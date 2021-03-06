import React, { Component } from 'react';
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
import SearchArticle from '../modules/column/SearchArticle';
import AnswerList from '../modules/index/AnswerList';
import AllQuestion from '../modules/index/AllQuestion';
import AnswerListHeader from '../modules/index/AnswerListHeader';
import QuestionByTag from '../modules/index/QuestionByTag';
import AnswerDetail from '../modules/index/AnswerDetail';
import CreateAnswer from '../modules/index/CreateAnswer';
import FollowAnswer from '../modules/usercenter/FollowAnswer';
import FollowQues from '../modules/usercenter/FollowQues';
import MyColumn from '../modules/usercenter/MyColumn';
import MyAnswer from '../modules/usercenter/MyAnswer';
import MyQuestion from '../modules/usercenter/MyQuestion';
import AnsCommentList from '../modules/index/AnsCommentList';
import CommentReplyList from '../modules/index/CommentReplyList';
import FollowUser from '../modules/usercenter/FollowUser';
import FanUser from '../modules/usercenter/FanUser';
import ArticleDetail from '../modules/column/ArticleDetail';
import ArticleCommentList from '../modules/column/ArticleCommentList';
import ArticleCommentReplyList from '../modules/column/CommentReplyList';
import MyWallet from '../modules/usercenter/MyWallet';
import UserHome from '../modules/usercenter/UserHome';
import UpdateAnswer from '../modules/usercenter/UpdateAnswer';
import UpdateArticle from '../modules/usercenter/UpdateArticle';

const AppStack = createStackNavigator({
  Home: HomeScreen,
  UserScreen: UserScreen,
  AskQuestion: AskQuestion,
  CreateArticle: CreateArticle,
  SearchQuestion: SearchQuestion,
  SearchArticle: SearchArticle,
  AnswerList: AnswerList,
  AllQuestion: AllQuestion,
  AnswerListHeader: AnswerListHeader,
  QuestionByTag: QuestionByTag,
  AnswerDetail: AnswerDetail,
  CreateAnswer: CreateAnswer,
  FollowAnswer: FollowAnswer,
  FollowQues: FollowQues,
  MyColumn: MyColumn,
  MyAnswer: MyAnswer,
  MyQuestion: MyQuestion,
  MyWallet: MyWallet,
  AnsCommentList: AnsCommentList,
  CommentReplyList: CommentReplyList,
  FanUser: FanUser,
  FollowUser: FollowUser,
  ArticleDetail: ArticleDetail,
  ArticleCommentList: ArticleCommentList,
  ArticleCommentReplyList: ArticleCommentReplyList,
  UserHome: UserHome,
  UpdateAnswer:UpdateAnswer,
  UpdateArticle:UpdateArticle
});
const AuthStack = createStackNavigator({ SignIn: SignInScreen, Oauth: OauthScreen });
const RegisterStack = createStackNavigator({ Register: RegisterScreen, RegisterDetail: RegisterDetail });
const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Register: RegisterStack

  },
  {
    initialRouteName: 'App',
  }
);


export class RootNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RootStack></RootStack>
    );
  }
}