import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Header } from '../components/Header';
import { LotteryEntrance } from '../components/LotteryEntrance';

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name='description' content='Our smart contract lottery' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    );
};

export default Home;
