import { run } from 'hardhat';

export const verify = async (contractName: string, contractAddress: string, args: any[]) => {
    console.log(`Verifying ${contractName} on Etherscan...`);
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log(`${contractName} already verified!`);
        } else {
            console.log(e);
        }
    }
};
