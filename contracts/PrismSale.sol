// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PrismSale {

  uint public totalSales;
  uint public maxSales;

  address public owner;
  address public charity;

  mapping (address => bool) sales;

  constructor() {
    totalSales = 0;
    maxSales = 100;

    owner = msg.sender;
    charity = 0xfA045B2F2A25ad0B7365010eaf9AC2Dd9905895c;
  }

  function canBuy () public view returns (bool) {
    return totalSales < maxSales;
  }

  function hasAccess () public view returns (bool) {
    return sales[msg.sender];
  }

  function buy () public payable returns (bool) {
    require(canBuy() == true, "can't buy this");
    require(msg.value == 0.01 ether, "you didn't send the correct amount");
    require(hasAccess() == false, "already bought");

    payable(owner).transfer(msg.value * 80 / 100);
    payable(charity).transfer(msg.value * 20 / 100);

    totalSales = totalSales + 1;

    sales[msg.sender] = true;

    return true;
  }
}
