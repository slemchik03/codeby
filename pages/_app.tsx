import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.scss";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import AuthProvider from "@/components/Providers/AuthProvider";
import { NextComponentType, NextPageContext } from "next";
import { QueryClientProvider } from "react-query/react";
import { QueryClient } from "react-query";
import Script from "next/script";
import 'rc-slider/assets/index.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface CustomAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any> & {
    access: "public" | "protected";
  };
}
const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider pageAccess={Component.access}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
      <Script
        async
        src="https://telegram.org/js/telegram-widget.js?21"
      />
    </SessionProvider>
  );
}
