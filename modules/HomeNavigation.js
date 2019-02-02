import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import IndexScreen from './index/IndexScreen';
import UserScreen from './usercenter/UserScreen';
import MessageScreen from './message/MessageScreen';
import ColumnScreen from './column/ColumnScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const RouteConfigs = {
    Index: {
        screen: IndexScreen,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarPosition: 'bottom',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Icon size={24} name='home' color={tintColor} />
            }
        }
    }, Column: {
        screen: ColumnScreen,
        navigationOptions: {
            tabBarLabel: '专栏',
            tabBarPosition: 'bottom',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Icon size={24} name='list' color={tintColor} />
            }
        }
    }, Message: {
        screen: MessageScreen,
        navigationOptions: {
            tabBarLabel: '通知',
            tabBarPosition: 'bottom',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Icon size={24} name='book' color={tintColor} />
            }
        }
    }, User: {
        screen: UserScreen,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarPosition: 'bottom',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Icon size={24} name='user' color={tintColor} />
            }
        }
    },
};

const BottomTabNavigatorConfig = {
    animationEnabled: true,//是否可以滑动切换
    swipeEnabled: true,//切换是否有动画
    animationEnabled: true,//进入App的首页面
    initialRouteName: 'Index',
    tabBarPosition: 'bottom',
    lazy: true,
    backBehavior: 'none',
    tabBarOptions: {
        showLabel: true,
        activeTintColor: '#0084ff',
        activeBackgroundColor: '#ffffff',
        inactiveTintColor: 'gray',
        inactiveBackgroundColor: '#ffffff',
        labelStyle: {
            fontSize: 12,
        },
        tabStyle: {
            // borderTopWidth:1,
            borderTopColor: '#0084ff'
        }
    }
}
const MainNavigator = createBottomTabNavigator(
    RouteConfigs, BottomTabNavigatorConfig);

export default class HomeNavigation extends React.Component {
    render() {
        return (
          <MainNavigator></MainNavigator>
        );
    }
}