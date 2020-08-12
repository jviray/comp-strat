import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import web3 from './ethereum/web3';

import compStratContract from './ethereum/compStrat';
import daiContract, { address as daiAddress } from './ethereum/dai';
import { address as cDaiAddress } from './ethereum/cDai';
import Header from './components/Header';
import Landing from './components/Landing';
import Home from './components/Home';

class App extends Component {
  state = {
    accountAddr: '',
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();

    this.setState({ accountAddr: accounts[0] });

    // Checks for account changes in Metamask and updates accordingly
    setInterval(async () => {
      const accounts = await web3.eth.getAccounts();
      if (this.state.accountAddr !== accounts[0]) {
        window.location.reload();
        this.setState({
          accountAddr: accounts[0],
        });
      }
    }, 1000);
  }

  render() {
    return (
      <Router>
        <div>
          <Header account={this.state.accountAddr} />

          {/* Should re-route back to  */}

          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/dashboard" component={Home} />
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
