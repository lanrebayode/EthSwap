import { assert } from "chai"
import Web3 from "web3"
import { contracts_build_directory } from "../truffle-config"

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
.use(require ('chai-as-promised'))
.should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

let investor = 0x33BCb002eE83917558B69da7e19e22E90591CC04
contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap
    before(async() => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        //Transfer all 1Millioin Tokens
        await token.transfer(ethSwap.address, '1000000000000000000000000')
    })

    describe('EthSwap deployment', async() => {
        it('contract has a name', async() => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

    })
    describe('Token deployment', async() => {
        it('contract has a name', async() => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
 
it('contract has tokens', async() => {
    let balance = await token.balanceOf(ethSwap.address)
    assert.equal(balance.toString(), '1000000000000000000000000')
})

    })
 describe('buyTokens', async() => {
    let result
    before(async() => {
        //Purchase tokens before each exaple
    result = await ethSwap.buyTokens({from: investor, value:web3.utils.toWei('1', 'Ether')})
    })
    it('Allows users to instantly purchase tokens at a fixed price', async() => {
    let investorBalance = await token.balanceOf(investor)
    assert.equal(investorBalance.toString(), tokens('100'))

    //Check ethSwap Balance after purchase
    let ethSwapBalance 
     ethSwapBalance = await token.balanceOf(ethSwap.address)
   assert.equal(ethSwapBalance.toString(), tokens('999900'))
    ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
   // assert.isAbove(ethSwapBalance.toString(), tokens.toString('100'))
    assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))
    
    //console.log(result.logs[0].args)
    const event = result.logs[0].args
    assert.equal(event.account, investor)
    assert.equal(event.token, token.address)
    assert.equal(event.amount.toString(), tokens('100').toString())
    assert.equal(event.rate.toString(), '100')
    
      
    })
 })

 describe('sellTokens()', async() => {
    let result
    before(async() => {
        //seller must approve the token transfer
        await token.approve(ethSwap.address, tokens('100'), {from: investor})
        //transfer of the token the ethSwap
        result = await ethSwap.sellTokens(tokens('100'), {from: investor})
    })
    it('It allows users sell Token at a fixed amount', async() => {
        let investorBalance = await token.balanceOf(investor)
        assert.equal(investorBalance.toString(), tokens('0'))

        let ethSwapBalance 
        ethSwapBalance = await token.balanceOf(ethSwap.address)
        assert.equal(ethSwapBalance.toString(), tokens('1000000'))
        ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
        assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

        console.log(result.logs[0].args)
        const event = result.logs[0].args
       // assert.equal(event.address, ethSwap.address)
        assert.equal(event.amount.toString(), tokens('100') )
       
    })
 })

})
