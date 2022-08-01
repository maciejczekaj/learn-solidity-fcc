// SPDX-License-Identifier: MIT

////////////////////////////////
/// Lesson 7: Hardhat Fund Me //
////////////////////////////////

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Address for Rinkeby
library PriceConverter {
    function getPrice(AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        (,int256 price,,,) = _priceFeed.latestRoundData();
        return uint256(price * 1e10);
        // ETH in terms of USD
    }

    // How much worth in USD is passed eth
    function getConversionRate(uint256 ethAmount, AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(_priceFeed);
        return (ethPrice * ethAmount) / 1e18;
    }
}