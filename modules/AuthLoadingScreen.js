import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,Text
} from 'react-native';

export default class AuthLoadingScreen extends Component {
    static navigationOptions = {
      title: '',
      header:null
    };
    
    constructor(props) {
      super(props);
      this._bootstrapAsync();
    }
  
    //获取本地token，然后导航到合适的地方
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };
  
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
          <Text>智野软件</Text>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    }
});
  