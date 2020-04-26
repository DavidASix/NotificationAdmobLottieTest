import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { AdMobBanner } from 'react-native-admob'

class App extends React.Component {
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ borderWidth: 5, borderColor: 'green', flex: 1 }}>
          <View style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%' }}>
            <Text>
              Lottie + AdMob + Noti Test
            </Text>

            <View style={{ width: 200, height: 200, borderWidth: 1, borderColor: 'red' }}>
              <LottieView source={require('./images/doggieTrot.json')} autoPlay loop />
            </View>

            <AdMobBanner
              adSize='banner'
              adUnitID='ca-app-pub-3940256099942544/6300978111'
              testDevices={[AdMobBanner.simulatorId]}
              onDidFailToReceiveAdWithError={() => console.log('no ad')}
              style={{ position: 'absolute', bottom: 0 }}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
};

export default App;
