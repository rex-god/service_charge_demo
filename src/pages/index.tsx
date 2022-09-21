import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import styles from '../styles/Home.module.css';
import HeaderComponent from '../components/header';
import CreateNftComponent from '../components/create-nft';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const Home: NextPage = () => {
  return (
    <>
      <HeaderComponent />
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* <main className={styles.main}> */}
        <div className={styles.walletButtons}>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
        {/* </main> */}
        <CreateNftComponent />

        <footer className={styles.footer}>
          <a href="https://shyft.to" target="_blank" rel="noopener noreferrer">
            Powered by <Image src="/logo512.png" alt="Shyft Logo" width={30} height={30} />
          </a>
        </footer>
      </div>
    </>
  );
};

export default Home;