# Notification, AdMob, and Lottie test.

After *much* turmoil I was able to get [react-native-push-notification](https://github.com/zo0r/react-native-push-notification#readme), [react-native-admob](https://github.com/sbugert/react-native-admob), and [lottie-react-native](https://github.com/react-native-community/lottie-react-native) all working together. I tried all day and had multiple projects with admob and lottie, or lottie and RNPN working; Whenever I had a project with RNPN and Admob I would get a crash no matter what I did.
Here is how I fixed it

## Installation

Installation started with disabling autolinking in the react-native.config.js file. Doing this allowed me to control when each library was linked, and which pieces of code went where. As the process to properly link dependencies varies from library to library I didn't want react-native doing any heavy lifting for me.

In order to assess why I was getting so many crashed I needed to know which code was being edited when, so the next step was setting up this repository to help with version control and visualizing where information was changed when running react-native link


---

### GIF's

A quick reference for future. To intergrate GIF support add the following lines to your dependecies in **android/app/build.gradle**

```
dependencies {
    ...
     // GIFs
    implementation 'com.facebook.fresco:fresco:1.+'
    implementation 'com.facebook.fresco:animated-gif:2.0.0'
  }
 ```
---

### Lottie

I started with Lottie, by far the easiest of the bunch.
Firstly installing the two libraries:
```
npm i --save lottie-react-native
npm i --save lottie-ios@3.1.3
```

Then manually linking by adding to:

**android/app/src/main/java/\<AppName\>/MainApplication.java**
- add `import com.airbnb.android.react.lottie.LottiePackage;` on the imports section
- add `packages.add(new LottiePackage());` in `List<ReactPackage> getPackages()`;

 **android/app/build.gradle**
add `implementation project(':lottie-react-native')` in the `dependencies` block

**android/settings.gradle**
add:
```
include ':lottie-react-native'
project(':lottie-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/lottie-react-native/src/android')
```

And that is lottie installed.

---

### AdMob

AdMob is where things begin to get interesting. As both RNPN and Admob have google play dependencies, and optional firebase dependencies, they can have conflict.

We start with installation:
`npm i --save react-native-admob@next`

Then linking with:
`npx react-native link react-native-admob`

And adding in the AdMob identifier to the Android Manifest file:
```
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-3940256099942544~3347511713" />
```

And all done!

---

### React Native Push Notification

Lastly, RNPN

##### Installation
To start off we installed with:
`npm install --save react-native-push-notification`

Then linked the library with:
`npx react-native link react-native-push-notification`

We then added to our **android/build.gradle**:
```
ext {
    googlePlayServicesVersion = "+" // Add these lines
    firebaseVersion = "+" // Add these lines
    // Other settings
    compileSdkVersion = <Your compile SDK version> // default: 23
    buildToolsVersion = "<Your build tools version>" // default: "23.0.1"
    targetSdkVersion = <Your target SDK version> // default: 23
    supportLibVersion = "<Your support lib version>" // default: 23.1.1
}
```

##### Remote Notifcations
And for remote notifications through Firebase:

**android/build.gradle**
```
buildscript {
    ...
    dependencies {
        ...
        classpath('com.google.gms:google-services:4.3.3')
        ...
    }
}
```

**android/app/build.gradle**
```
dependencies {
  ...
  implementation 'com.google.firebase:firebase-analytics:17.3.0'
  ...
}
apply plugin: 'com.google.gms.google-services'
```

And lastly create and insert your **google-services.json** from firebase.

##### AndroidManifest Metadata

In your **AndroidManifest.xml** file you need to add some meta data, and make sure you have the matching support files your meta data is pointing to (ie colors.xml and ic_notification.png)

```
<meta-data  android:name="com.dieam.reactnativepushnotification.notification_channel_name"
  android:value="General"/>
<meta-data  android:name="com.dieam.reactnativepushnotification.notification_channel_description"
  android:value="asdf"/>
<!-- Change the resource name to your App's accent color - or any other color you want -->
<meta-data  android:name="com.dieam.reactnativepushnotification.notification_color"
  android:resource="@color/white"/> <!-- or @android:color/{name} to use a standard color -->
<meta-data
  android:name="com.google.firebase.messaging.default_notification_icon"
  android:resource="@mipmap/ic_notification" />
  <!-- INFO TO ENABLE JS LIBRARY TO INTERACTE WITH JAVA -->
  <receiver
      android:name="com.google.android.gms.gcm.GcmReceiver"
      android:exported="true"
      android:permission="com.google.android.c2dm.permission.SEND" >
      <intent-filter>
          <action android:name="com.google.android.c2dm.intent.RECEIVE" />
          <category android:name="${applicationId}" />
      </intent-filter>
  </receiver>

  <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />

  <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver">
      <intent-filter>
          <action android:name="android.intent.action.BOOT_COMPLETED" />
      </intent-filter>
  </receiver>

  <service android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationRegistrationService"/>
  <!-- END   INFO TO ENABLE JS LIBRARY TO INTERACTE WITH JAVA -->
  <!-- GCM LISTENER
  <service
      android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerServiceGcm"
      android:exported="false" >
      <intent-filter>
          <action android:name="com.google.android.c2dm.intent.RECEIVE" />
      </intent-filter>
  </service>
  -->

  <!-- BEGIN FCM  LISTENER INFO -->
  <service
    android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService"
    android:exported="false" >
    <intent-filter>
      <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
  </service>
  <!-- END FCM  LISTENER INFO -->
  <!-- END NOTIFATION INFORMATION -->
```

---

### Solution to all crashes

After attempting to install RNPN 4 seperate times, and continuously getting errors, I finally went and got some rest. Starting research again in the morning I found that all my crashes were related to Firebase and Google service integration. The Firebase version included with this project was conflicting with the Google play service version included in my project.
Luckily Google Android has something to fix just this issue.

Adding into **android/app/build.gradle**
```
defaultConfig {
    applicationId "com.test1"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 1
    versionName "1.0"
    multiDexEnabled true  /// This line
}
```

Will resolve this issue of multiple Google play service versions and firebase versions.
More information in the links below:
- https://github.com/invertase/react-native-firebase/issues/745
- https://developer.android.com/studio/build/multidex
