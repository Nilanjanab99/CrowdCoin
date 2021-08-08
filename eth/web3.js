import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined') {
    //In the browser
    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
}
else {
    //On the server
    const provider = new Web3.providers.HttpProvider(
        'https://kovan.infura.io/v3/19b85f951b5a4440923fa8f61eb27245');
    web3 = new Web3(provider);
}

export default web3;
