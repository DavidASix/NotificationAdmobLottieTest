# Notification, AdMob, and Lottie test.

After *much* turmoil I was able to get [react-native-push-notification](https://github.com/zo0r/react-native-push-notification#readme), [react-native-admob](https://github.com/sbugert/react-native-admob), and [lottie-react-native](https://github.com/react-native-community/lottie-react-native) all working together. I tried all day and had multiple projects with admob and lottie, or lottie and RNPN working; Whenever I had a project with RNPN and Admob I would get a crash no matter what I did.
Here is how I fixed it

## Installation

Installation started with disabling autolinking in the react-native.config.js file. Doing this allowed me to control when each library was linked, and which pieces of code went where. As the process to properly link dependencies varies from library to library I didn't want react-native doing any heavy lifting for me.

In order to assess why I was getting so many crashed I needed to know which code was being edited when, so the next step was setting up this repository to help with version control and visualizing where information was changed when running react-native link

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
