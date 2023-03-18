import { Amplify, AuthModeStrategyType, DataStore } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import awsExports from '../aws-exports';
import { Layout } from '../components/layout';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import theme from '../theme/theme';

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [localRedirectSignIn, productionRedirectSignIn] =
  awsExports.oauth.redirectSignIn.split(',');

const [localRedirectSignOut, productionRedirectSignOut] =
  awsExports.oauth.redirectSignOut.split(',');

const isLocalhost = Boolean(
  globalThis.window?.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    globalThis.window?.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    globalThis.window?.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

Amplify.configure({
  ...awsExports,
  ssr: true,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH
  },
  oauth: {
    ...awsExports.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut
  }
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WOD</title>
        <meta
          name="description"
          content="WOD - a tool to help you plan and organize the wods for your box athletes!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default withAuthenticator(App);
