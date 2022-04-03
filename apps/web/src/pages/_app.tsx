import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import './styles.css';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <main className="app">
            <Component {...pageProps} />
          </main>
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}

export default CustomApp;
