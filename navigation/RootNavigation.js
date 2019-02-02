import React, {Component} from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import AuthLoadingScreen from '../modules/AuthLoadingScreen';
import HomeScreen from '../modules/HomeScreen';
import SignInScreen from '../modules/login/SignInScreen';
import UserScreen from '../modules/usercenter/UserScreen';
import RegisterScreen from '../modules/register/RegisterScreen';
import RegisterDetail from '../modules/register/RegisterDetail';
import AskQuestion from '../modules/index/AskQuestion'

const AppStack = createStackNavigator({ Home: HomeScreen,UserScreen:UserScreen,AskQuestion:AskQuestion});
const AuthStack = createStackNavigator({ SignIn: SignInScreen });
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

/**
 * 黄记新（Tony） 2018.07.20
 * 该类是根类用于导航。
 */
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