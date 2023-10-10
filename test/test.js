const chai = require("chai");
const expect = chai.expect;
const CryptoPaymentSystem = require("../cryptoCurrencies/cryptoPayment");
const fs = require("fs");
const path = require("path");
const Cryptor = require("../cryptoCurrencies/crypto");
const helper = require("./helper");

const btcWallet = {
  privateKey:
    "aa5b18308f8576d4520559649d95c1cd7ab4d22e48415cb0d891ad78cf296dd2",
  address: "myNeUWabCGwNHsLFfof3CJyCigmRpWYAiN",
};

const evmWallet = {
  address: "0x59772e95C77Dd1575fB916DACDFabEF688cc7971",
  privateKey:
    "232f567845d6c965ba1212522ca590cf0bf7473df0b02f67d227be7ab91b8ad2",
};

const privKeyForUsersWallet = fs.readFileSync(
  path.resolve(
    __dirname,
    "../cryptoCurrencies/cryptoKey/privateKey_2023-09-06_13:17:26.pem"
  ),
  "utf8"
);

const privKeyForUsersWalletAndDate = {
  privateKey: privKeyForUsersWallet,
  date: "2023-09-06T13:17:26",
};

const crypto = new Cryptor(false);
const encryptBtcPrivKey = crypto.encrypt(btcWallet.privateKey);
const encryptEvmPrivKey = crypto.encrypt(evmWallet.privateKey);
const encryptPrivKeyForUsersWallet = crypto.encrypt(
  privKeyForUsersWalletAndDate
);

let cryptoPayment;
let user;

