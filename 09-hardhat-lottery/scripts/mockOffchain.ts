import { ethers, network } from 'hardhat';
import { Raffle, VRFCoordinatorV2Mock } from '../typechain-types';
import { developmentChains } from '../helper-hardhat.config';
import { BigNumber } from 'ethers';

export const mockKeepers = async () => {
    const raffle: Raffle = await ethers.getContract('Raffle');
    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(''));
    const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(checkData);

    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData);
        const txReceipt = await tx.wait(1);
        const requestId = txReceipt.events![1].args!.requestId;
        console.log(`Performed upkeep with RequestId: ${requestId}`);
        if (developmentChains.includes(network.name)) {
            await mockVrf(requestId, raffle);
        }
    } else {
        console.log('No upkeep needed!');
    }
};

const mockVrf = async (requestId: BigNumber, raffle: Raffle) => {
    console.log('We\'re on local network? Ok let\'s pretend...');
    const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address);
    console.log('Responded!');
    const recentWinner = await raffle.getRecentWinner();
    console.log(`The winner is: ${recentWinner}`);
};

mockKeepers().catch((error) => {
    console.error(error);
    process.exit(1);
});