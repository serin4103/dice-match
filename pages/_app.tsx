import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { SocketProvider } from "../contexts/SocketContext";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <SessionProvider session={session}>
            <SocketProvider>
                <Component {...pageProps} />
            </SocketProvider>
        </SessionProvider>
    );
};

export default App;