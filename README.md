# MaskerAid
An app for sharing masks

# Setup (macOS)

`git clone https://github.com/garylhua/MaskerAid.git`



`cd MaskerAid && npm install && cd ios/ && pod install`

open `ios/MaskerAid.xcworkspace` (not .xcodeproj) and config the [licenses](https://reactnative.dev/docs/running-on-device)

# Troubleshooting

[relevant](https://github.com/oblador/react-native-vector-icons/issues/1074#issuecomment-534027196)

    - Copy Bundle Resources in build phase, remove all fonts (.tff)

[image](https://user-images.githubusercontent.com/3395492/46074144-0ac18300-c187-11e8-973b-4d08251fcb18.png)

nan error: `npm i -g nan`

# Common Commands

- `cd ios && pod install`

- `npx pod-install ios`