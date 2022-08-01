import { ethers } from './ethers-5.6.esm.min.js';
import { ABI, CONTRACT_ADDRESS } from './constants.js';

const connectButton = document.getElementById('connectButton');
connectButton.onclick = connect;

const fundButton = document.getElementById('fundButton');
fundButton.onclick = fund;

const withdrawButton = document.getElementById('withdrawButton');
withdrawButton.onclick = withdraw;

const balanceButton = document.getElementById('balanceButton');
balanceButton.onclick = getBalance;

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById('connectButton').innerHTML = 'Connected';
    } else {
        document.getElementById('connectButton').innerHTML = 'Please install Metamask!';
    }
}

async function fund() {
    const ethAmount = document.getElementById('amount').value;
    console.log(`Funding with ${ethAmount} eth...`);
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) });
            await listenForTransactionMine(transactionResponse, provider);
            console.log('Done');
        } catch (error) {
            console.log(error);
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(CONTRACT_ADDRESS);
        document.getElementById('balanceValue').innerText = `${ethers.utils.formatEther(balance)} ETH`;
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`);
            resolve();
        });
    });
}