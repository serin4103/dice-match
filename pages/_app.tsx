import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { SocketProvider } from "../contexts/SocketContext";
import { GameStateProvider } from "../contexts/GameStateContext";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <SessionProvider session={session}>
            <SocketProvider>
                <GameStateProvider>
                    <Component {...pageProps} />
                </GameStateProvider>
            </SocketProvider>
        </SessionProvider>
    );
};

export default App;