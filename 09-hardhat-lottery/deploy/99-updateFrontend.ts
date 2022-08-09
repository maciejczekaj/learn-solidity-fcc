import { DeployFunction } from 'hardhat-deploy/dist/types';
import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import { Raffle } from '../typechain-types';

const FRONTEND_ADDRESSES_FILE = '../10-nextjs-lottery/constants/contractAddresses.json';
const FRONTEND_ABI_FILE = '../10-nextjs-lottery/constants/abi.json';

const updateFrontend: DeployFunction = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log('Updating frontend...');
        await updateContractAddresses();
        await updateAbi();
    }
};

const updateContractAddresses = async () => {
    const chainId = network.config.chainId!;
    const raffle: Raffle = await ethers.getContract('Raffle');
    let currentAddresses = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES_FILE, 'utf8'));
    if (currentAddresses[chainId] && !currentAddresses[chainId].includes(raffle.address)) {
        currentAddresses[chainId].push(raffle.address);
    } else {
        currentAddresses[chainId] = [raffle.address];
    }
    fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddresses));
};

const updateAbi = async () => {
    const raffle: Raffle = await ethers.getContract('Raffle');
    fs.writeFileSync(FRONTEND_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json) as string);
};

export default updateFrontend;
updateFrontend.tags = ['all', 'frontend'];