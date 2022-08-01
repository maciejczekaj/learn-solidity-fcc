import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DECIMALS, developmentChains, INITIAL_ANSWER } from '../helper-hardhat.config';

const deployMocks = async ({ getNamedAccounts, deployments, network }: HardhatRuntimeEnvironment) => {
    if (developmentChains.includes(network.name)) {
        const { deploy, log } = deployments;
        const { deployer } = await getNamedAccounts();

        log('Local network detected! Deploying mocks...');
        await deploy('MockV3Aggregator', {
            contract: 'MockV3Aggregator',
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
    }
};

export default deployMocks;
deployMocks.tags = ['all', 'mocks'];
