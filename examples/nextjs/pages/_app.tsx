import type { AppProps } from 'next/app'
import { SolanaProvider } from '../context/SolanaProvider';
import { ProgramProvider } from '../context/ProgramProvider';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import createEmotionCache from '../utils/createEmotionCache';
import defaultTheme from '../theme/default';

import '../styles/globals.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme(defaultTheme);

function MyApp({
  Component,
  pageProps,
}: AppProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SolanaProvider>
          <ProgramProvider>
            <Component {...pageProps} />
          </ProgramProvider>
        </SolanaProvider>
      </ThemeProvider>
    </CacheProvider>
    );
}

export default MyApp
