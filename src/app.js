App = {
  load: async () => {
    // load web3 library in order to connect with blockchain
    await App.loadWeb3();
    await App.loadAccount();
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
      console.log("Hello World!", window.web3);
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
    console.log(App.account);
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
