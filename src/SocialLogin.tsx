import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Image,
  Platform,
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
import appleAuth, {
  AppleCredentialState,
  type AppleRequestResponse,
} from '@invertase/react-native-apple-authentication';

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
  /** Callback function called on initialization error */
  onInititalizationError?: (error: any) => void;
  /** Custom React node to render for Facebook Sign-In button */
  renderCustomFacebookSignIn?: () => JSX.Element | React.ReactNode;
  /** Callback function called on Facebook Sign-In error */
  onFacebookSignInError?: (error: any) => void;
  /** Callback function called on successful Facebook Sign-In */
  onFacebookSignInSuccess?: (info: FacebookSignInProps) => void;
  /** Custom styles for the Facebook icon wrapper */
  facebookIconWrapperStyle?: StyleProp<ViewStyle>;
  /** Custom styles for the Apple icon wrapper */
  appleIconWrapperStyle?: StyleProp<ViewStyle>;
  /** Custom React node to render for Apple Sign-In button */
  renderCustomAppleSignIn?: () => JSX.Element | React.ReactNode;
  /** Callback function called on Apple Sign-In error */
  onAppleSignInError?: (error: any) => void;
  /** Callback function called on successful Apple Sign-In */
  onAppleSignInSuccess?: (info: AppleSignInProps) => void;
}

export interface FacebookSignInProps {
  token?: AccessToken | null;
  currentProfile?: Profile | null;
}

export interface AppleSignInProps {
  appleAuthRequestResponse?: AppleRequestResponse | null;
  credentialState?: AppleCredentialState | null;
}

export interface SocialLoginHandle {
  /** Initializes Google Sign-In configuration */
  initSocialLogins: (config: {
    webClientId?: string;
    iosClientId?: string;
  }) => void;
}

/**Social Login Component */
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
      appleIconWrapperStyle,
      renderCustomAppleSignIn,
      onAppleSignInError,
      onAppleSignInSuccess,
    },
    ref
  ) => {
    // Expose functions to the parent component via ref
    useImperativeHandle(ref, () => ({
      initSocialLogins,
    }));

    /**
     * Initializes Google Sign-In configuration and Facebook SDK.
     * @param config - Configuration object containing webClientId and iosClientId.
     */
    const initSocialLogins = ({
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

    /**
     * Handles Facebook Sign-In process, including sign-out before login,
     * and calls the appropriate success or error callback.
     */
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

    /**
     * Handles Apple Sign-In process and calls the appropriate success or error callback.
     */
    const handleAppleSignIn = async () => {
      try {
        // Performs login request
        const appleAuthRequestResponse: AppleRequestResponse =
          await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // Note: it appears putting FULL_NAME first is important, see issue #293
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
          });

        const credentialState: AppleCredentialState =
          await appleAuth.getCredentialStateForUser(
            appleAuthRequestResponse.user
          );
        onAppleSignInSuccess?.({
          appleAuthRequestResponse,
          credentialState,
        });
      } catch (error) {
        onAppleSignInError?.(error);
      }
    };

    return (
      <View style={[styles.container, mainContainerStyle]}>
        {/* Google Sign-In Button */}
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

        {/* Facebook Sign-In Button */}
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

        {/* Apple Sign-In Button (only for iOS) */}
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            style={appleIconWrapperStyle}
            onPress={handleAppleSignIn}
          >
            {renderCustomAppleSignIn ? (
              renderCustomAppleSignIn()
            ) : (
              <Image
                source={imageConstants.appleIcon}
                style={styles.iconStyle}
              />
            )}
          </TouchableOpacity>
        ) : null}
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
