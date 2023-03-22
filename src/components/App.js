import React, { Component } from "react";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //console.log(window.web3)
  }

  //Loaing Blockchain Data
  async loadBlockchainData() {
    const web3 = window.web3;

    //Get Address
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log("Address:" + this.state.account);

    //Get Ether Balance
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance });
    console.log("Eth Balance:" + this.state.ethBalance);

    //Load Token
    const networkid = await web3.eth.net.getId();
    const tokenData = Token.networks[networkid];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address); //loading contract Token
      this.setState({ token: token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call(); //getting token balance of address connected
      this.setState({ tokenBalance: tokenBalance.toString() });
      console.log("Token Balance:", tokenBalance.toString());
      console.log(this.state.token);
    }

    //Load EthSwap
    const ethSwapData = EthSwap.networks[networkid];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address); //loading contract EthSwap
      this.setState({ ethSwap: ethSwap });
      console.log(ethSwap);
      console.log(ethSwapData.address);
    } else {
      window.alert("EthSwap Contract not deployed to detected network");
    }
    this.setState({ loading: false });
    console.log(this.state.loading);
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.currentProvider);
    } else {
      window.alert("No Ethereum Browser detected, try Metamask!");
    }
  }

  //Get Token Balance
  tokenBal = (account) => {
    const bal = this.state.token.methods.balanceOf(account).call();
    this.setState({ tokenBalance: bal });
  };

  //BuyTokens function
  buyTokens = (etherAmount) => {
    try {
      this.setState({ loading: true });
      console.log(etherAmount);
      this.state.ethSwap.methods
        .buyTokens()
        .send({
          value: etherAmount,
          from: this.state.account,
          gas: 50000,
          gasPrice: null,
        })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
          console.log(this.buyTokens);
        });
    } catch (error) {
      console.log("Couldn't buy tokens because of an error", error);
    }
  };

  //SellTokens function
  sellTokens = (tokenAmount) => {
    try {
      this.setState({ loading: true });
      console.log(tokenAmount);
      this.state.token.methods
        .approve(this.state.ethSwap.address, tokenAmount)
        .send({
          from: this.state.account,
        })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
          console.log(this.buyTokens);
        });

      this.state.ethSwap.methods
        .sellTokens(tokenAmount)
        .send({
          from: this.state.account,
          gas: 70000,
        })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
          console.log(this.buyTokens);
        });
    } catch (error) {
      console.log("Couldn't sell tokens because of an error", error);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethSwap: {},
      ethBalance: "0",
      tokenBalance: "",
      loading: true,
    };
  }
  render() {
    let content;
    if (this.state.loading) {
      content = <p className="loading">Loading...</p>;
    } else {
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />
      );
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
