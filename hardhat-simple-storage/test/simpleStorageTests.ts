import { ethers } from 'hardhat';
import { expect, assert } from 'chai';

describe('SimpleStorage', () => {
    let simpleStorage;

    beforeEach(async function() {
        const simpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it('Should store 0 as favorite number after deploy', async function() {
        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), '0');
    });

    it('Should update when we call store', async function() {
        const expectedValue = '7';
        const transactionResponse = await simpleStorage.store(7);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        expect(currentValue.toString()).to.equal(expectedValue);
    });

    it('Should store person\'s favorite number', async function() {
        const transactionResponse = await simpleStorage.addPerson('John', 2);
        await transactionResponse.wait(1);

        const johnsFavoriteNumber = await simpleStorage.nameToFavoriteNumber('John');
        expect(johnsFavoriteNumber.toString()).to.equal('2');
    })
});
