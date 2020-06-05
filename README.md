# MaskerAid
A mobile application for sharing mask designs as well as finding insipartion from others!

# Setup (macOS)

Download Xcode.

On terminal run the commands:

`git clone https://github.com/garylhua/MaskerAid.git`

`cd MaskerAid && npm install && cd ios/ && pod install`

open `ios/MaskerAid.xcworkspace` (not .xcodeproj) and config the [licenses](https://reactnative.dev/docs/running-on-device)

# Troubleshooting

[relevant](https://github.com/oblador/react-native-vector-icons/issues/1074#issuecomment-534027196)

    - Copy Bundle Resources in build phase, remove all fonts (.tff)

[image](https://user-images.githubusercontent.com/3395492/46074144-0ac18300-c187-11e8-973b-4d08251fcb18.png)

nan error: `npm i -g nan`

need to install firebase cli: `npm install -g firebase-tools`

run `firebase login` to login to your firebase account

# Common Commands

- `cd ios && pod install`

- `npx pod-install ios`

- `firebase firestore:delete --all-collections -y`
    - Delete's every firestore collection. Use with caution.
- `algolia deleteindicespattern -a 'V6KRQS64EW' -k '1811eb11a0974a46ed235ed40cb866f1' -r '(posts)|(users)' -x true`
