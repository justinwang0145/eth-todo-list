App = {
  loading: false,
  contracts: {},
  load: async () => {
    // load web3 library in order to connect with blockchain
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    // This error appears when you do not have a defaultAccount property set in the web3.eth object. Need this one
    web3.eth.defaultAccount = App.account;
  },

  // Todolist application backed by blockchain, connect to it to use it
  // Connect browser to blockchain: metamask
  // Client-side app to blockchain: web3js
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      // console.log("Hello World!", window.web3);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    // web3 setby loadWeb3, eth object contains all the accounts
    App.account = web3.eth.accounts[0];
    // console.log(App.account);
  },

  loadContract: async () => {
    // pull out smart contract json file
    const todoList = await $.getJSON("Todolist.json");

    // create a truffle contract: JS representation of smart contract allow us to call the function
    // Create a wrapper by truffle
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // Get a DEPLOYED copy of smart contract
    App.todoList = await App.contracts.TodoList.deployed();
    // console.log(todoList);
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true);

    // show accounts:
    $("#account").html(App.account);

    // render tasks:
    await App.renderTasks();

    // Update loading state
    App.setLoading(false);
  },

  // fill in the task by rendering them
  renderTasks: async () => {
    // load the task count from blockchain
    const taskCount = await App.todoList.taskCount();

    // fetch template
    const $taskTemplate = $(".taskTemplate");

    // render out each task with task template
    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      // create html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // show the task
      $newTaskTemplate.show();
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val();

    // Call smart contract function
    await App.todoList.createTask(content);

    window.location.reload();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    await App.todoList.toggleCompleted(taskId);
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
