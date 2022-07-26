import {ethers} from 'ethers'
import {writeFileSync} from 'fs-extra';
import {config} from 'dotenv';

config();

async function encryptKey() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJsonKey = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD, process.env.PRIVATE_KEY);
    console.log(encryptedJsonKey);
    writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

encryptKey()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });