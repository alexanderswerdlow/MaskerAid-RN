# MaskerAid

A mobile application for sharing mask designs as well as finding inspiration from others!

[toc]

## Requirements

- [Xcode](https://developer.apple.com/xcode/), [Brew](https://brew.sh/), [Node](https://nodejs.org/en/), [Watchman](https://facebook.github.io/watchman/)

Note: The app is cross-platform, but was primarily tested on iOS. Therefore, we request that it is evaluated on iOS and, as a consequence, setup must occur on macOS (Xcode is needed to deploy to iOS devices). Setup instructions for alternate platforms can be found [here](https://reactnative.dev/docs/environment-setup). The following instructions were verified on macOS Catalina (10.15.4).

*Furthermore, it should be noted that a Firebase project is necessary to deploy the project from scratch but, as that would involve significant configuration for the tester, the necessary tokens (none of them secret), are already in place. The Cloud Functions have also already been deployed as it requires authentication to do so.*

To install:

- Install Brew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
- Install Node: `brew install node`

- Install Watchman: `brew install watchman`
- Install the latest version of Xcode from the [macOS App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)

- You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

![GettingStartedXcodeCommandLineTools](https://i.imgur.com/KviELot.png)

- If you wish to use a simulator as opposed to deploying to a device (not recommended as the experience will likely feel more sluggish due to emulation)
  - Open **Xcode > Preferences...** and select the **Components** tab. Select a simulator with the corresponding version of iOS you wish to use. As of writing, the latest iOS version in Xcode 11.5 is iOS 13.4

- Install CocoaPods: `sudo gem install cocoapods`

## Setup (macOS)

Extract the tarball and `cd MaskerAid` (we know you already did that because you're reading this message)

Run the commands:

- `npm install`

- `cd ios && pod install`

- `open MaskerAid.xcworkspace` (not .xcodeproj) and config the [licenses](https://reactnative.dev/docs/running-on-device)

Note: You must have an Apple account to deploy to a physical device.

- To open the app in the Xcode simulator, simply click the *Run* button. [See Release Build first](#release-build)
  - The default simulator device is the iPhone SE (2nd Gen). This can be changed if desired by clicking on the name and selecting another device

### Device Deployment

If you already have your Apple account configured in Xcode, simply click *MaskerAid* on the left (above "Pods"), and for each of the 4 targets, select your "Team" (likely just your Full Name), and create a bundle-identifier. The identifier can be anything as long as it is consistent and unique from other bundle ID's that have already been registered, e.g. `org.reactjs.native.example.MaskerAidEmacs` has not been used as of writing.

![signing](https://i.imgur.com/padm7gN.jpg)

Once configured simply press the run button. [See Release Build first](#release-build)

For more thorough instructions, please see these [instructions](https://reactnative.dev/docs/running-on-device) that walks you through configuration in depth.

### Release Build

Deploying the app (via simulator or a physical device), will automatically open the React Native Bundler that is used for development (hot-reload). Do not close this window until the app loads. If desired, this window can be re-opened from the `MaskerAid` root folder by running `npm start`.

**Note:** By default, pressing the *Run* button in Xcode will compile the App in debug mode. This is ideal for development, but comes with a large performance penalty. The app functions fine in either mode, but it is recommended to use deploy with Release mode while testing. Follow the visual guide below to switch to release mode:

![release-1](https://i.imgur.com/s0qVNHW.png)

![release-2](https://i.imgur.com/Qal5jwB.png)

![release-3](https://i.imgur.com/NbwM2II.png)

## Troubleshooting

- If there are library issues while compiling in Xcode, try running the following command:
  -  `rm -rf node_nodules && npm install && npx pod-install && open ios/MaskerAid.xcworkspace`

- If you get error message `command not found: pod`, try running:
  -  `sudo gem install cocoapods`
- If you need to install the Firebase CLI to deploy backend functions (should not be necessary)
  -  `npm install -g firebase-tools`
  - `firebase login`
  - Note that you must sign in with your Google Account (that has been added to the project) before deploying
- If you get a `nan error` try:
  - `npm install -g nan`
- If you recieve font errors upon compilation,  this may be [relevant](https://github.com/oblador/react-native-vector-icons/issues/1074#issuecomment-534027196)
  - `Copy Bundle Resources in build phase, remove all fonts (.tff)`
  - ![fonts](https://i.imgur.com/pWvnBLw.png)



## Common Commands

- `firebase firestore:delete --all-collections -y`
    - Requires Firebase CLI
    - Deletes every Firestore collection. Use with caution.
- `algolia deleteindicespattern -a 'V6KRQS64EW' -k '1811eb11a0974a46ed235ed40cb866f1' -r '(posts)|(users)' -x true`
    - Requires Algolia CLI. Deletes All Indices. Use with caution.
