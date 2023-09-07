// require smart contract
const TodoList = artifacts.require("./TodoList.sol");

// accounts will be all the accounts in ganache, an array
contract("Todolist", (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed();
  });

  it("deploys successfully", async () => {
    const address = this.todoList.address;
    // check it's not empty, smart contract is actually put on the blockchain
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("lists tasks", async () => {
    // 有括号的是state variable
    const taskCount = await this.todoList.taskCount();
    // make sure task exist at the taskCount index
    const task = await this.todoList.tasks(taskCount);
    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "My Next Step");
    assert.equal(task.completed, false);
    assert.equal(taskCount.toNumber(), 1);
  });

  it("create tasks", async () => {
    const result = await this.todoList.createTask("A New Task");
    const taskCount = await this.todoList.taskCount();
    assert.equal(taskCount, 2);

    // check taskcreated event is triggered, event contain in result
    // Do we need to delete this once we have another round? probably in test mode, should be fine
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 2);
    assert.equal(event.content, "A New Task");
    assert.equal(event.completed, false);
  });
});
