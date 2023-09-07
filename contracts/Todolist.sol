pragma solidity ^0.5.0;

contract Todolist {
    // keep track number of tasks in todolist, store this value in smart contract 
    // declare special kind of variable, state variable actually written to blockchain, represent state of smart contract on blockchain.
    // public: way to read this value from smart contract, provide some function for us to read the value 
    // That's all we have for smart contract -> go test, deploy to blockchain, make sure everything work!
    uint public taskCount = 0;
    
    // way to model the task list: struct
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    // need a place to put those tasks, in storage on blockchain
    // create another state variable, like an associative array & hash
    // first type is key, second type is data
    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content, 
        bool completed
    );

    // Now we need to define a way to put task in database
    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);

        // broadcast an event that this task is created.
        // Solidity allow us to create an event that are triggered when something happen in smart contract
        // in Client-Side Application, we can subscribe those events 
        emit TaskCreated(taskCount, _content, false);
        
    }

    // Populate our list so when call it up at client side, already have some items for us
    // add task to list whenever smart contract is deployed, constructor function
    constructor() public {
        createTask("My Next Step");
    }

}