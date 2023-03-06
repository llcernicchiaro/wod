import { Amplify } from 'aws-amplify';
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

Amplify.configure(awsExports);

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
