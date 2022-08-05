import { DeployFunction } from 'hardhat-deploy/dist/types';
import { developmentChains } from '../helper-hardhat.config';
import { ethers, network } from 'hardhat';

const BASE_FEE = ethers.utils.parseEther('0.25'); // found as PREMIUM in chain.link
const GAS_PRICE_LINK = 1e9; // link per gas

const deployMocks: DeployFunction = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments;

    if (developmentChains.includes(network.name)) {
        log('Development network detected! Deploying mocks!');
        const { deployer } = await getNamedAccounts();
        await deploy('VRFCoordinatorV2Mock', {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK]
        });
    }
};

export default deployMocks;
deployMocks.tags = ['all', 'mocks'];