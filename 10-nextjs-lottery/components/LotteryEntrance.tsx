import React, { useCallback, useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '../constants';
import { ethers, BigNumber, ContractTransaction } from 'ethers';
import { useNotification } from '@web3uikit/core';

interface IContractAddresses {
    [key: string]: string[];
}

export const LotteryEntrance: React.FC = () => {
    const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis();
    const dispatchNotification = useNotification();

    const chainId: number = parseInt(chainIdHex!);
    const raffleAddress: string | undefined = chainId.toString() in contractAddresses
        ? (contractAddresses as IContractAddresses)[chainId.toString()][0]
        : undefined;

    const [entranceFee, setEntranceFee] = useState<string | undefined>();
    const [numberOfPlayers, setNumberOfPlayers] = useState<string | undefined>();
    const [recentWinner, setRecentWinner] = useState<string | undefined>();

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getEntranceFee',
        params: {}
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getNumberOfPlayers',
        params: {}
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getRecentWinner',
        params: {}
    });

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'enterRaffle',
        params: {},
        msgValue: entranceFee
    });

    const updateUI = async () => {
        const entranceFee = await getEntranceFee() as BigNumber;
        setEntranceFee(entranceFee.toString());

        const numPlayers = await getNumberOfPlayers() as BigNumber;
        const recentWinner = await getRecentWinner() as string;

        setNumberOfPlayers(numPlayers.toString());
        setRecentWinner(recentWinner);
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleNewNotification = (tx: ContractTransaction) => {
        dispatchNotification({
            type: 'info',
            message: `Transaction Completed in ${tx.blockHash}!`,
            title: 'Tx Notification',
            position: 'topR'
        });
    };

    const handleEnterRaffle = useCallback(async () => {
        const handleSuccess = async (tx: ContractTransaction) => {
            await tx.wait(1);
            handleNewNotification(tx);
            await updateUI();
        };

        await enterRaffle({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => console.log(error)
        });
    }, [enterRaffle]);

    useEffect(() => {
        Moralis.addListener('RaffleEnter', args => {
            console.log(args);
        });

        Moralis.addListener('WinnerPicked', args => {
            console.log(args);
        });
    }, []);

    return (
        <div className='p-5'>
            Hi from lottery entrance!
            {raffleAddress && (
                <div>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto '
                            onClick={handleEnterRaffle}
                            disabled={isLoading || isFetching}>
                        {isLoading || isFetching ?
                            <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div> :
                            <div>Enter Raffle</div>}
                    </button>
                    <div>{entranceFee && `Entrance Fee: ${ethers.utils.formatEther(entranceFee)} ETH`}</div>
                    <div>{numberOfPlayers && `Number of players: ${numberOfPlayers}`}</div>
                    <div>{recentWinner && `Recent winner: ${recentWinner}`}</div>
                </div>
            ) || (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
};