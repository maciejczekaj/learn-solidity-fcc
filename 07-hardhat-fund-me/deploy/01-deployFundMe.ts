import { developmentChains, networkConfig } from '../helper-hardhat.config';
import { verify } from '../utils/verify';
import { DeployFunction } from 'hardhat-deploy/types';

const deployFundMe: DeployFunction = async function ({ getNamedAccounts, deployments, network }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const config = networkConfig[network.name];

    // when going for localhost or hardhat we want to use mocks
    let ethUsdPriceFeedAddress: string;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get('MockV3Aggregator');
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = config.ethUsdPriceFeed!;
    }

    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: config.blockConfirmations ?? 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify('FundMe', fundMe.address, args);
    }
};

export default deployFundMe;
deployFundMe.tags = ['all', 'fundMe'];
