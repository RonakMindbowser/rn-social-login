# rn-social-signin

Apple, Google, Facebook Login in One SDK

## Installation

```sh
npm install rn-social-login react-native-fbsdk-next @invertase/react-native-apple-authentication @react-native-google-signin/google-signin
```

or

```sh
yarn add rn-social-login react-native-fbsdk-next @invertase/react-native-apple-authentication @react-native-google-signin/google-signin
```

## Pods Installation

```sh
cd ios && pod install && cd ..
```

## Prerequisites to using this library

### For Google Sign In Configuration

### For Android :

Download the configuration file (google-services.json) from Firebase into your project and add in android/app directory.

Update android/build.gradle with

```sh
buildscript {
    ext {
        buildToolsVersion = "a.b.c"
        minSdkVersion = x
        compileSdkVersion = y
        targetSdkVersion = z
        googlePlayServicesAuthVersion = "20.7.0" // <--- use this version or newer
    }
// ...
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0' // <--- use this version or newer
    }
}
```

Update android/app/build.gradle with

```sh
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply plugin: 'com.google.gms.google-services'
```

### For iOS :

Download the configuration file (GoogleService-Info.plist) from Firebase into your project and add in ios/<app_name> directory.

Xcode configuration:

Configure URL types in the Info panel (see screenshot)
add a URL with scheme set to your REVERSED_CLIENT_ID (found inside GoogleService-Info.plist or Google Cloud console)

![Xcode console](images/GoogleSignInSampleImage-1.png)

### For Facebook Sign In Configuration

### For Android :

Open the file Gradle Scripts | build.gradle (Project: <your_project>) and add the following:

```sh
mavenCentral()
```

Open the file Gradle Scripts | build.gradle (Module: app) and add the following to the dependencies section:

```sh
implementation 'com.facebook.android:facebook-android-sdk:latest.release'
```

Open the /app/res/values/strings.xml file in your app project.
Add string elements with the names facebook_app_id and facebook_client_token, and set the values to your App ID and Client Token. For example, if your app ID is 1234 and your client token is 56789 your code looks like the following:

```sh
<string name="facebook_app_id">1234</string>
<string name="facebook_client_token">56789</string>
```

Open the /app/manifests/AndroidManifest.xml file in your app project. Add meta-data elements to the application element for your app ID and client token:

```sh
<application android:label="@string/app_name" ...>
    ...
    <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
    <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
    ...
</application>
```

Add a uses-permission element to the manifest after the application element:

```sh
<uses-permission android:name="android.permission.INTERNET"/>
```

Create a Release Key Hash: You need this key hash for android which you need to add in facebook developer console.

```sh
keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | openssl sha1 -binary | openssl base64
```

### For iOS :

To integrate Facebook into your app, follow these steps to modify your `Info.plist` file:

- **Open Info.plist:**

  - Right-click `Info.plist`, and choose `Open As ▸ Source Code`.

- **Add the following XML snippet into the body of your file (inside `<dict>...</dict>`):**

  ```xml
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>fbAPP-ID</string>
      </array>
    </dict>
  </array>
  <key>FacebookAppID</key>
  <string>APP-ID</string>
  <key>FacebookClientToken</key>
  <string>CLIENT-TOKEN</string>
  <key>FacebookDisplayName</key>
  <string>APP-NAME</string>
  ```

- **Replace the placeholders with your actual values:**

  - In `<array><string>` under the key `CFBundleURLSchemes`, replace `APP-ID` with your App ID.
  - In `<string>` under the key `FacebookAppID`, replace `APP-ID` with your App ID.
  - In `<string>` under the key `FacebookClientToken`, replace `CLIENT-TOKEN` with the value found under **Settings > Advanced > Client Token** in your App Dashboard.
  - In `<string>` under the key `FacebookDisplayName`, replace `APP-NAME` with the name of your app.

- **Add the following snippet to use Facebook dialogs (e.g., Login, Share, App Invites) that can perform an app switch to Facebook apps:**
  ```xml
  <key>LSApplicationQueriesSchemes</key>
  <array>
    <string>fbapi</string>
    <string>fb-messenger-share-api</string>
  </array>
  ```

### Example of Complete Info.plist Addition

Here’s an example of how the `Info.plist` will look with the Facebook integration snippets added:

```xml
<dict>
  ...
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>fb123456789</string> <!-- Replace with your App ID -->
      </array>
    </dict>
  </array>
  <key>FacebookAppID</key>
  <string>123456789</string> <!-- Replace with your App ID -->
  <key>FacebookClientToken</key>
  <string>abcd1234efgh5678ijkl</string> <!-- Replace with your Client Token -->
  <key>FacebookDisplayName</key>
  <string>MyAppName</string> <!-- Replace with your App Name -->
  <key>LSApplicationQueriesSchemes</key>
  <array>
    <string>fbapi</string>
    <string>fb-messenger-share-api</string>
  </array>
  ...
</dict>
```

### For Apple Sign In Configuration

