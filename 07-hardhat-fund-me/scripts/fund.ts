import { ethers, getNamedAccounts } from 'hardhat';
import { FundMe } from '../typechain-types';

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe: FundMe = await ethers.getContract('FundMe', deployer);
    console.log('Funding Contract...');
    const transactionResponse = await fundMe.fund({ value: ethers.utils.parseEther('1') });
    await transactionResponse.wait(1);
    console.log('Funded');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
