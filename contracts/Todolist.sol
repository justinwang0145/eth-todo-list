pragma solidity ^0.5.0;

contract Todolist {
    // keep track number of tasks in todolist, store this value in smart contract 
    // declare special kind of variable, state variable actually written to blockchain, represent state of smart contract on blockchain.
    // public: way to read this value from smart contract, provide some function for us to read the value 
    // That's all we have for smart contract -> go test, deploy to blockchain, make sure everything work!
    uint public taskCount = 1;

}