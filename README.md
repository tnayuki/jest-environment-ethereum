# jest-environment-ethereum &middot; [![npm version](https://img.shields.io/npm/v/jest-environment-ethereum.svg)](https://www.npmjs.com/package/jest-environment-ethereum)

Run your tests using Jest under clean Ethereum blockchain powered by Ganache.

## Install

Install dependencies.

```shell
npm install --save-dev jest-environment-ethereum [web3 or ethers]
```

Add to your Jest config.

```json
{
  "testEnvironment": "ethereum",
  "testEnvironmentOptions": {
      "injectWeb3Provider": true
  }
}
```

## Usage

Use Ethereum blockchain with injected provider in your tests:

```javascript
test('transfer balance', async () => {
    const unlockedAccounts = web3.eth.getAccounts();
    const newAccount = web3.eth.accounts.create();

    await web3.eth.sendTransaction({
      from: unlockedAccounts[0],
      to: newAccount.address,
      value: '1000000000000000000'
    })

    expect(web3.eth.getBalance(newAccount.address)).toBe('1000000000000000000');
});
```

## Options

### injectWeb3Provider

If true, inject a Web3 provider connected to test Ethereum blockchain as `global.web3`.

### injectEthersProvider

If true, inject a Ethers.js provider connected to test Ethereum blockchain as `global.ethersProvider`.
