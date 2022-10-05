const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {

  //Deploy token  
 await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed()

//Transfer all the Tokens to EthSwap
await token.transfer(ethSwap.address, '1000000000000000000000000')
};