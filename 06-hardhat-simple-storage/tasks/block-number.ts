import { task } from 'hardhat/config';

export default task('block-number', 'Prints the current block number').setAction(async (_, hre) =>
    console.log(`Current block number: ${await hre.ethers.provider.getBlockNumber()}`)
);
