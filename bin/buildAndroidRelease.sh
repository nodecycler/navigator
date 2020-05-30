yarn build:android
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Google\ Drive/release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk mykey
~/Library/Android/sdk/build-tools/29.0.3/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk navigator.apk
