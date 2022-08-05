import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

export interface INetworkConfigItem {
    blockConfirmations?: number;
    vrfCoordinatorV2Address?: string;
    entranceFee: BigNumber;
    // [X] gwei key hash (any valid bytes32 for localhost and hardhat because it's mocked)
    gasLane: string;
    // Chainlink VRF subscription ID
    subscriptionId?: number;
    callbackGasLimit: number;

    // interval in seconds
    interval: number;
}

interface INetworkConfigInfo {
    [name: string]: INetworkConfigItem;
}

export const networkConfig: INetworkConfigInfo = {
    rinkeby: {
        blockConfirmations: 6,
        vrfCoordinatorV2Address: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
        entranceFee: ethers.utils.parseEther('0.01'),
        gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
        subscriptionId: 1277,
        callbackGasLimit: 500000,
        interval: 30
    },
    mumbai: {
        blockConfirmations: 6,
        vrfCoordinatorV2Address: '0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed',
        entranceFee: ethers.utils.parseEther('1'),
        gasLane: '0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f',
        subscriptionId: 1277,
        callbackGasLimit: 500000,
        interval: 30
    },
    localhost: {
        entranceFee: ethers.utils.parseEther('0.01'),
        gasLane: '0x0000000000000000000000000000000000000000000000000000000000000000',
        callbackGasLimit: 500000,
        interval: 30
    },
    hardhat: {
        entranceFee: ethers.utils.parseEther('0.01'),
        gasLane: '0x0000000000000000000000000000000000000000000000000000000000000000',
        callbackGasLimit: 500000,
        interval: 30
    }
};

export const developmentChains = ['hardhat', 'localhost'];
