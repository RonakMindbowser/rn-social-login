import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  GoogleSignin,
  type User,
} from '@react-native-google-signin/google-signin';
import imageConstants from './res';
import {
  AccessToken,
  LoginManager,
  Profile,
  Settings,
} from 'react-native-fbsdk-next';

export interface SocialLoginProps {
  /** Web client ID for Google Sign-In configuration */
  webClientId?: string;
  /** iOS client ID for Google Sign-In configuration */
  iosClientId?: string;
  /** Callback function called on successful Google Sign-In */
  onGoogleSignInSuccess?: (userInfo: User) => void;
  /** Callback function called on Google Sign-In error */
  onGoogleSignInError?: (error: any) => void;
  /** Custom styles for the main container */
  mainContainerStyle?: StyleProp<ViewStyle>;
  /** Custom styles for the Google icon wrapper */
  googleIconWrapperStyle?: StyleProp<ViewStyle>;
  /** Whether to sign out of Google before attempting a new sign-in */
  signOutGoogleSignBeforeLogin?: boolean;
  /** Custom React node to render for Google Sign-In button */
  renderCustomGoogleSignIn?: () => JSX.Element | React.ReactNode;

  onInititalizationError?: (error: any) => void;
  renderCustomFacebookSignIn?: () => JSX.Element | React.ReactNode;
  onFacebookSignInError?: (error: any) => void;
  onFacebookSignInSuccess?: (info: FacebookSignInProps) => void;
  facebookIconWrapperStyle?: StyleProp<ViewStyle>;
}

export interface FacebookSignInProps {
  token?: AccessToken | null;
  currentProfile?: Profile | null;
}

export interface SocialLoginHandle {
  /** Initializes Google Sign-In configuration */
  initGoogleSignIn: (config: {
    webClientId?: string;
    iosClientId?: string;
  }) => void;
}

const SocialLogin = forwardRef<SocialLoginHandle, SocialLoginProps>(
  (
    {
      mainContainerStyle,
      googleIconWrapperStyle,
      onGoogleSignInSuccess,
      onGoogleSignInError,
      signOutGoogleSignBeforeLogin = true,
      renderCustomGoogleSignIn,
      onInititalizationError,
      renderCustomFacebookSignIn,
      onFacebookSignInError,
      onFacebookSignInSuccess,
      facebookIconWrapperStyle,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      initGoogleSignIn,
    }));

    const initGoogleSignIn = ({
      webClientId,
      iosClientId,
    }: {
      webClientId?: string;
      iosClientId?: string;
    }) => {
      try {
        GoogleSignin.configure({
          webClientId,
          iosClientId,
          offlineAccess: true,
          accountName: '',
        });
        Settings.initializeSDK();
      } catch (error) {
        onInititalizationError?.(error);
      }
    };

    /**
     * Handles Google Sign-In process, including sign-out if specified,
     * and calls the appropriate success or error callback.
     */
    const handleGoogleSignIn = async () => {
      if (signOutGoogleSignBeforeLogin) {
        await GoogleSignin.signOut();
      }
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        onGoogleSignInSuccess?.(userInfo);
      } catch (error) {
        onGoogleSignInError?.(error);
      }
    };

    const handleFacebookSignIn = async () => {
      LoginManager.logOut();

      try {
        const result = await LoginManager.logInWithPermissions([
          'email',
          'public_profile',
        ]);
        if (result.isCancelled) {
          onFacebookSignInError?.('User cancelled the login process');
          return;
        }
        const token: AccessToken | null =
          await AccessToken.getCurrentAccessToken();
        const currentProfile: Profile | null =
          await Profile.getCurrentProfile();

        onFacebookSignInSuccess?.({
          token,
          currentProfile,
        });
      } catch (error: any) {
        onFacebookSignInError?.(error);
      }
    };

    return (
      <View style={[styles.container, mainContainerStyle]}>
        <TouchableOpacity
          style={googleIconWrapperStyle}
          onPress={handleGoogleSignIn}
        >
          {renderCustomGoogleSignIn ? (
            renderCustomGoogleSignIn()
          ) : (
            <Image
              source={imageConstants.googleIcon}
              style={styles.iconStyle}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={facebookIconWrapperStyle}
          onPress={handleFacebookSignIn}
        >
          {renderCustomFacebookSignIn ? (
            renderCustomFacebookSignIn()
          ) : (
            <Image
              source={imageConstants.facebookIcon}
              style={styles.iconStyle}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

/** Styles for the SocialLogin component */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    justifyContent: 'space-between',
  },
  iconStyle: {
    height: 50,
    width: 50,
  },
});

export default SocialLogin;
