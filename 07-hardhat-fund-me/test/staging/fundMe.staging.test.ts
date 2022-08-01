import { ethers, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat.config';
import { FundMe } from '../../typechain-types';
import { assert } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', async function () {
          let fundMe: FundMe;
          let deployer: SignerWithAddress;
          const sendValue = ethers.utils.parseEther('0.2');

          beforeEach(async function () {
              deployer = (await ethers.getSigners())[0];
              fundMe = await ethers.getContract('FundMe', deployer.address);
          });

          it('allows people to fund and withdraw', async function () {
              await fundMe.fund({ value: sendValue, gasLimit: 100000 });
              await fundMe.withdraw({ gasLimit: 100000 });

              const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
              assert.equal(endingFundMeBalance.toString(), '0');
          });
      });
