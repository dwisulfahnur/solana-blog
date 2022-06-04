import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { useMemo } from "react"
import Layout from "../components/Layout";
import BlogProvider from "../context/BlogProvider"
import NextNProgress from "nextjs-progressbar";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");


const App = ({ Component, pageProps }) => {
  let rpc_endpoint = process.env.NEXT_PUBLIC_SOLANA_CLUSTER === "devnet" ?
    "https://api.devnet.solana.com" : "http://127.0.0.1:8899"

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()]
  )
  return (
    <ConnectionProvider endpoint={rpc_endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BlogProvider>
            <NextNProgress color="#4f46e5" height={3} showOnShallow={true} />
            <Layout>
              <Component {...pageProps} />
            </Layout></BlogProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App