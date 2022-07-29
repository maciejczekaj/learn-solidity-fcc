import { ethers, network, run } from 'hardhat';

const CONTRACT_NAME = 'SimpleStorage';

const main = async () => {
    const simpleStorageFactory = await ethers.getContractFactory(CONTRACT_NAME);
    console.log(`Deploying ${CONTRACT_NAME}...`);
    const simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`Deployed ${CONTRACT_NAME} to: ${simpleStorage.address}`);

    if (network.name === 'rinkeby' && process.env.ETHERSCAN_API_KEY) {
        console.log('Waiting for txes...');
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is ${currentValue}`);
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated values is ${updatedValue}`);
};

const verify = async (contractAddress: string, args: any[]) => {
    console.log(`Verifying ${CONTRACT_NAME} on Etherscan...`);
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log(`${CONTRACT_NAME} already verified!`);
        } else {
            console.log(e);
        }
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
