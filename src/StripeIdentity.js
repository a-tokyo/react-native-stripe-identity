/* @flow */
import React, { useState } from 'react';
import { Text } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  /** The Identity webpage url - Stripe's identity.next_action.redirect_to_url */
  redirectToUrl: string,
  /** The Identity return url - Stripe's identity.refresh_url - Intercepted to call onRefresh */
  refreshUrl: string,
  /** Called when the Stripe identity session completes with status 'success' */
  onSuccess: ({ [key: string]: any, verificationIntentId?: string }) => any,
  /** Called when the Stripe identity session completes with status 'refresh' */
  onRefresh: ({ [key: string]: any }) => any,
  /** Called when the Stripe identity session webpage loads successfully */
  onLoadingComplete?: (syntheticEvent: SyntheticEvent) => any,
  /** Props passed to the WebView */
  webViewProps?: Object,
  /** Renders the component shown when identity session is completed */
  renderOnComplete?: () => React$Node,
};

/**
 * StripeIdentityWebView
 *
 * Handles a full Stripe Identity journey on react native via webview
 *
 * Important Notes about URLs:
 * - successUrl must have the query string params `?vi={VERIFICATION_INTENT_ID}`
 *   - vi must be the last param - passed to the onSuccess function as verificationIntentId
 *
 */
const StripeIdentityWebView = (props: Props) => {
  const {
    redirectToUrl,
    refreshUrl,
    onSuccess,
    onRefresh,
    onLoadingComplete,
    webViewProps = {},
    renderOnComplete,
  } = props;
  /** Holds the complete URL if exists */
  const [completed, setCompleted] = useState(null);
  /** Holds wether Stripe Identity has loaded yet */
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Called every time the URL stats to load in the webview
   *
   * handles completing the identity session
   */
  const _onLoadStart = (syntheticEvent: SyntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    const { url: currentUrl } = nativeEvent;
    /** Check and handle identity state: success */
    if (currentUrl.includes('?vi=') || currentUrl.includes('&vi=')) {
      const verificationIntentIdKey = 'vi=';
      const verificationIntentId = currentUrl
        .substring(
          currentUrl.indexOf(verificationIntentIdKey),
          currentUrl.length,
        )
        /** remove key */
        .replace(verificationIntentIdKey, '')
        /** remove extra trailing slash */
        .replace('/', '');
      setCompleted(true);
      if (onSuccess) {
        onSuccess({ ...props, verificationIntentId });
      }
      return;
    }
    /** Check and handle identity state: refresh */
    if (currentUrl === refreshUrl) {
      setCompleted(true);
      if (onRefresh) {
        onRefresh(props);
      }
    }
    /** call webViewProps.onLoadStart */
    if (webViewProps && webViewProps.onLoadStart) {
      webViewProps.onLoadStart(syntheticEvent);
    }
  };

  /**
   * Called upon URL load complete
   */
  const _onLoadEnd = (syntheticEvent: SyntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    /** set isLoading to false once the stripe identity page loads */
    if (
      !hasLoaded &&
      nativeEvent.url.startsWith('https://verify.stripe.com') &&
      onLoadingComplete
    ) {
      setHasLoaded(true);
      onLoadingComplete(syntheticEvent);
    }
    /** call webViewProps.onLoadStart */
    if (webViewProps && webViewProps.onLoadEnd) {
      webViewProps.onLoadEnd(syntheticEvent);
    }
  };

  /** If the identity session is complete -- render the complete content */
  if (completed) {
    return renderOnComplete ? (
      renderOnComplete({ url: completed, ...props })
    ) : (
      <Text>Stripe Identity session complete.</Text>
    );
  }

  /** Render the WebView holding the Stripe identity flow */
  return (
    <WebView
      /** pass baseUrl to avoid  `IntegrationError: Live Stripe.js integrations must use HTTPS.` error https://github.com/react-native-community/react-native-webview/issues/1317 */
      baseUrl=""
      originWhitelist={['*']}
      {...webViewProps}
      source={{
        uri: redirectToUrl,
      }}
      onLoadStart={_onLoadStart}
      onLoadEnd={_onLoadEnd}
    />
  );
};

export default StripeIdentityWebView;
