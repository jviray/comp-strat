import React from 'react';

import styles from './Landing.module.scss';

const Landing = () => {
  const { container, box } = styles;
  return (
    <main className="wrap">
      <div className={container}>
        <h3>Welcome, start farming $COMP now!</h3>
        <div className={box}>Must have Metamask installed to connect.</div>
      </div>
    </main>
  );
};

export default Landing;
