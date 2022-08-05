import { Address, DeployFunction } from 'hardhat-deploy/dist/types';
import { deployments, ethers } from 'hardhat';
import { developmentChains, networkConfig } from '../helper-hardhat.config';
import { verify } from '../utils/verify';
import { VRFCoordinatorV2Mock } from '../typechain-types';

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther('30');

const deployRaffle: DeployFunction = async ({ network, getNamedAccounts }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const config = networkConfig[network.name];

    let vrfCoordinatorV2Address: Address;
    let subscriptionId: number;
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events![0].args!.subId;

        // Fund the subscription
        // Usually you would need LINK tokens on real network
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
    } else {
        vrfCoordinatorV2Address = config.vrfCoordinatorV2Address!;
        subscriptionId = config.subscriptionId!;
    }

    const args = [vrfCoordinatorV2Address, config.entranceFee.toString(), config.gasLane, subscriptionId, config.callbackGasLimit, config.interval];
    const raffle = await deploy('Raffle', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: config.blockConfirmations
    });

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
    }

    if (!developmentChains.includes(network.name)) {
        await verify('Raffle', raffle.address, args);
    }
};


export default deployRaffle;
deployRaffle.tags = ['all', 'raffle'];