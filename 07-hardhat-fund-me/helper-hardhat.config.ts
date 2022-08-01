export interface INetworkConfigItem {
    ethUsdPriceFeed?: string;
    blockConfirmations?: number;
}

interface INetworkConfigInfo {
    [name: string]: INetworkConfigItem;
}

export const networkConfig: INetworkConfigInfo = {
    rinkeby: {
        ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
        blockConfirmations: 6,
    },
    polygon: {
        ethUsdPriceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    },
    localhost: {},
    hardhat: {},
};

export const developmentChains = ['hardhat', 'localhost'];

export const DECIMALS = '8';
export const INITIAL_ANSWER = '20000000000';
