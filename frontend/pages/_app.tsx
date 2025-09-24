import type { AppProps } from 'next/app';
import '../src/styles/globals.css';

export default function BrainyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
