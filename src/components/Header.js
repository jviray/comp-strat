import React, { Component } from 'react';

import styles from './Header.module.scss';

class Header extends Component {
  renderButton() {
    if (!this.props.account) {
      return (
        <a className={styles.btn} href="https://metamask.io/" target="_blank">
          Install Metamask
        </a>
      );
    } else {
      return (
        <a className={styles.btn} href="/dashboard">
          Connect
        </a>
      );
    }
  }

  renderHeader() {
    if (window.location.pathname === '/dashboard') {
      return (
        <div className={styles.info}>
          <p>{this.props.account}</p>
        </div>
      );
    } else {
      return this.renderButton();
    }
  }

  render() {
    const { navbar, appName } = styles;
    return (
      <nav className={navbar}>
        <div className="wrap flex space-between align-center">
          <div className={appName}>
            <a href="/">
              <h1>$COMP Strategy</h1>
            </a>
          </div>
          <div>{this.renderHeader()}</div>
        </div>
      </nav>
    );
  }
}

export default Header;
