// SPDX-License-Identifier: MIT

////////////////////////////////////////
/// Lesson 6: Hardhat Simple Storage ///
////////////////////////////////////////

pragma solidity ^0.8.0;

contract SimpleStorage {
    struct Person {
        uint256 favoriteNumber;
        string name;
    }

    uint256 internal favoriteNumber;
    Person[] public people;
    mapping(string => uint256) public nameToFavoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(Person({name : _name, favoriteNumber : _favoriteNumber}));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}