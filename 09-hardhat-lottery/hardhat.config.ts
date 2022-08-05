import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { config } from 'dotenv';
import 'hardhat-deploy';

config();

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY!;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

const hardhatUserConfig: HardhatUserConfig = {
    solidity: {
        compilers: [{ version: '0.8.9' }]
    },
    defaultNetwork: 'hardhat',
    networks: {
        localhost: {
            url: 'http://127.0.0.1:8545',
            chainId: 31337
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY!],
            chainId: 5
        },
        mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY!],
            chainId: 80001
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY!],
            chainId: 31337
        }
    },
    etherscan: {
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,

            polygonMumbai: POLYGONSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY
        }
    },
    gasReporter: {
        enabled: false,
        currency: 'USD',
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        outputFile: 'gas-report.txt'
    },
    namedAccounts: {
        deployer: {
            default: 0
        },
        player: {
            default: 1
        }
    },
    mocha: {
        timeout: 300000 // in ms
    }
};

export default hardhatUserConfig;
