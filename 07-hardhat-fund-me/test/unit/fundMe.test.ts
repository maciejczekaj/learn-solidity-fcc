import { FundMe } from '../../typechain-types';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { Contract } from 'ethers';
import * as assert from 'assert';
import { expect } from 'chai';
import { developmentChains } from '../../helper-hardhat.config';

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', function () {
          let fundMe: FundMe;
          let deployer: Address;
          let mockV3Aggregator: Contract;
          const sendValue = ethers.utils.parseEther('2');

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture('all');
              fundMe = await ethers.getContract('FundMe', deployer);
              mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer);
          });

          describe('constructor', function () {
              it('sets the aggregator address correctly', async function () {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });

          describe('fund', function () {
              it("fails If you don't send enouth ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWithCustomError(fundMe, 'FundMe__NotEnoughFund');
              });

              it('updated the amount funded data structure', async function () {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(deployer);
                  assert.equal(response.toString(), sendValue.toString());
              });

              it('adds funder to array of funders', async function () {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunder(0);
                  assert.equal(funder, deployer);
              });
          });

          describe('withdraw', function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue });
              });

              it('withdraw ETH from a single funder', async function () {
                  const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingFundMeBalance.add(startingDeployerBalance).toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });

              it('withdraw ETH with multiple funders', async function () {
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      await fundMe.connect(accounts[i]).fund({ value: sendValue });
                  }

                  const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingFundMeBalance.add(startingDeployerBalance).toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
                  await expect(fundMe.getFunder(0)).to.be.reverted;
                  for (let i = 1; i < 6; i++) {
                      expect(await fundMe.getAddressToAmountFunded(accounts[i].address)).to.equal(0);
                  }
              });

              it('only allows the owner to withdraw', async function () {
                  const [, attacker] = await ethers.getSigners();
                  await expect(fundMe.connect(attacker).withdraw()).to.be.revertedWithCustomError(
                      fundMe,
                      'FundMe__NotOwner'
                  );
              });
          });
      });
