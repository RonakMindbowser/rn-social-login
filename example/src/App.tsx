import type { User } from '@react-native-google-signin/google-signin';
import * as React from 'react';

import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  SocialLogin,
  type FacebookSignInProps,
  type SocialLoginHandle,
  type AppleSignInProps,
} from 'rn-social-login';

export default function App() {
  // Create a ref for the SocialLogin component
  const socialLoginRef = React.useRef<SocialLoginHandle>(null);

  // Initialize social logins on component mount
  React.useEffect(() => {
    socialLoginRef?.current?.initSocialLogins({
      iosClientId:
        '46438059374-6pfp5k6975ese4dte807gdu8qf69u8l1.apps.googleusercontent.com',
      webClientId:
        '46438059374-o5a29tpfts3v6td5uc7nb5alqdman242.apps.googleusercontent.com',
    });
  }, []);

  /**
   * Callback function for successful Google sign-in.
   * @param userInfo - Information about the signed-in user.
   */
  const onGoogleSuccess = (userInfo: User) => {
    console.log('Google login success', userInfo);
    Alert.alert('Social Login', 'Google login success.');
  };

  /**
   * Callback function for Google sign-in error.
   * @param error - Error object.
   */
  const onGoogleError = (error: any) => {
    console.log('Google login error', error);
  };

  /**
   * Callback function for successful Facebook sign-in.
   * @param token - Access token from Facebook.
   * @param currentProfile - Current user profile from Facebook.
   */
  const onFacebookSuccess = ({
    token,
    currentProfile,
  }: FacebookSignInProps) => {
    console.log('Facebook login token', token);
    console.log('Facebook login profile', currentProfile);
    Alert.alert('Social Login', 'Facebook login success.');
  };

  /**
   * Callback function for Facebook sign-in error.
   * @param error - Error object.
   */
  const onFacebookError = (error: any) => {
    console.log('Facebook login error', error);
  };

  /**
   * Callback function for successful Apple sign-in.
   * @param appleAuthRequestResponse - Response from Apple authentication request.
   * @param credentialState - State of the Apple credential.
   */
  const onAppleSuccess = ({
    appleAuthRequestResponse,
    credentialState,
  }: AppleSignInProps) => {
    console.log(
      'Apple login appleAuthRequestResponse',
      appleAuthRequestResponse
    );
    console.log('Apple login credentialState', credentialState);
    Alert.alert('Social Login', 'Apple login success.');
  };

  /**
   * Callback function for Apple sign-in error.
   * @param error - Error object.
   */
  const onAppleError = (error: any) => {
    console.log('Apple login error', error);
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
        onAppleSignInSuccess={onAppleSuccess}
        onAppleSignInError={onAppleError}
      />
    </View>
  );
}

/** Styles for the App component */
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
