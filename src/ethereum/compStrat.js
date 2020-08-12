import web3 from './web3';
import CompStrat from './CompStrat.json';

// Enter address of deployed Dapp:
export const address = '0x23a2BCf91Af5947b248E1F5FA4A92e1DEC8B45dE';

const instance = new web3.eth.Contract(
  JSON.parse(CompStrat.interface),
  address
);

export default instance;
