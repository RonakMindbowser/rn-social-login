import type { User } from '@react-native-google-signin/google-signin';
import * as React from 'react';

import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  SocialLogin,
  type FacebookSignInProps,
  type SocialLoginHandle,
} from 'rn-social-login';

export default function App() {
  const socialLoginRef = React.useRef<SocialLoginHandle>(null);

  React.useEffect(() => {
    socialLoginRef?.current?.initGoogleSignIn({
      iosClientId:
        '46438059374-6pfp5k6975ese4dte807gdu8qf69u8l1.apps.googleusercontent.com',
      webClientId:
        '46438059374-o5a29tpfts3v6td5uc7nb5alqdman242.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleSuccess = (userInfo: User) => {
    console.log('Google login success', userInfo);
    Alert.alert('Social Login', 'Google login success.');
  };

  const onGoogleError = (error: any) => {
    console.log('Google login error', error);
  };

  const onFacebookSuccess = ({
    token,
    currentProfile,
  }: FacebookSignInProps) => {
    console.log('Facebook login token', token);
    console.log('Facebook login profile', currentProfile);
    Alert.alert('Social Login', 'Facebook login success.');
  };

  const onFacebookError = (error: any) => {
    console.log('Facebook login error', error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Login With'}</Text>
      <SocialLogin
        ref={socialLoginRef}
        onGoogleSignInSuccess={onGoogleSuccess}
        onGoogleSignInError={onGoogleError}
        signOutGoogleSignBeforeLogin
        onFacebookSignInSuccess={onFacebookSuccess}
        onFacebookSignInError={onFacebookError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontWeight: '700',
  },
});
