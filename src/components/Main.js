import React, { Component } from 'react'
import BuyForm from './BuyForm';


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0',
      
      
    }
  }
 
  render() {
    return (
     <div id='contect'>
      <div className='card mb-4'>
        <div className='card-body'>
          <BuyForm ethBalance = {this.props.ethBalance}
           tokenBalance = {this.props.tokenBalance}
           buyTokens = {this.BuyTokens} />
        </div>
      </div>
     </div>
    );
  }
}

export default Main;