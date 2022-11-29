pragma solidity >=0.4.21 <0.6.0;
import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event soldTokens(address user, uint256 amount, uint256 rate);

    constructor(Token _token) public payable {
        token = _token;
    }

    function buyTokens() public payable {
        //Redemption rate is amount of DApp token per Eth
        rate;
        //calculate number of tokes to buy
        uint256 tokenAmount = msg.value * rate;
        //Require that EthSWap has enough Token the buyer wants to buy
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public payable {
        require(token.balanceOf(msg.sender) >= _amount);
        uint256 etherAmount;
        etherAmount = _amount / rate;
        require(address(this).balance >= etherAmount);
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
        emit soldTokens(msg.sender, _amount, rate);
    }
}
