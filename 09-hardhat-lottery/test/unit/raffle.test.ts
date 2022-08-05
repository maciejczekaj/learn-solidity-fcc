import { developmentChains, networkConfig } from '../../helper-hardhat.config';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { Raffle, VRFCoordinatorV2Mock } from '../../typechain-types';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { Address } from 'hardhat-deploy/dist/types';

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('Raffle', function() {
        let raffle: Raffle;
        let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
        let interval: number;
        let raffleEntranceFee: BigNumber;
        let deployer: Address;

        beforeEach(async function() {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture('all');
            raffle = await ethers.getContract('Raffle', deployer);
            vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock', deployer);
            raffleEntranceFee = await raffle.getEntranceFee();
            interval = (await raffle.getInterval()).toNumber();
        });

        describe('constructor', function() {
            it('Initializes the raffle correctly', async function() {
                expect(await raffle.getRaffleState()).to.be.equal(0);
                expect((await raffle.getInterval())).to.equal(networkConfig[network.name].interval);

            });
        });


        describe('enterRaffle', function() {
            it('reverts when you don\'t pay enough', async function() {
                await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(raffle, 'Raffle__NotEnoughETHEntered');
            });

            it('doesn\'t allow entrance when raffle is calculating', async function() {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send('evm_increaseTime', [interval + 1]); // change timestamp of next block to given value
                await network.provider.send('evm_mine', []); // hardhat auto-mines block with every call
                await raffle.performUpkeep([]); // that should change state to calculating...
                await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWithCustomError(raffle, 'Raffle__NotOpen');
            });

            it('records players when they enter', async function() {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                const playerFromContract = await raffle.getPlayer(0);
                expect(playerFromContract).to.equal(deployer);
            });

            it('emits event on enter', async function() {
                await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(raffle, 'RaffleEnter');
            });
        });

        describe('checkUpkeep', function() {
            it('returns false if people haven\'t sent any ETH', async function() {
                await network.provider.send('evm_increaseTime', [interval + 1]);
                // await network.provider.send('evm_mine', []); // hardhat auto-mines block with every call
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                expect(upkeepNeeded).to.be.false;
            });

            it('returns false if raffle isn\'t open', async function() {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send('evm_increaseTime', [interval + 1]);
                // await network.provider.send('evm_mine', []); // hardhat auto-mines block with every call
                await raffle.performUpkeep([]);
                const raffleState = await raffle.getRaffleState();
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                expect(raffleState).to.equal(1);
                expect(upkeepNeeded).to.be.false;
            });

            it('should return false if enough time hasn\'t passed', async function() {
                // disable automine to test timestamp dependent logic
                await network.provider.send('evm_setAutomine', [false]);

                await raffle.enterRaffle({ value: raffleEntranceFee });
                const latestTimestamp = await raffle.getLatestTimestamp();

                // mine new block and set it's timestamp so it doesn't exceed interval
                await network.provider.send('evm_mine', [latestTimestamp.toNumber() + interval - 1]);
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);

                expect(upkeepNeeded).to.be.false;
            });

            it('should return true if enough time has passed, has players, eth, and is open', async function() {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send('evm_increaseTime', [interval + 1]);
                await network.provider.send('evm_mine', []);
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                expect(upkeepNeeded).to.be.true;
            });

            it('should update the raffle state, emits an event, and calls the vrf coordinator', async function() {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send('evm_increaseTime', [interval + 1]);
                await network.provider.send('evm_mine', []);
                const transactionResponse = await raffle.performUpkeep([]);
                const transactionReceipt = await transactionResponse.wait(1);
                const requestId = transactionReceipt.events![1].args!.requestId;
                const raffleState = await raffle.getRaffleState();
                expect(requestId).to.be.greaterThan(0);
                expect(raffleState).to.equal(1);
            });
        });

        describe('fulfillRandomWords', function() {
            beforeEach(async function() {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send('evm_increaseTime', [interval + 1]);
                await network.provider.send('evm_mine', []);
            });

            it('should be called only after performUpkeep', async function() {
                await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith('nonexistent request');
                await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)).to.be.revertedWith('nonexistent request');
            });

            // way too big test
            it('should pick a winner, reset the lottery, and send money', async function() {
                const accounts = await ethers.getSigners();
                const additionalEntrants = 3;
                const startingAccoundIndex = 1;

                for (let i = startingAccoundIndex; i < startingAccoundIndex + additionalEntrants; i++) {
                    await raffle.connect(accounts[i]).enterRaffle({ value: raffleEntranceFee });
                }

                const startingTimestamp = await raffle.getLatestTimestamp();

                // performUpkeep (mock being chainlink keepers)
                // fulfillRandomWords (mock being the chainlink vrf)
                // we will have to wait for the fulfillRandomWords to be called
                await new Promise(async (resolve, reject) => {
                    raffle.once('WinnerPicked', async () => {
                        console.log('Found the evenet!');
                        try {
                            const winnerEndingBalance = await accounts[1].getBalance();
                            const raffleState = await raffle.getRaffleState();
                            const endingTimestamp = await raffle.getLatestTimestamp();
                            const numPlayers = await raffle.getNumberOfPlayers();
                            expect(numPlayers).to.equal(0);
                            expect(raffleState).to.equal(0);
                            expect(endingTimestamp).to.be.greaterThan(startingTimestamp);
                            expect(winnerEndingBalance.toString())
                                .to.equal(
                                winnerStartingBalance
                                    .add(raffleEntranceFee
                                        .mul(additionalEntrants)
                                        .add(raffleEntranceFee))
                                    .toString());
                        } catch (e) {
                            reject(e);
                        }
                        resolve({});
                    });

                    // setting up the listener
                    // below, we will fire the event, and the listener will pick it up, and resolve
                    const tx = await raffle.performUpkeep([]);
                    const txReceipt = await tx.wait(1);
                    const winnerStartingBalance = await accounts[1].getBalance();
                    await vrfCoordinatorV2Mock.fulfillRandomWords(txReceipt.events![1].args!.requestId, raffle.address);
                });
            });
        });
    });