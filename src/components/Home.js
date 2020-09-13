import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import web3 from '../ethereum/web3';
import compStratContract, {
  address as compStratAddr,
} from '../ethereum/compStrat';
import daiContract from '../ethereum/dai';
import cDaiContract from '../ethereum/cDai';
import styles from './Home.module.scss';

class Home extends Component {
  state = {
    authorized: false,
    accountAddr: '',
    cDaiBalance: '',
    daiInput: '',
    isLoading: false,
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();

    this.setState({ accountAddr: accounts[0] });

    const allowance = await daiContract.methods
      .allowance(accounts[0], compStratAddr)
      .call();

    if (allowance >= 100000000000000000) {
      this.setState({ authorized: true });
    }

    // const cDaiBalance = await cDaiContract.methods
    //   .balanceOf(compStratAddr)
    //   .call();

    const cDaiBalance = await compStratContract.methods
      .cDaiBalances(accounts[0])
      .call();

    this.setState({
      cDaiBalance,
    });
  }

  approveContract = async (evt) => {
    evt.preventDefault();
    try {
      await daiContract.methods
        .approve(compStratAddr, web3.utils.toWei('1000000000000'))
        .send({
          from: this.state.accountAddr,
        });

      this.setState({ authorized: true });
    } catch (err) {}

    window.location.reload();
  };

  handleSubmut = async (evt) => {
    evt.preventDefault();

    this.setState({ isLoading: true });

    try {
      await compStratContract.methods
        .supplyDai(web3.utils.toWei(this.state.daiInput))
        .send({
          from: this.state.accountAddr,
        });
    } catch (err) {}

    this.setState({ daiInput: '', isLoading: false });
    window.location.reload();
  };

  render() {
    const { formContainer, form, formGroup, btn, status, authLink } = styles;

    if (!this.state.accountAddr && this.state.accountAddr == null) {
      return <Redirect to="/" />;
    }

    return (
      <main className="wrap">
        <div className={formContainer}>
          <h2>Supply Dai to Compound</h2>

          <form className={form} onSubmit={this.handleSubmut}>
            <div className={formGroup}>
              <label>
                <div>
                  Your cDAI Token Balance: {this.state.cDaiBalance / 1e8}
                </div>
                {this.state.authorized ? (
                  <div className={status}>Authorized</div>
                ) : (
                  <button
                    className={authLink}
                    onClick={(evt) => this.approveContract(evt)}
                  >
                    Authorize Contract
                  </button>
                )}
              </label>
              <input
                disabled={this.state.isLoading || !this.state.authorized}
                value={this.state.daiInput}
                onChange={(evt) =>
                  this.setState({ daiInput: evt.target.value })
                }
                placeholder={
                  this.state.authorized
                    ? 'Enter an amount of DAI'
                    : 'Contract is not authorized to accept DAI'
                }
              />
            </div>
            <button className={btn} type="submit">
              {!this.state.isLoading ? (
                'Submit'
              ) : (
                <ClipLoader
                  size={18}
                  color={'#fff'}
                  loading={this.state.loading}
                />
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }
}

export default Home;
