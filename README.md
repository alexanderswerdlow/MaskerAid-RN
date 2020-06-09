# MaskerAid

A mobile application for sharing mask designs as well as finding insipartion from others!

## Requirements

- [Xcode](https://developer.apple.com/xcode/), Brew, Node, Watchman

Note: The app is cross-platform, but was primarily tested on iOS. Therefore, we request that it is evaluated on iOS and, as a consequence, setup must occur on macOS (Xcode is needed to deploy to iOS devices)

To install:

- Install Brew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
- Install Node: `brew install node`

- Install Watchman: `brew install watchman`
- Install Xcode from the [macOS App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
- Verify that Xcode Command line Tools Are installed: `xcode-select --install`
- Install CocoaPods: `sudo gem install cocoapods`

## Setup (macOS)

Extract the tarball and `cd MaskerAid` (we know you already did that because you're reading this message)

Run the commands:

- `yarn install`

- `cd iOS && pod install`

- open `MaskerAid.xcworkspace` (not .xcodeproj) and config the [licenses](https://reactnative.dev/docs/running-on-device)

Note: You must have an Apple account, and non-paid developer accounts have a limited number of certificates that can be used to deploy applications at a single time.

- You must

# Troubleshooting

[relevant](https://github.com/oblador/react-native-vector-icons/issues/1074#issuecomment-534027196)

    - Copy Bundle Resources in build phase, remove all fonts (.tff)

[image](https://user-images.githubusercontent.com/3395492/46074144-0ac18300-c187-11e8-973b-4d08251fcb18.png)

nan error: `npm i -g nan`

need to install firebase cli: `npm install -g firebase-tools`

run `firebase login` to login to your firebase account

If you get error message `command not found: pod`, run the command `sudo gem install cocoapods`.

# Common Commands

- `cd ios && pod install`

- `npx pod-install ios`

- `firebase firestore:delete --all-collections -y`
    -> Delete's every firestore collection. Use with caution.
    
- `algolia deleteindicespattern -a 'V6KRQS64EW' -k '1811eb11a0974a46ed235ed40cb866f1' -r '(posts)|(users)' -x true`
