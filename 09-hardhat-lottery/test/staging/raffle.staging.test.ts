import { developmentChains } from '../../helper-hardhat.config';
import { ethers, getNamedAccounts, network } from 'hardhat';
import { Raffle } from '../../typechain-types';
import { BigNumber } from 'ethers';
import { Address } from 'hardhat-deploy/dist/types';
import { expect } from 'chai';

developmentChains.includes(network.name)
    ? describe.skip
    : describe('Raffle', function() {
        let raffle: Raffle;
        let raffleEntranceFee: BigNumber;
        let deployer: Address;

        beforeEach(async function() {
            deployer = (await getNamedAccounts()).deployer;
            raffle = await ethers.getContract('Raffle', deployer);
            raffleEntranceFee = await raffle.getEntranceFee();
        });

        describe('fullFillRandomWords', async function() {
            it('should work with live ChainlinkKeepers and Chainlink VRF, we get a random winner', async function() {
                // enter the raffle
                const startingTimestamp = await raffle.getLatestTimestamp();
                const accounts = await ethers.getSigners();

                await new Promise<void>(async (resolve, reject) => {
                    // setup listener before we enter the raffle
                    // just in case the blockchain moves REALLY fast
                    raffle.once('WinnerPicked', async () => {
                        console.log('WinnerPicked event fired!');
                        try {
                            const recentWinner = await raffle.getRecentWinner();
                            const raffleState = await raffle.getRaffleState();
                            const winnerEndingBalance = await accounts[0].getBalance();
                            const endingTimestamp = await raffle.getLatestTimestamp();
                            const interval = await raffle.getInterval();
                            await expect(raffle.getPlayer(0)).to.be.reverted;
                            expect(recentWinner).to.equal(accounts[0].address);
                            expect(raffleState).to.equal(0);
                            expect(winnerEndingBalance.toString()).to.equal(winnerStartingBalance.add(raffleEntranceFee).toString());
                            expect(endingTimestamp).to.be.greaterThan(startingTimestamp.add(interval));
                        } catch (e) {
                            reject(e);
                        }
                        resolve();
                    });

                    // Then entering the raffle
                    const tx = await raffle.connect(accounts[0]).enterRaffle({ value: raffleEntranceFee });
                    await tx.wait(1);
                    const winnerStartingBalance = await accounts[0].getBalance();
                    // and this code WON't complete until our listener has finished listening
                });
            });
        });
    });