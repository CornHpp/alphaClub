"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { arbitrum, mainnet } from "viem/chains";
import { WagmiConfig, Config } from "wagmi";

import { store } from "@/redux";

const projectId = "54842d223a39805465f643eff0a011be";

const wagmiMetadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: wagmiMetadata,
}) as Config;
createWeb3Modal({ wagmiConfig, projectId, chains });

interface Props {
  children: React.ReactNode;
}

export function Providers(props: Props) {
  const [isClient, setIsClient] = React.useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <Provider store={store}>
          <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>
        </Provider>
      )}
    </>
  );
}