We are using appple sign in iOS platform only.
You need to do some configuration on iOS side.You can follow this [Initial Development Environment Setup
](https://github.com/invertase/react-native-apple-authentication/blob/main/docs/INITIAL_SETUP.md)

### Update AppDelegate.m for all social logins

- Add

```sh
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <React/RCTLinkingManager.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <GoogleSignIn/GoogleSignIn.h>
```

- Inside `didFinishLaunchingWithOptions`, add the following:

```sh
// Initialize Facebook SDK
   [[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];
```

- Add this below code in AppDelegate.m for linking process.

```sh
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // Handle URL for Google Sign-In
  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  // Handle URL for React Native Linking
  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }

  //  Handle URL for Facebook Sign-In
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  return NO;
}
```

## Usage

```sh
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
      iosClientId: '<YOUR_IOS_CLIENT_ID>',
      webClientId: 'YOUR_WEB_CLIENT_ID',
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

```

## How to create Facebook Developer Account

#### 1. Create a Facebook Developer Account

- Go to the [Facebook for Developers](https://developers.facebook.com/) website.
- Click on `Get Started` and log in with your Facebook account.
- Follow the on-screen instructions to set up your developer account.

#### 2. Create a New App

- After logging in, go to the [App Dashboard](https://developers.facebook.com/apps/).
- Click `Create App`.
- Choose the type of app you are creating (e.g., `For Everything Else`).
- Click `Continue` and fill in the required details (App Name, App Contact Email, etc.).
- Click `Create App ID` and complete any security checks.

#### 3. Register Your Android App

- In the App Dashboard, select `Settings` > `Basic`.
- Scroll down to the `Add Platform` section and select `Android`.
- Fill in the required fields:
  - **Package Name**: Your app's package name.
  - **Default Activity Class Name**: Your app's main activity class.
- Save your changes.

#### 4. Register Your iOS App

- In the App Dashboard, select `Settings` > `Basic`.
- Scroll down to the `Add Platform` section and select `iOS`.
- Fill in the required fields:
  - **Bundle ID**: Your app's bundle identifier.
- Save your changes.

#### 5. Obtain App ID and Client Token

- In the App Dashboard, go to `Settings` > `Basic`.
- Copy the `App ID` from the `App ID` field.
- Scroll down to the `Client Token` section. If you don’t see a Client Token, go to `Settings` > `Advanced` and copy the token from the `Client Token` field.

## How to get client id for android/ios/web for Google Sign In

#### Obtaining iOS Client ID

- **Go to Google API Console:**

  - Visit the [Google API Console](https://console.developers.google.com/).

- **Create a New Project:**

  - Click on the project dropdown at the top of the page and select **"New Project"**.
  - Enter a project name and click **"Create"**.

- **Enable APIs and Services:**

  - In the API library, search for **"Google Sign-In API"** and enable it.

- **Configure OAuth Consent Screen:**

  - In the left sidebar, go to **"OAuth consent screen"**.
  - Select **"External"** and click **"Create"**.
  - Fill in the required information and save.

- **Create iOS OAuth Client ID:**
  - In the left sidebar, go to **"Credentials"**.
  - Click **"Create Credentials"** and select **"OAuth Client ID"**.
  - Select **"iOS"** as the application type.
  - Enter your **Bundle ID** and click **"Create"**.
  - Your **iOS Client ID** will be displayed. Copy it for later use.

#### Registering an Android App with OAuth Client ID

- **Create Android OAuth Client ID:**
  - In the Google API Console, go to **"Credentials"**.
  - Click **"Create Credentials"** and select **"OAuth Client ID"**.
  - Select **"Android"** as the application type.
  - Enter your **Package Name**.
  - Generate your **SHA-1 Certificate Fingerprint** (see instructions below) and enter it.
  - Click **"Create"**.
  - Your **Android Client ID** will be displayed. Copy it for later use.

### Generating SHA-1 Certificate Fingerprint

- **Using Keytool:**
  - Open a terminal and run the following command:
    ```sh
    keytool -list -v -keystore YOUR_RELEASE_KEY_PATH -alias YOUR_RELEASE_KEY_ALIAS -storepass YOUR_KEYSTORE_PASSWORD -keypass YOUR_KEY_PASSWORD
    ```
  - Replace `YOUR_RELEASE_KEY_PATH`, `YOUR_RELEASE_KEY_ALIAS`, `YOUR_KEYSTORE_PASSWORD`, and `YOUR_KEY_PASSWORD` with your actual keystore details.
  - Copy the **SHA-1 Certificate Fingerprint** from the output.

### Obtaining Web Client ID

- **Create Web OAuth Client ID:**
  - In the Google API Console, go to **"Credentials"**.
  - Click **"Create Credentials"** and select **"OAuth Client ID"**.
  - Select **"Web application"** as the application type.
  - Enter a name for your client ID.
  - Add your authorized redirect URIs.
  - Click **"Create"**.
  - Your **Web Client ID** will be displayed. Copy it for later use.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