// describe("setup crypto payment", async () => {
//   before(async () => {
//     try {
//       cryptoPayment = new CryptoPaymentSystem(false);
//       await cryptoPayment.init(
//         encryptPrivKeyForUsersWallet,
//         encryptBtcPrivKey,
//         encryptEvmPrivKey,
//         encryptEvmPrivKey
//       );
//       await cryptoPayment.listenToNewUsers();
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   it("check private key is correct", async () => {
//     const _privateKeyForUsersWalletKey =
//       cryptoPayment._privateKeyForUsersWallet.privateKey;
//     const _privKeyBtcForUsersToWithdraw =
//       cryptoPayment._privKeyBtcForUsersToWithdraw;
//     const _privKeyEvmForUsersToWithdraw =
//       cryptoPayment._privKeyEvmForUsersToWithdraw;
//     const _privKeyEvmToSendFee = cryptoPayment._privKeyEvmToSendFee;
//     expect(_privateKeyForUsersWalletKey).to.equal(privKeyForUsersWallet);
//     expect(_privKeyBtcForUsersToWithdraw).to.equal(btcWallet.privateKey);
//     expect(_privKeyEvmForUsersToWithdraw).to.equal(evmWallet.privateKey);
//     expect(_privKeyEvmToSendFee).to.equal(evmWallet.privateKey);
//   });

//   it("check listen to new user is correct", async () => {
//     expect(cryptoPayment._usersMap.size).to.equal(10);
//     expect(cryptoPayment._btcAddrMap.size).to.equal(10);
//     expect(cryptoPayment._evmNativeAddrMap.size).to.equal(10);
//     expect(cryptoPayment._evmErc20AddrMap.size).to.equal(10);

//     await helper.insertFakeUsers(10);

//     setTimeout(() => {
//       expect(cryptoPayment._usersMap.size).to.equal(20);
//       expect(cryptoPayment._usersMap.size).to.equal(20);
//       expect(cryptoPayment._usersMap.size).to.equal(20);
//       expect(cryptoPayment._usersMap.size).to.equal(20);
//     }, 5 * 1000);
//   });

//   // it('delete fake users', async () => {
//   //   await helper.deleteFakeUser()
//   // })
// });

const listentouserdepositevmnativetokentestnet = "";

// describe("listen to user deposit evm native token testnet", async () => {
//   before(async () => {
//     try {
//       cryptoPayment = new CryptoPaymentSystem(false);
//       await cryptoPayment.init(
//         encryptPrivKeyForUsersWallet,
//         encryptBtcPrivKey,
//         encryptEvmPrivKey,
//         encryptEvmPrivKey
//       );
//       await cryptoPayment.listenToNewUsers();
//       await cryptoPayment.listenToEvmNativeTx("eth");
//       await cryptoPayment.listenToEvmNativeTx("bnb");
//       await cryptoPayment.listenToEvmNativeTx("matic");
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   // 10 reason increase unUpdateTxs: getConnection, beginTransaction, updateUserBalance, updateAccountBalance, commit, isWithdrawing, unexpected + 3 rollBack Error
//   // 1 reason to increase unProcessBlockNativeEth: getBlockCaughtError,
//   it("ETH", async () => {
//     const user = cryptoPayment._usersMap.get(1);

//     const getUser1EthWalletBalance =
//       await cryptoPayment._eth.getNativeTokenBalance(user.evm_native_address);

//     const user1BalanceMapBeforeSend = parseFloat(user.eth_balance);
//     const user1EthWalletBalance = getUser1EthWalletBalance?.status
//       ? parseFloat(getUser1EthWalletBalance?.data)
//       : 0;
//     expect(parseFloat(user1EthWalletBalance.toFixed(4))).to.equal(
//       user1BalanceMapBeforeSend
//     );

//     const amountEthToSend = 0.01;
//     const sendEthToUser1Address = await cryptoPayment._eth.sendNativeToken(
//       cryptoPayment._privKeyEvmForUsersToWithdraw,
//       user.evm_native_address,
//       amountEthToSend
//     );
//     expect(sendEthToUser1Address.status).to.equal(true);
//     expect(parseFloat(sendEthToUser1Address?.data?.amount)).to.equal(
//       amountEthToSend
//     );
//     setTimeout(async () => {
//       try {
//         console.log("start set time out ETH");
//         const getUser1EthWalletBalanceAfterSend =
//           await cryptoPayment._eth.getNativeTokenBalance(
//             user.evm_native_address
//           );
//         const getUsersDbBalance = await helper.getUserBalance(user.email);

//         const user1BalanceMapAfterSend = parseFloat(user.eth_balance);
//         const userDbBalanceAfterSend = parseFloat(
//           getUsersDbBalance.eth_balance
//         );
//         const user1EthWalletBalanceAfterSend =
//           getUser1EthWalletBalanceAfterSend?.status
//             ? parseFloat(getUser1EthWalletBalanceAfterSend?.data)
//             : 0;

//         expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
//         expect(user1BalanceMapAfterSend).to.equal(
//           parseFloat(user1EthWalletBalanceAfterSend.toFixed(4))
//         );
//         expect(userDbBalanceAfterSend).to.equal(
//           parseFloat(user1EthWalletBalanceAfterSend.toFixed(4))
//         );
//         expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(0);

//         console.log("finish set time out ETH");
//       } catch (error) {
//         console.log(error.message);
//       }
//     }, 60000);
//   });

//   it("BNB", async () => {
//     const user = cryptoPayment._usersMap.get(1);

//     const getUser1EthWalletBalance =
//       await cryptoPayment._bnb.getNativeTokenBalance(user.evm_native_address);

//     const user1BalanceMapBeforeSend = parseFloat(user.bnb_balance);
//     const user1EthWalletBalance = getUser1EthWalletBalance?.status
//       ? parseFloat(getUser1EthWalletBalance?.data)
//       : 0;
//     expect(parseFloat(user1EthWalletBalance.toFixed(4))).to.equal(
//       user1BalanceMapBeforeSend
//     );

//     const amountEthToSend = 0.01;
//     const sendEthToUser1Address = await cryptoPayment._bnb.sendNativeToken(
//       cryptoPayment._privKeyEvmForUsersToWithdraw,
//       user.evm_native_address,
//       amountEthToSend
//     );
//     expect(sendEthToUser1Address.status).to.equal(true);
//     expect(parseFloat(sendEthToUser1Address?.data?.amount)).to.equal(
//       amountEthToSend
//     );
//     setTimeout(async () => {
//       try {
//         console.log("start set time out BNB");
//         const getUser1EthWalletBalanceAfterSend =
//           await cryptoPayment._bnb.getNativeTokenBalance(
//             user.evm_native_address
//           );
//         const getUsersDbBalance = await helper.getUserBalance(user.email);

//         const user1BalanceMapAfterSend = parseFloat(user.bnb_balance);
//         const userDbBalanceAfterSend = parseFloat(
//           getUsersDbBalance.bnb_balance
//         );
//         const user1EthWalletBalanceAfterSend =
//           getUser1EthWalletBalanceAfterSend?.status
//             ? parseFloat(getUser1EthWalletBalanceAfterSend?.data)
//             : 0;

//         expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
//         expect(user1BalanceMapAfterSend).to.equal(
//           parseFloat(user1EthWalletBalanceAfterSend.toFixed(4))
//         );
//         expect(userDbBalanceAfterSend).to.equal(
//           parseFloat(user1EthWalletBalanceAfterSend.toFixed(4))
//         );
//         expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(0);

//         console.log("finish set time out BNB");
//       } catch (error) {
//         console.log(error.message);
//       }
//     }, 30000);
//   });

//   it("MATIC", async () => {
//     const user = cryptoPayment._usersMap.get(1);

//     const getUser1EthWalletBalance =
//       await cryptoPayment._matic.getNativeTokenBalance(user.evm_native_address);

//     const user1BalanceMapBeforeSend = parseFloat(user.matic_balance);
//     const user1EthWalletBalance = getUser1EthWalletBalance?.status
//       ? parseFloat(getUser1EthWalletBalance?.data)
//       : 0;
//     expect(parseFloat(user1EthWalletBalance.toFixed(4))).to.equal(
//       user1BalanceMapBeforeSend
//     );

//     const amountEthToSend = 0.01;
//     const sendEthToUser1Address = await cryptoPayment._matic.sendNativeToken(
//       cryptoPayment._privKeyEvmForUsersToWithdraw,
//       user.evm_native_address,
//       amountEthToSend
//     );
//     expect(sendEthToUser1Address.status).to.equal(true);
//     expect(parseFloat(sendEthToUser1Address?.data?.amount)).to.equal(
//       amountEthToSend
//     );
//     setTimeout(async () => {
//       try {
//         console.log("start set time out MATIC");
//         const getUser1EthWalletBalanceAfterSend =
//           await cryptoPayment._matic.getNativeTokenBalance(
//             user.evm_native_address
//           );
//         const getUsersDbBalance = await helper.getUserBalance(user.email);

//         const user1BalanceMapAfterSend = parseFloat(user.matic_balance);
//         const userDbBalanceAfterSend = parseFloat(
//           getUsersDbBalance.matic_balance
//         );
//         const user1EthWalletBalanceAfterSend =
//           getUser1EthWalletBalanceAfterSend?.status
//             ? parseFloat(getUser1EthWalletBalanceAfterSend?.data)
//             : 0;

//         expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
//         expect(user1BalanceMapAfterSend).to.equal(
//           parseFloat(user1EthWalletBalanceAfterSend.toFixed(4))
//         );
//         expect(userDbBalanceAfterSend).to.equal(
//           parseFloat(user1EthWalletBalanceAfterSend.toFixed(4))
//         );
//         expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(0);

//         console.log("finish set time out MATIC");
//       } catch (error) {
//         console.log(error.message);
//       }
//     }, 30000);
//   });
// });

const listentouserdepositerc20tokentestnet = "";

// describe("listen to user deposit erc20 token testnet", async () => {
//   before(async () => {
//     try {
//       cryptoPayment = new CryptoPaymentSystem(false);
//       await cryptoPayment.init(
//         encryptPrivKeyForUsersWallet,
//         encryptBtcPrivKey,
//         encryptEvmPrivKey,
//         encryptEvmPrivKey
//       );
//       await cryptoPayment.listenToNewUsers();
//       await cryptoPayment.listenToEvmErc20Tx("eth", "usdt");
//       await cryptoPayment.listenToEvmErc20Tx("eth", "usdc");
//       await cryptoPayment.listenToEvmErc20Tx("bnb", "usdt");
//       await cryptoPayment.listenToEvmErc20Tx("bnb", "usdc");
//       await cryptoPayment.listenToEvmErc20Tx("matic", "usdt");
//       await cryptoPayment.listenToEvmErc20Tx("matic", "usdc");
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   const testDepositErc20 = async (cryptoSys, network, tokenName) => {
//     if (!["eth", "bsc", "matic"].includes(network))
//       throw Error("network incorrct");
//     const evm =
//       network == "eth"
//         ? cryptoSys._eth
//         : network == "bsc"
//         ? cryptoSys._bnb
//         : network == "matic"
//         ? cryptoSys._matic
//         : null;
//     const user = cryptoSys?._usersMap.get(1);
//     const user1Erc20MapBalance = user[`${tokenName}_${network}_balance`];
//     const getUser1Erc20Balance = await evm.getTokenBalance(
//       user[`evm_erc20_address`],
//       tokenName
//     );
//     const user1Erc20WalletBalance = getUser1Erc20Balance?.data;

//     expect(user1Erc20MapBalance).to.equal(user1Erc20WalletBalance);

//     const amountErc20ToSend = 10;
//     const sendErc20ToUser1Address = await evm.sendToken(
//       evmWallet.privateKey,
//       user[`evm_erc20_address`],
//       tokenName,
//       amountErc20ToSend
//     );
//     expect(sendErc20ToUser1Address.status).to.equal(true);

//     setTimeout(async () => {
//       try {
//         console.log("start set time out on", `${tokenName}_${network}`);
//         const getUser1Erc20WalletBalanceAfterSend = await evm.getTokenBalance(
//           user[`evm_erc20_address`],
//           tokenName
//         );
//         const getUsersDbBalance = await helper.getUserBalance(user.email);

//         const user1BalanceMapAfterSend = parseFloat(
//           user[`${tokenName}_${network}_balance`]
//         );
//         const userDbBalanceAfterSend = parseFloat(
//           getUsersDbBalance[`${tokenName}_${network}_balance`]
//         );
//         const user1Erc20WalletBalanceAfterSend = parseFloat(
//           getUser1Erc20WalletBalanceAfterSend?.data
//         );

//         expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
//         expect(userDbBalanceAfterSend).to.equal(
//           user1Erc20WalletBalanceAfterSend
//         );
//         expect(user1BalanceMapAfterSend).to.equal(
//           user1Erc20WalletBalanceAfterSend
//         );
//         expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(0);
//         console.log("finish set time out on", `${tokenName}_${network}`);
//       } catch (error) {
//         console.log(error.message);
//       }
//     }, 10000);
//   };

//   it("usdt_eth", async () =>
//     await testDepositErc20(cryptoPayment, "eth", "usdt"));

//   it("usdc_eth", async () =>
//     await testDepositErc20(cryptoPayment, "eth", "usdc"));

//   it("usdt_bnb", async () =>
//     await testDepositErc20(cryptoPayment, "bsc", "usdt"));

//   it("usdc_bnb", async () =>
//     await testDepositErc20(cryptoPayment, "bsc", "usdc"));

//   it("usdt_matic", async () =>
//     await testDepositErc20(cryptoPayment, "matic", "usdt"));

//   it("usdc_matic", async () =>
//     await testDepositErc20(cryptoPayment, "matic", "usdc"));

//   // it("mannually", async () => {
//   //   console.log(await cryptoPayment.addUserBalanceManually(1));
//   // });

//   after(() => {
//     const showBalance = require("../someGarbage/test");
//     setTimeout(async () => {
//       await showBalance();
//     }, 15000);
//   });
// });

const listentouserdepositBtctokentestnet = "";

// describe("deposit Btc and update update Users balance interval", async () => {
//   before(async () => {
//     try {
//       cryptoPayment = new CryptoPaymentSystem(false);
//       await cryptoPayment.init(
//         encryptPrivKeyForUsersWallet,
//         encryptBtcPrivKey,
//         encryptEvmPrivKey,
//         encryptEvmPrivKey
//       );
//       await cryptoPayment.listenToNewUsers();
//       await cryptoPayment.updateUsersBtcWalletBalance(0.6);
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   it("BTC", async () => {
//     const user = cryptoPayment?._usersMap.get(1);
//     await cryptoPayment.addUserBalanceManually(user.id);
//     const user1BtcMapBalance = user.btc_balance;
//     const getUser1BtcWalletBalance = await cryptoPayment._btc.getBTCBalance(
//       user.btc_address
//     );
//     const user1BtcWalletBalance = getUser1BtcWalletBalance?.data;

//     expect(user1BtcMapBalance).to.equal(user1BtcWalletBalance);

//     const amountBtcToSend = 0.001;

//     const sendBtcToUser1Address = await cryptoPayment?._btc?.sendBitcoin(
//       btcWallet?.privateKey,
//       user?.btc_address,
//       btcWallet?.address,
//       amountBtcToSend,
//       10
//     );

//     expect(sendBtcToUser1Address.status).to.equal(true);
//     expect(sendBtcToUser1Address?.data?.amount).to.equal(amountBtcToSend);

//     setTimeout(async () => {
//       try {
//         console.log("start set time out on", `BTC`);
//         const getUser1WalletBalanceAfterSend =
//           await cryptoPayment?._btc?.getBTCBalance(user?.btc_address);

//         const getUsersDbBalance = await helper.getUserBalance(user.email);

//         const user1BalanceMapAfterSend = parseFloat(user[`btc_balance`]);
//         const userDbBalanceAfterSend = parseFloat(
//           getUsersDbBalance[`btc_balance`]
//         );
//         const user1WalletBalanceAfterSend = parseFloat(
//           getUser1WalletBalanceAfterSend?.data
//         );

//         expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
//         expect(userDbBalanceAfterSend).to.equal(user1WalletBalanceAfterSend);
//         expect(user1BalanceMapAfterSend).to.equal(user1WalletBalanceAfterSend);
//         expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(
//           0
//         );
//         console.log("finish set time out on", `BTC`);
//       } catch (error) {
//         console.log(error.message);
//       }
//     }, 0.9 * 60 * 1000);
//   });

//   after(() => {
//     const showBalance = require("../someGarbage/test");
//     setTimeout(async () => {
//       await showBalance();
//     }, 1.2 * 60 * 1000);
//   });
// });

const depositall = "";

describe("deposit All", async () => {
  before(async () => {
    try {
      cryptoPayment = new CryptoPaymentSystem(false);
      await cryptoPayment.init(
        encryptPrivKeyForUsersWallet,
        encryptBtcPrivKey,
        encryptEvmPrivKey,
        encryptEvmPrivKey
      );
      await cryptoPayment.listenToNewUsers();
      await cryptoPayment.updateUsersBtcWalletBalance(0.6);
      await cryptoPayment.listenToEvmErc20Tx("eth", "usdt");
      await cryptoPayment.listenToEvmErc20Tx("eth", "usdc");
      await cryptoPayment.listenToEvmErc20Tx("bnb", "usdt");
      await cryptoPayment.listenToEvmErc20Tx("bnb", "usdc");
      await cryptoPayment.listenToEvmErc20Tx("matic", "usdt");
      await cryptoPayment.listenToEvmErc20Tx("matic", "usdc");
      await cryptoPayment.listenToEvmNativeTx("eth");
      await cryptoPayment.listenToEvmNativeTx("bnb");
      await cryptoPayment.listenToEvmNativeTx("matic");
    } catch (error) {
      console.log(error);
    }
  });

  const testDepositBtc = async (user, amountBtcToSend) => {
    const user1BtcMapBalance = user.btc_balance;
    const getUser1BtcWalletBalance = await cryptoPayment._btc.getBTCBalance(
      user.btc_address
    );
    const user1BtcWalletBalance = getUser1BtcWalletBalance?.data;

    expect(user1BtcMapBalance).to.equal(user1BtcWalletBalance);

    const sendBtcToUser1Address = await cryptoPayment?._btc?.sendBitcoin(
      btcWallet?.privateKey,
      user?.btc_address,
      btcWallet?.address,
      amountBtcToSend,
      3
    );

    expect(sendBtcToUser1Address.status).to.equal(true);
    expect(sendBtcToUser1Address?.data?.amount).to.equal(amountBtcToSend);

    setTimeout(async () => {
      try {
        console.log(`user${user.id} start set time out on BTC`);
        const getUser1WalletBalanceAfterSend =
          await cryptoPayment?._btc?.getBTCBalance(user?.btc_address);

        const getUsersDbBalance = await helper.getUserBalance(user.email);

        const user1BalanceMapAfterSend = parseFloat(user[`btc_balance`]);
        const userDbBalanceAfterSend = parseFloat(
          getUsersDbBalance[`btc_balance`]
        );
        const user1WalletBalanceAfterSend = parseFloat(
          getUser1WalletBalanceAfterSend?.data
        );

        expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
        expect(userDbBalanceAfterSend).to.equal(user1WalletBalanceAfterSend);
        expect(user1BalanceMapAfterSend).to.equal(user1WalletBalanceAfterSend);
        expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(0);
        console.log(`user${user.id} finish set time out on BTC`);
      } catch (error) {
        console.log(error.message);
      }
    }, 0.9 * 60 * 1000);
  };

  // it("BTC", async () => await testDepositBtc(user, 0.0001));

  const testDepositEvmNative = async (
    user,
    amountEthToSend,
    timesOut,
    network
  ) => {
    console.log(`deposit ${network} from user ${user.id}`);
    const implementer =
      network == "eth"
        ? cryptoPayment._eth
        : network == "bnb"
        ? cryptoPayment._bnb
        : network == "matic"
        ? cryptoPayment._matic
        : null;
    const getUser1EthWalletBalance = await implementer.getNativeTokenBalance(
      user.evm_native_address
    );

    const user1BalanceMapBeforeSend = user[`${network}_balance`];
    const user1EthWalletBalance = getUser1EthWalletBalance?.status
      ? getUser1EthWalletBalance?.data
      : network == "bnb"
      ? "0.00000000"
      : "0.000000000000000000";
    expect(user1EthWalletBalance).to.equal(user1BalanceMapBeforeSend);
    const sendEthToUser1Address = await implementer.sendNativeToken(
      cryptoPayment._privKeyEvmForUsersToWithdraw,
      user.evm_native_address,
      amountEthToSend
    );
    expect(sendEthToUser1Address.status).to.equal(true);
    setTimeout(async () => {
      try {
        console.log(
          `user ${user.id} start set time out ${network.toUpperCase()}`
        );
        const getUser1EthWalletBalanceAfterSend =
          await implementer.getNativeTokenBalance(user.evm_native_address);
        const getUsersDbBalance = await helper.getUserBalance(user.email);

        const user1BalanceMapAfterSend = user[`${network}_balance`];
        const userDbBalanceAfterSend = getUsersDbBalance[`${network}_balance`];
        const user1EthWalletBalanceAfterSend =
          getUser1EthWalletBalanceAfterSend?.status
            ? getUser1EthWalletBalanceAfterSend?.data
            : 0;
        expect(user1EthWalletBalanceAfterSend).to.equal(userDbBalanceAfterSend);
        expect(user1EthWalletBalanceAfterSend).to.equal(
          user1BalanceMapAfterSend
        );
        expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);

        console.log(
          `user ${user.id} finish set time out ${network.toUpperCase()}`
        );
      } catch (error) {
        console.log(error.message);
      }
    }, timesOut * 1000);
  };

  it("ETH", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositEvmNative(userInfo, "0.010002345180101011", 24, "eth");
    }
  });

  it("BNB", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositEvmNative(userInfo, "0.010002345180101011", 18, "bnb");
    }
  });

  it("MATIC", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositEvmNative(userInfo, "0.010002345180101011", 12, "matic");
    }
  });

  const testDepositErc20 = async (cryptoSys, network, tokenName, user) => {
    console.log(`deposit ${tokenName}_${network} from user ${user.id}`);
    if (!["eth", "bsc", "matic"].includes(network))
      throw Error("network incorrct");
    const evm =
      network == "eth"
        ? cryptoSys._eth
        : network == "bsc"
        ? cryptoSys._bnb
        : network == "matic"
        ? cryptoSys._matic
        : null;
    const time =
      network == "eth"
        ? 24 * 1000
        : network == "bsc"
        ? 18 * 1000
        : network == "matic"
        ? 12 * 1000
        : 10000;
    const user1Erc20MapBalance = user[`${tokenName}_${network}_balance`];
    const getUser1Erc20Balance = await evm.getTokenBalance(
      user[`evm_erc20_address`],
      tokenName
    );
    const user1Erc20WalletBalance = getUser1Erc20Balance?.data;

    expect(user1Erc20MapBalance).to.equal(user1Erc20WalletBalance);

    const amountErc20ToSend = 100;
    const sendErc20ToUser1Address = await evm.sendToken(
      evmWallet.privateKey,
      user[`evm_erc20_address`],
      tokenName,
      amountErc20ToSend
    );
    expect(sendErc20ToUser1Address.status).to.equal(true);

    setTimeout(async () => {
      try {
        console.log(
          `user${user.id}:`,
          "start set time out on",
          `${tokenName}_${network}`
        );
        const getUser1Erc20WalletBalanceAfterSend = await evm.getTokenBalance(
          user[`evm_erc20_address`],
          tokenName
        );
        const getUsersDbBalance = await helper.getUserBalance(user.email);

        const user1BalanceMapAfterSend = parseFloat(
          user[`${tokenName}_${network}_balance`]
        );
        const userDbBalanceAfterSend = parseFloat(
          getUsersDbBalance[`${tokenName}_${network}_balance`]
        );
        const user1Erc20WalletBalanceAfterSend = parseFloat(
          getUser1Erc20WalletBalanceAfterSend?.data
        );

        expect(userDbBalanceAfterSend).to.equal(user1BalanceMapAfterSend);
        expect(userDbBalanceAfterSend).to.equal(
          user1Erc20WalletBalanceAfterSend
        );
        expect(user1BalanceMapAfterSend).to.equal(
          user1Erc20WalletBalanceAfterSend
        );
        expect(parseFloat(getUsersDbBalance.account_balance)).to.greaterThan(0);
        console.log(
          `user${user.id}:`,
          "finish set time out on",
          `${tokenName}_${network}`
        );
      } catch (error) {
        console.log(error.message);
      }
    }, time);
  };

  it("usdt_eth", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositErc20(cryptoPayment, "eth", "usdt", userInfo);
    }
  });

  it("usdc_eth", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositErc20(cryptoPayment, "eth", "usdc", userInfo);
    }
  });

  it("usdt_bnb", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositErc20(cryptoPayment, "bsc", "usdt", userInfo);
    }
  });

  it("usdc_bnb", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositErc20(cryptoPayment, "bsc", "usdc", userInfo);
    }
  });

  it("usdt_matic", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositErc20(cryptoPayment, "matic", "usdt", userInfo);
    }
  });

  it("usdc_matic", async () => {
    for (const [userId, userInfo] of cryptoPayment._usersMap) {
      await testDepositErc20(cryptoPayment, "matic", "usdc", userInfo);
    }
  });

  const gatherCrypto = "";

  // it("Gather Crypto", async () => {
  //   setTimeout(async () => {
  //     const usersHaveMoney = await cryptoPayment.getUsersHaveMoney(10);
  //     const gatherCrypto = await cryptoPayment.gatherCrypto(
  //       usersHaveMoney,
  //       1.2,
  //       1.8
  //     );
  //     // output {status: true, data: { withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc...}>, unMatchBalanceUserIds, unsettleTxsUserIds }}
  //     if (gatherCrypto?.status) {
  //       // 99% pass den day mien la input chuan
  //       console.log("GATHER CRYPTO DONE");

  //       let withdrawCryptoMap = gatherCrypto?.data?.withdrawCryptoMap;
  //       let unMatchBalanceUserIds = gatherCrypto?.data?.unMatchBalanceUserIds;
  //       let unsettleTxsUserIds = gatherCrypto?.data?.unsettleTxsUserIds; // thang nao nam trong nay thi khong nam trong thang unMatch xem lai ky
  //       const handleUnsettleTxsUserIds = async (unsettleTxsUserIds) => {
  //         if (unsettleTxsUserIds?.length > 0) {
  //           const settleTxsFromUserIds =
  //             await cryptoPayment.settleTxsFromUserIds(unsettleTxsUserIds);
  //           if (
  //             settleTxsFromUserIds?.status &&
  //             settleTxsFromUserIds?.data?.length > 0 // [{ userId: "", txHash: "", amount: 0, balanceType: "", isSettle: Boolean }...]
  //           ) {
  //             const newUnsettleTxsUserIds = [];
  //             settleTxsFromUserIds?.data.forEach((tx) => {
  //               if (!tx.isSettle && !newUnsettleTxsUserIds.includes(tx.userId))
  //                 newUnsettleTxsUserIds.push(tx.userId);
  //             });
  //             return newUnsettleTxsUserIds;
  //           }
  //         }
  //       };

  //       const newUnsettleTxsUserIds = await handleUnsettleTxsUserIds(
  //         unsettleTxsUserIds
  //       );
  //       unsettleTxsUserIds = newUnsettleTxsUserIds
  //         ? newUnsettleTxsUserIds
  //         : unsettleTxsUserIds;
  //       const isTxSuccess = await cryptoPayment.checkTxsSuccess(
  //         withdrawCryptoMap // input withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc...}>
  //       ); // output withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc, isWithdrawBtcSuccess...}>
  //       if (isTxSuccess?.status) {
  //         // 99% pass den day mien la input chuan
  //         console.log("CHECK TX SUCCESS DONE");
  //         withdrawCryptoMap = isTxSuccess?.data;
  //       }
  //       const handleAfterGatherCrypto =
  //         await cryptoPayment.handleAfterGatherCrypto(
  //           withdrawCryptoMap,
  //           usersHaveMoney,
  //           unMatchBalanceUserIds
  //         ); // khả năng xảy ra lỗi cũng thấp nếu input chuẩn

  //       if (handleAfterGatherCrypto.status) {
  //         const unSettleWithdrawCryptoMap =
  //           handleAfterGatherCrypto?.data?.unSettleWithdrawCryptoMap;
  //         const userIdsWithdrawCaughtError =
  //           handleAfterGatherCrypto?.data?.userIdsWithdrawCaughtError;
  //         const isAddBalanceManuallySuccessMap =
  //           handleAfterGatherCrypto?.data?.isAddBalanceManuallySuccessMap;

  //         if (unSettleWithdrawCryptoMap.size > 0) {
  //           setTimeout(async () => {
  //             const handleAfterGatherCrypto =
  //               await cryptoPayment.handleAfterGatherCrypto(
  //                 unSettleWithdrawCryptoMap
  //               );
  //             console.log(
  //               "unSettleWithdrawCryptoMap: ",
  //               handleAfterGatherCrypto?.data?.unSettleWithdrawCryptoMap?.size
  //             );
  //             console.log(
  //               "isWithdrawing: ",
  //               cryptoPayment._usersMap.get(1).isWithdrawing
  //             );
  //           }, 20 * 1000);
  //         }
  //         console.log(`handleAfterGatherCrypto sucess`);
  //         console.log("-------------------------------------------------");
  //         console.log("unsettleTxsUserIds: ", unsettleTxsUserIds); // check xem length > 0 => handleUnsettleTxsUserIds
  //         console.log(
  //           "unSettleWithdrawCryptoMap: ",
  //           unSettleWithdrawCryptoMap?.size
  //         ); // size map  > 0 => handleAfterGatherCrypto(unSettleWithdrawCryptoMap, [], [], true or undefiend)
  //         console.log(
  //           "userIdsWithdrawCaughtError: ",
  //           userIdsWithdrawCaughtError
  //         ); // cái này xem cho biết thôi
  //         console.log(
  //           "unMatchBalanceUserIds: ",
  //           isAddBalanceManuallySuccessMap?.size ==
  //             unMatchBalanceUserIds.length,
  //           unMatchBalanceUserIds.length
  //         );
  //         console.log(
  //           "isDepositing: ",
  //           cryptoPayment._usersMap.get(1).isDepositing
  //         );
  //         console.log(
  //           "isWithdrawing: ",
  //           cryptoPayment._usersMap.get(1).isWithdrawing
  //         );
  //       } else {
  //         const withdrawCryptoList = [];
  //         for (const [userId, withdrawResult] of withdrawCryptoMap) {
  //           withdrawResult.userId = userId;
  //           withdrawCryptoList.push(withdrawResult);
  //         }
  //         usersHaveMoney.map((user) => {
  //           return user.id;
  //         });
  //         // những dữ liệu này cần lưu lại ổ cứng để process cho hoàn chỉnh
  //         const withdrawCryptoListJson = JSON.stringify(withdrawCryptoList);
  //         const usersHaveMoneyJson = JSON.stringify(usersHaveMoney);
  //         const unMatchBalanceUserIdsJson = JSON.stringify(
  //           unMatchBalanceUserIds
  //         );
  //         const unsettleTxsUserIdsJson = JSON.stringify(unsettleTxsUserIds);
  //         console.log(`handleAfterGatherCrypto failed`);
  //         console.log("-------------------------------------------------");
  //         console.log("withdrawCryptoListJson: ", withdrawCryptoListJson);
  //         console.log("usersHaveMoneyJson: ", usersHaveMoneyJson);
  //         console.log("unMatchBalanceUserIdsJson: ", unMatchBalanceUserIdsJson);
  //         console.log("unsettleTxsUserIdsJson: ", unsettleTxsUserIdsJson);
  //       }
  //     }
  //   }, 30 * 1000);
  // });

  const afterAll = "";

  // after(() => {
  //   setTimeout(async () => {
  //     console.log("isDepositing: ", user.isDepositing);
  //     console.log("isWithdrawing: ", user.isWithdrawing);
  //     const addBalanceMannually = await cryptoPayment.addUserBalanceManually(
  //       user.id
  //     );
  //     console.log(
  //       "updateBtcBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateBtcBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateEthBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateEthBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateBnbBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateBnbBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateMaticBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateMaticBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateUsdtEthBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateUsdtEthBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateUsdcEthBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateUsdcEthBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateUsdtBnbBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateUsdtBnbBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateUsdcBnbBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateUsdcBnbBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateUsdtMaticBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateUsdtMaticBalance?.data?.isDepositing
  //     );
  //     console.log(
  //       "updateUsdcMaticBalance isDeposting: ",
  //       addBalanceMannually?.data?.updateUsdcMaticBalance?.data?.isDepositing
  //     );
  //   }, 0.5 * 60 * 1000);
  // });
});

