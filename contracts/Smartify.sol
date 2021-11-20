// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Smartify {
  string public smartifySays;
  address public owner;
  address public creator;
  uint256 public lastSaleAmount;

  constructor(string memory _smartifySays) public{
    smartifySays = _smartifySays;

    creator = msg.sender;
     owner = msg.sender;


  }

  function buy()  public payable{
    require(msg.value > lastSaleAmount, "You are cheap! pay more!");
    owner = msg.sender;
    lastSaleAmount = msg.value;
  }

  function setSmartifySays(string memory text) public{
    require(msg.sender == owner, "You are NOT my owner!");
      smartifySays = text;
  }


// Get all the balance inside the smart contract but only from owner
  function claim() public {
    require(msg.sender == creator, "You are NOT my creator!");
  }



}
