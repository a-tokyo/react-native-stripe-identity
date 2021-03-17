# React Native Stripe Identity
React Native implementation for [Stripe.js Identity](https://stripe.com/docs/identity).

<a href="https://npmjs.com/package/react-native-stripe-identity">
  <img src="https://img.shields.io/npm/v/react-native-stripe-identity.svg"></img>
  <img src="https://img.shields.io/npm/dt/react-native-stripe-identity.svg"></img>
</a>
<a href="https://codecov.io/gh/A-Tokyo/react-native-stripe-identity">
  <img src="https://codecov.io/gh/A-Tokyo/react-native-stripe-identity/branch/main/graph/badge.svg" />
</a>
<a href="https://twitter.com/intent/follow?screen_name=ahmad_tokyo"><img src="https://img.shields.io/twitter/follow/ahmad_tokyo.svg?label=Follow%20@ahmad_tokyo" alt="Follow @ahmad_tokyo"></img></a>


<p align="center">
  <img src="https://i.imgur.com/zgMBFXm.png" width="340px"></img>
</p>


## Description
The library allows you to use [Stripe.js Identity](https://stripe.com/docs/identity) with react-native/expo without ejecting. You can use it with both server-side implementations and client-side implementations. Simply ensure you follow the [url structure guidelines below](#important-notes-about-urls).

#### API version
`identity_beta=v3`

## Prequisites
- This library relies on [React Native Webview](https://www.npmjs.com/package/react-native-webview). Please follow [this guide](https://github.com/react-native-community/react-native-webview/blob/HEAD/docs/Getting-Started.md) to install in your project first.


## Installation

- Ensure you've completed the setps in [prequisites.](#prequisites)

- Install package via npm or yarn:

`npm install --save react-native-stripe-identity` OR `yarn add react-native-stripe-identity`

- Import in your project

```javascript
import StripeIdentity from 'react-native-stripe-identity';
```


## Usage
```jsx
import StripeIdentity from 'react-native-stripe-identity';

const MyStripeIdentity = () => (
  <StripeIdentity
    redirectUrl="https://verify.stripe.com/start#XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    refreshUrl="https://example.com/refresh"
    onSuccess={({ verificationIntentId }) => {
      console.log(`Stripe identity session succeeded. verification intent id: ${verificationIntentId}.`);
    }}
    onRefresh={() => {
      console.log(`Stripe identity session requested refresh.`);
    }}
  />
);

export default MyStripeIdentity;
```


## Important Notes about URLs

- [return_url](https://stripe.com/docs/identity/intents#create-a-verificationintent) must have the query string param `?vi={VERIFICATION_INTENT_ID}`.
  - vi must be the last param - passed to the onSuccess function as verificationIntentId
- A simple way to do this is using [url-join](https://www.npmjs.com/package/url-join). eg: `urlJoin(myReturnUrl, '?vi={VERIFICATION_INTENT_ID}')`.


## Component props

- `redirectToUrl` (string) - The Identity webpage url - Stripe's [`identity.next_action.redirect_to_url`](https://stripe.com/docs/identity/intents#create-a-verificationintent).
- `refreshUrl` (string) - The Identity return url - Stripe's identity.refresh_url - Intercepted to call onRefresh.
- `onSuccess` (?Function) - Called upon success of the identity session with `{ ...props, verificationIntentId: 'VERIFICATION_INTENT_ID' }`
- `onRefresh` (?Function) - Called upon identity session redirecting to refreshUrl with `{ ...props }`
- `onLoadingComplete` (?Function) - Called when the Stripe identity session webpage loads successfully.
- `webViewProps` (?Object) - WebView Component props, spread on the WebView Component.
- `renderOnComplete` (?(props) => React$Node) - Optional rendering function returning a component to display upon identity completion. note: You don't need this if your onSuccess and onRefresh functions navigate away from the component.

### Troubleshooting
- If you face Camera/Gallery permissions issues checkout the solutions in [this react-native-permissions issue](https://github.com/react-native-webview/react-native-webview/issues/508#issuecomment-543758204)


## Contributing
Pull requests are highly appreciated! For major changes, please open an issue first to discuss what you would like to change.

### Notice
Stripe identity is still in beta.