const walletbalance = "";

// describe('show bank funds balance', async() => {
//   before(async () => {
//     cryptoPayment = new CryptoPaymentSystem(false);
//   })
//   it('bank funds', async() => {
//     const btcBalance = await cryptoPayment._btc.getBTCBalance(btcWallet.address)
//     const ethBalance = await cryptoPayment._eth.getNativeTokenBalance(evmWallet.address)
//     const bnbBalance = await cryptoPayment._bnb.getNativeTokenBalance(evmWallet.address)
//     const maticBalance = await cryptoPayment._matic.getNativeTokenBalance(evmWallet.address)
//     const usdtEthBalance = await cryptoPayment._eth.getTokenBalance(evmWallet.address, 'usdt')
//     const usdcEthBalance = await cryptoPayment._eth.getTokenBalance(evmWallet.address, 'usdc')
//     const usdtBnbBalance = await cryptoPayment._bnb.getTokenBalance(evmWallet.address, 'usdt')
//     const usdcBnbBalance = await cryptoPayment._bnb.getTokenBalance(evmWallet.address, 'usdc')
//     const usdtMaticBalance = await cryptoPayment._matic.getTokenBalance(evmWallet.address, 'usdt')
//     const usdcMaticBalance = await cryptoPayment._matic.getTokenBalance(evmWallet.address, 'usdc')
//     console.log(btcBalance)
//     console.log(ethBalance)
//     console.log(bnbBalance)
//     console.log(maticBalance)
//     console.log(usdtEthBalance)
//     console.log(usdcEthBalance)
//     console.log(usdtBnbBalance)
//     console.log(usdcBnbBalance)
//     console.log(usdtMaticBalance)
//     console.log(usdcMaticBalance)
//   })
// })

const important = "";

// deposit eth from user 2

// deposit matic from user 16
// user 14 start set time out MATIC
// user 14 finish set time out MATIC
// deposit matic from user 17
// unUpdateTxNative: matic
// unUpdateTxNative: matic
// user 15 start set time out MATIC
// user 15 finish set time out MATIC
// user 16 start set time out MATIC
// expected '0.010018095180258511' to equal '0.000015750000157500'

// deposit usdt_matic from user 5
// user3: start set time out on usdt_matic
//     3) usdt_matic
// deposit usdc_matic from user 1
// expected 100 to equal +0
//     4) usdc_matic

// UnUpdateTxErc20: usdt_matic
// UnUpdateTxErc20: usdt_matic
// user4: start set time out on usdt_matic
// user4: finish set time out on usdt_matic
// UnUpdateTxErc20: usdt_matic
