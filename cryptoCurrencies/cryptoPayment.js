// ./node_modules/number-to-bn/node_modules/bn.js/lib/bn.jsmm line 506 delete assert
const BitcoinImpl = require("./bitcoinImpl");
const EVMImpl = require("./evmImpl");
const MySQLEvents = require("@rodrigogs/mysql-events");
const db = require("../database");
const { default: axios } = require("axios");
const helpers = require("./helpers");
const BigNumber = require("bignumber.js");

require("dotenv").config();

let anLolRoi = false;

class CryptoPaymentSystem {
  constructor(isMainnet) {
    this._isMainnet = isMainnet;
    this._usersMap = new Map();
    this._btcAddrMap = new Map();
    this._evmNativeAddrMap = new Map();
    this._evmErc20AddrMap = new Map();
    this._privateKeyForUsersWallet = { privateKey: "", date: "" };
    this._privKeyBtcForUsersToWithdraw = ``;
    this._privKeyEvmForUsersToWithdraw = ``;
    this._privKeyEvmToSendFee = ``;
    this._satoshiPerBytes = 0;
    this._gatherCryptoTxHashMap = new Map();
    this._btcWorthLeast = "4";
    this._ethWorthLeast = "4";
    this._bnbWorthLeast = "2";
    this._maticWorthLeast = "2";
    this._usdEthWorthLeast = "3";
    this._usdBscWorthLeast = "2";
    this._usdMaticWorthLeast = "1";

    if (isMainnet) {
      this._eth = new EVMImpl("eth-mainnet");
      this._bnb = new EVMImpl("bnb-mainnet");
      this._matic = new EVMImpl("matic-mainnet");
      this._btc = new BitcoinImpl(true);
      this._btcAdminAddr = process.env.BTC_ADMIN_ADDRESS_MAINNET;
      this._evmAdminAddr = process.env.EVM_ADMIN_ADDRESS_MAINNET;
    } else {
      this._eth = new EVMImpl("eth-testnet");
      this._bnb = new EVMImpl("bnb-testnet");
      this._matic = new EVMImpl("matic-testnet");
      this._btc = new BitcoinImpl(false);
      this._btcAdminAddr = process.env.BTC_ADMIN_ADDRESS_TESTNET;
      this._evmAdminAddr = process.env.EVM_ADMIN_ADDRESS_TESTNET;
    }
    this._mysqlEventWatcher = new MySQLEvents(db, {
      startAtEnd: true,
      excludedSchemas: {
        mysql: true,
      },
    });
  }

  init = async (
    privateKeyForUsersWallet,
    privKeyBtcForUsersToWithdraw,
    privKeyEvmForUsersToWithdraw,
    privKeyEvmToSendFee
  ) => {
    await this.updateMap();
    this.setPrivateKeyForUsersWallet(privateKeyForUsersWallet);
    this.setPrivKeyBtcForUsersToWithdraw(privKeyBtcForUsersToWithdraw);
    this.setPrivKeyEvmForUsersToWithdraw(privKeyEvmForUsersToWithdraw);
    this.setPrivKeyEvmToSendFee(privKeyEvmToSendFee);

    this._unProcessBlockNativeEth = []; // [1235123, 12312512...] // get block manually
    this._unUpdateTxNativeEth = new Map(); // [{ userId, txHash: tx.hash }...] // update user manually

    this._unProcessBlockNativeBnb = []; // [1235123, 12312512...] // get block manually
    this._unUpdateTxNativeBnb = new Map(); // [{ userId, txHash: tx.hash }...] // update user manually

    this._unProcessBlockNativeMatic = []; // [1235123, 12312512...] // get block manually
    this._unUpdateTxNativeMatic = new Map(); // [{ userId, txHash: tx.hash }...] // update user manually

    this._unProcessEventEthUsdt = 0;
    this._unProcessEventEthUsdc = 0;
    this._unProcessEventBnbUsdt = 0;
    this._unProcessEventBnbUsdc = 0;
    this._unProcessEventMaticUsdt = 0;
    this._unProcessEventMaticUsdc = 0;

    this._unUpdateTxEthUsdt = new Map();
    this._unUpdateTxEthUsdc = new Map();
    this._unUpdateTxBnbUsdt = new Map();
    this._unUpdateTxBnbUsdc = new Map();
    this._unUpdateTxMaticUsdt = new Map();
    this._unUpdateTxMaticUsdc = new Map();

    this._satoshiPerBytes = 5;
    this._decimalsDb = await helpers.getDecimalsOfUsersBalance(db);
  };

  setPrivateKeyForUsersWallet = (encryptData) => {
    const _privateKeyForUsersWallet = this._btc._crypto.decrypt(encryptData);
    if (
      !_privateKeyForUsersWallet?.privateKey ||
      !_privateKeyForUsersWallet?.date
    )
      throw Error("no key or no date");
    this._privateKeyForUsersWallet.privateKey =
      _privateKeyForUsersWallet?.privateKey
        ? _privateKeyForUsersWallet?.privateKey
        : this._privateKeyForUsersWallet.privateKey;
    this._privateKeyForUsersWallet.date = _privateKeyForUsersWallet?.date
      ? _privateKeyForUsersWallet?.date
      : this._privateKeyForUsersWallet.date;
  };

  setPrivKeyBtcForUsersToWithdraw = (encryptData) => {
    const privKeyBtcForUsersToWithdraw = this._btc._crypto.decrypt(encryptData);
    this._privKeyBtcForUsersToWithdraw = privKeyBtcForUsersToWithdraw
      ? privKeyBtcForUsersToWithdraw
      : this._privKeyBtcForUsersToWithdraw;
  };

  setPrivKeyEvmForUsersToWithdraw = (encryptData) => {
    const privKeyEvmForUsersToWithdraw = this._btc._crypto.decrypt(encryptData);
    this._privKeyEvmForUsersToWithdraw = privKeyEvmForUsersToWithdraw
      ? privKeyEvmForUsersToWithdraw
      : this._privKeyEvmForUsersToWithdraw;
  };

  setPrivKeyEvmToSendFee = (encryptData) => {
    const privKeyEvmToSendFee = this._btc._crypto.decrypt(encryptData);
    this._privKeyEvmToSendFee = privKeyEvmToSendFee
      ? privKeyEvmToSendFee
      : this._privKeyEvmToSendFee;
  };

  _getUsers = () => {
    return new Promise((res, rej) => {
      db.query(
        `select id, email,
        cast(btc_balance AS CHAR) AS btc_balance,
        cast(eth_balance AS CHAR) AS eth_balance,
        cast(bnb_balance AS CHAR) AS bnb_balance,
        cast(matic_balance AS CHAR) AS matic_balance,
        cast(usdt_eth_balance AS CHAR) AS usdt_eth_balance,
        cast(usdt_bsc_balance AS CHAR) AS usdt_bsc_balance,
        cast(usdt_matic_balance AS CHAR) AS usdt_matic_balance,
        cast(usdc_eth_balance AS CHAR) AS usdc_eth_balance,
        cast(usdc_bsc_balance AS CHAR) AS usdc_bsc_balance,
        cast(usdc_matic_balance AS CHAR) AS usdc_matic_balance, 
        evm_native_address,
        evm_erc20_address,
        btc_address,
        crypted_evm_native_wallet,
        crypted_evm_erc20_wallet,
        crypted_btc_wallet
        from users`,
        [],
        (err, result, field) => {
          if (err) return rej(null);
          if (!result || result?.length <= 0) return rej(null);
          return res(result);
        }
      );
    });
  }; // cần làm cho trường id không thể update được

  _getAddrMap = (addressType) => {
    if (!["evm-native", "evm-erc20", "btc"].includes(addressType)) return null;
    const addrMap = new Map();
    for (const [userId, user] of this._usersMap) {
      const addr =
        addressType == "evm-native"
          ? user.evm_native_address
          : addressType == "evm-erc20"
          ? user.evm_erc20_address
          : addressType == "btc"
          ? user.btc_address
          : "";
      addrMap.set(addr.toLowerCase(), userId);
    }
    return addrMap;
  }; // {ess" : userId}"addr

  updateMap = async () => {
    const newUserList = await this._getUsers();
    newUserList.forEach((newUser) => {
      if (!this._usersMap.has(newUser.id)) {
        newUser.isWithdrawing = false;
        newUser.isDepositing = false;
        this._usersMap.set(newUser.id, newUser);
      }
    });
    this._btcAddrMap = this._getAddrMap("btc");
    this._evmNativeAddrMap = this._getAddrMap("evm-native");
    this._evmErc20AddrMap = this._getAddrMap("evm-erc20");
  };

  listenToNewUsers = async () => {
    try {
      await this._mysqlEventWatcher.start();

      this._mysqlEventWatcher.addTrigger({
        name: "bo123.users.*",
        expression: "*.users",
        statement: MySQLEvents.STATEMENTS.INSERT,
        onEvent: async (event) => {
          if (event.table == "users") {
            await this.updateMap();
          }
        },
      });

      this._mysqlEventWatcher.on(MySQLEvents.EVENTS.CONNECTION_ERROR, (err) => {
        throw Error("CONNECTION_ERROR: connect db caught error");
      });
      this._mysqlEventWatcher.on(MySQLEvents.EVENTS.ZONGJI_ERROR, (err) => {
        console.log(err);
        throw Error("ZONGJI_ERROR process listen mysql event caught error");
      });
    } catch (err) {
      throw Error("check the connection and all function listenToNewUsers");
    }
  };

  _getCryptoPrice = async (coinName) => {
    if (!["btc", "eth", "bnb", "matic"].includes(coinName.toLowerCase()))
      throw Error("coin name invalid. It should be btc eth bnb matic");
    try {
      const url = `https://api.binance.com/api/v3/klines?symbol=${coinName.toUpperCase()}USDT&interval=1m&limit=1`;
      const result = await axios.get(url);
      if (result && result.data && result.data[0] && result.data[0][4])
        return new BigNumber(result.data[0][4]).toString();
      else return null;
    } catch (error) {
      return null;
    }
  };

  _isUserMatchWithPrivKey = (userCreatedAt) => {
    try {
      if (!this._privateKeyForUsersWallet.date) return false;
      if (!userCreatedAt) return false;
      const keyDateObj = new Date(this._privateKeyForUsersWallet.date);
      const userDateObj = new Date(userCreatedAt);
      if (isNaN(keyDateObj.getTime()) || isNaN(userDateObj.getTime())) {
        throw new Error("Ngày không hợp lệ");
      }
      return keyDateObj.getTime() < userDateObj.getTime();
    } catch (error) {
      return false;
    }
  };

  // user deposit money
  _updateUserBalanceAndAccountBalance = async (
    txHash,
    amountNative,
    amountToUsd,
    userEmail,
    userId,
    tokenName,
    cryptoPrice
  ) => {
    const isTokenNameIsErc20 = [
      "usdt_eth",
      "usdc_eth",
      "usdt_bnb",
      "usdc_bnb",
      "usdt_matic",
      "usdc_matic",
    ].includes(tokenName);

    return new Promise((response, reject) => {
      let cryptoBalance, decimals;
      switch (tokenName) {
        case "btc":
          cryptoBalance = "btc_balance";
          decimals = this._decimalsDb.btc_balance;
          break;
        case "eth":
          cryptoBalance = "eth_balance";
          decimals = this._decimalsDb.eth_balance;
          break;
        case "bnb":
          cryptoBalance = "bnb_balance";
          decimals = this._decimalsDb.bnb_balance;
          break;
        case "matic":
          cryptoBalance = "matic_balance";
          decimals = this._decimalsDb.matic_balance;
          break;
        case "usdt_eth":
          cryptoBalance = "usdt_eth_balance";
          decimals = this._decimalsDb.usdt_eth_balance;
          break;
        case "usdc_eth":
          cryptoBalance = "usdc_eth_balance";
          decimals = this._decimalsDb.usdc_eth_balance;
          break;
        case "usdt_bnb":
          cryptoBalance = "usdt_bsc_balance";
          decimals = this._decimalsDb.usdt_bsc_balance;
          break;
        case "usdc_bnb":
          cryptoBalance = "usdc_bsc_balance";
          decimals = this._decimalsDb.usdc_bsc_balance;
          break;
        case "usdt_matic":
          cryptoBalance = "usdt_matic_balance";
          decimals = this._decimalsDb.usdt_matic_balance;
          break;
        case "usdc_matic":
          cryptoBalance = "usdc_matic_balance";
          decimals = this._decimalsDb.usdc_matic_balance;
          break;
        default:
          cryptoBalance = ``;
      }
      db.getConnection((error1, connection) => {
        if (error1) {
          if (txHash && ["eth", "bnb", "matic"].includes(tokenName)) {
            this._setUnUpdateTxNativeMap(
              tokenName,
              userId,
              txHash,
              error1.message
            );
          }
          if (txHash && isTokenNameIsErc20) {
            this._setUnUpdateTxErc20Map(
              tokenName,
              userId,
              txHash,
              error1.message
            );
          }
          return reject(error1.message);
        }
        connection.beginTransaction((error2) => {
          if (error2) {
            if (txHash && ["eth", "bnb", "matic"].includes(tokenName)) {
              this._setUnUpdateTxNativeMap(
                tokenName,
                userId,
                txHash,
                error2.message
              );
            }
            if (txHash && isTokenNameIsErc20) {
              this._setUnUpdateTxErc20Map(
                tokenName,
                userId,
                txHash,
                error2.message
              );
            }
            return reject(error2.message);
          }
          connection.query(
            `select * from deposit_crypto_history where tx_hash = ?`,
            [txHash],
            (error8, result8, fields8) => {
              if (error8) {
                if (txHash && ["eth", "bnb", "matic"].includes(tokenName)) {
                  this._setUnUpdateTxNativeMap(
                    tokenName,
                    userId,
                    txHash,
                    error8.message
                  );
                }
                if (txHash && isTokenNameIsErc20) {
                  this._setUnUpdateTxErc20Map(
                    tokenName,
                    userId,
                    txHash,
                    error8.message
                  );
                }
                return reject(error8.message);
              }
              if (result8.length > 0)
                return reject("transaction already settle");
              connection.query(
                `select cast(${cryptoBalance} as char) as ${cryptoBalance}_str from users where email = ?`,
                [userEmail],
                (error6, result6, fields6) => {
                  if (error6) {
                    if (txHash && ["eth", "bnb", "matic"].includes(tokenName)) {
                      this._setUnUpdateTxNativeMap(
                        tokenName,
                        userId,
                        txHash,
                        error6.message
                      );
                    }
                    if (txHash && isTokenNameIsErc20) {
                      this._setUnUpdateTxErc20Map(
                        tokenName,
                        userId,
                        txHash,
                        error6.message
                      );
                    }
                    return reject(error6.message);
                  }
                  const currentBalance = result6[0][`${cryptoBalance}_str`];
                  const currentBalanceBigNumb = new BigNumber(currentBalance);
                  const amountNativeBigNumb = new BigNumber(amountNative);
                  const newBalance = currentBalanceBigNumb
                    .plus(amountNativeBigNumb)
                    .toFixed(decimals);
                  connection.query(
                    `update users set ${cryptoBalance} = ? where email = ?`,
                    [newBalance, userEmail],
                    (error3, results3, fields3) => {
                      if (error3) {
                        return connection.rollback((errRollback1) => {
                          if (errRollback1) {
                            if (
                              txHash &&
                              ["eth", "bnb", "matic"].includes(tokenName)
                            ) {
                              this._setUnUpdateTxNativeMap(
                                tokenName,
                                userId,
                                txHash,
                                errRollback1.message
                              );
                            }
                            if (txHash && isTokenNameIsErc20) {
                              this._setUnUpdateTxErc20Map(
                                tokenName,
                                userId,
                                txHash,
                                errRollback1.message
                              );
                            }
                            return reject(errRollback1.message);
                          }
                          if (
                            txHash &&
                            ["eth", "bnb", "matic"].includes(tokenName)
                          ) {
                            this._setUnUpdateTxNativeMap(
                              tokenName,
                              userId,
                              txHash,
                              error3.message
                            );
                          }
                          if (txHash && isTokenNameIsErc20) {
                            this._setUnUpdateTxErc20Map(
                              tokenName,
                              userId,
                              txHash,
                              error3.message
                            );
                          }
                          return reject(error3.message);
                        });
                      }
                      connection.query(
                        `select balance from account where email = ? and type = ?`,
                        [userEmail, 1],
                        (error7, result7, fields7) => {
                          if (error7) {
                            return connection.rollback((errRollback4) => {
                              if (errRollback4) {
                                if (
                                  txHash &&
                                  ["eth", "bnb", "matic"].includes(tokenName)
                                ) {
                                  this._setUnUpdateTxNativeMap(
                                    tokenName,
                                    userId,
                                    txHash,
                                    errRollback4.message
                                  );
                                }
                                if (txHash && isTokenNameIsErc20) {
                                  this._setUnUpdateTxErc20Map(
                                    tokenName,
                                    userId,
                                    txHash,
                                    errRollback4.message
                                  );
                                }
                                return reject(errRollback4.message);
                              }
                              if (
                                txHash &&
                                ["eth", "bnb", "matic"].includes(tokenName)
                              ) {
                                this._setUnUpdateTxNativeMap(
                                  tokenName,
                                  userId,
                                  txHash,
                                  error7.message
                                );
                              }
                              if (txHash && isTokenNameIsErc20) {
                                this._setUnUpdateTxErc20Map(
                                  tokenName,
                                  userId,
                                  txHash,
                                  error7.message
                                );
                              }
                              return reject(error7.message);
                            });
                          }
                          const currentAccountBalance = result7[0][`balance`];
                          const currentAccountBalanceBigNumb = new BigNumber(
                            currentAccountBalance
                          );
                          const amountToUsdBigNumb = new BigNumber(amountToUsd);
                          const newAccountBalance = currentAccountBalanceBigNumb
                            .plus(amountToUsdBigNumb)
                            .toString();
                          connection.query(
                            `update account set balance = ? where email = ? and type = ?`,
                            [newAccountBalance, userEmail, 1],
                            (error4, results4, fields4) => {
                              if (error4) {
                                return connection.rollback((errRollback2) => {
                                  if (errRollback2) {
                                    if (
                                      txHash &&
                                      ["eth", "bnb", "matic"].includes(
                                        tokenName
                                      )
                                    ) {
                                      this._setUnUpdateTxNativeMap(
                                        tokenName,
                                        userId,
                                        txHash,
                                        errRollback2.message
                                      );
                                    }
                                    if (txHash && isTokenNameIsErc20) {
                                      this._setUnUpdateTxErc20Map(
                                        tokenName,
                                        userId,
                                        txHash,
                                        errRollback2.message
                                      );
                                    }
                                    return reject(errRollback2.message);
                                  }
                                  if (
                                    txHash &&
                                    ["eth", "bnb", "matic"].includes(tokenName)
                                  ) {
                                    this._setUnUpdateTxNativeMap(
                                      tokenName,
                                      userId,
                                      txHash,
                                      error4.message
                                    );
                                  }
                                  if (txHash && isTokenNameIsErc20) {
                                    this._setUnUpdateTxErc20Map(
                                      tokenName,
                                      userId,
                                      txHash,
                                      error4.message
                                    );
                                  }
                                  return reject(error4.message);
                                });
                              }
                              if (txHash) {
                                connection.query(
                                  `insert into deposit_crypto_history
                                  (user_id, token_name, amount, tx_hash, crypto_price, created_at)
                                  values(?,?,?,?,?,now())`,
                                  [
                                    userId,
                                    tokenName,
                                    amountNative,
                                    txHash,
                                    cryptoPrice,
                                  ],
                                  (error9, result9, fields9) => {
                                    if (error9) {
                                      return connection.rollback(
                                        (errRollback5) => {
                                          if (errRollback5) {
                                            if (
                                              txHash &&
                                              ["eth", "bnb", "matic"].includes(
                                                tokenName
                                              )
                                            ) {
                                              this._setUnUpdateTxNativeMap(
                                                tokenName,
                                                userId,
                                                txHash,
                                                errRollback5.message
                                              );
                                            }
                                            if (txHash && isTokenNameIsErc20) {
                                              this._setUnUpdateTxErc20Map(
                                                tokenName,
                                                userId,
                                                txHash,
                                                errRollback5.message
                                              );
                                            }
                                            return reject(errRollback5.message);
                                          }
                                          if (
                                            txHash &&
                                            ["eth", "bnb", "matic"].includes(
                                              tokenName
                                            )
                                          ) {
                                            this._setUnUpdateTxNativeMap(
                                              tokenName,
                                              userId,
                                              txHash,
                                              error9.message
                                            );
                                          }
                                          if (txHash && isTokenNameIsErc20) {
                                            this._setUnUpdateTxErc20Map(
                                              tokenName,
                                              userId,
                                              txHash,
                                              error9.message
                                            );
                                          }
                                          return reject(error9.message);
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                              connection.commit((error5) => {
                                if (error5) {
                                  return connection.rollback((errRollback3) => {
                                    if (errRollback3) {
                                      if (
                                        txHash &&
                                        ["eth", "bnb", "matic"].includes(
                                          tokenName
                                        )
                                      ) {
                                        this._setUnUpdateTxNativeMap(
                                          tokenName,
                                          userId,
                                          txHash,
                                          errRollback3.message
                                        );
                                      }
                                      if (txHash && isTokenNameIsErc20) {
                                        this._setUnUpdateTxErc20Map(
                                          tokenName,
                                          userId,
                                          txHash,
                                          errRollback3.message
                                        );
                                      }
                                      return reject(errRollback3.message);
                                    }
                                    if (
                                      txHash &&
                                      ["eth", "bnb", "matic"].includes(
                                        tokenName
                                      )
                                    ) {
                                      this._setUnUpdateTxNativeMap(
                                        tokenName,
                                        userId,
                                        txHash,
                                        error5.message
                                      );
                                    }
                                    if (txHash && isTokenNameIsErc20) {
                                      this._setUnUpdateTxErc20Map(
                                        tokenName,
                                        userId,
                                        txHash,
                                        error5.message
                                      );
                                    }
                                    return reject(error5.message);
                                  });
                                }
                                connection.release();
                                this._usersMap.get(userId)[`${cryptoBalance}`] =
                                  newBalance.split(".")[1].length < decimals
                                    ? newBalance +
                                      "0".repeat(
                                        decimals -
                                          newBalance.split(".")[1]?.length
                                      )
                                    : newBalance;

                                response(true);
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  }; // wait untill done this task
  // ok
  _addUserBalance = async (userId, walletBalance, dbBalance, tokenName) => {
    // change tokenName to network
    try {
      if (
        ![
          "btc",
          "eth",
          "bnb",
          "matic",
          "usdt_eth",
          "usdc_eth",
          "usdt_bnb",
          "usdc_bnb",
          "usdt_matic",
          "usdc_matic",
        ].includes(tokenName)
      )
        throw Error("token name invalid: ", tokenName);
      const user = this._usersMap.get(userId);
      const walletBalanceBigNumb = new BigNumber(walletBalance);
      const dbBalanceBigNumb = new BigNumber(dbBalance);
      if (
        !user.isWithdrawing &&
        !user.isDepositing &&
        walletBalanceBigNumb.isGreaterThan(dbBalanceBigNumb)
      ) {
        let cryptoPrice = 1;
        if (["btc", "eth", "bnb", "matic"].includes(tokenName))
          cryptoPrice = await this._getCryptoPrice(tokenName);
        if (!cryptoPrice) throw Error("cannot get crypto price");

        const amountCryptoUserDeposit =
          walletBalanceBigNumb.minus(dbBalanceBigNumb);

        const amountToUsd = amountCryptoUserDeposit.times(
          new BigNumber(cryptoPrice)
        );
        const updateDbBalance = await this._updateUserBalanceAndAccountBalance(
          null,
          amountCryptoUserDeposit.toString(),
          amountToUsd.toString(),
          user.email,
          user.id,
          tokenName
        );

        return { status: updateDbBalance ? true : false, data: null };
      } else
        return {
          status: false,
          data: {
            isWithdrawing: user.isWithdrawing,
            isDepositing: user.isDepositing,
            walletBalanceGreaterThanDbBalance:
              walletBalanceBigNumb.isGreaterThan(dbBalanceBigNumb),
          },
        };
    } catch (error) {
      return { status: false, data: error.message ? error.message : error };
    }
  };
  // ok
  addUserBalanceManually = async (userId, shouldUpdateMap) => {
    try {
      if (shouldUpdateMap) await this.updateMap();
      if (!this._usersMap.has(userId)) throw Error("userId invalid: ", userId);
      const user = this._usersMap.get(userId);

      const bitcoinAddr = user.btc_address;
      const evmNativeAddr = user.evm_native_address;
      const evmErc20Addr = user.evm_erc20_address;

      const getBtcBalance = await this._btc.getBTCBalance(bitcoinAddr);
      const getEthBalance = await this._eth.getNativeTokenBalance(
        evmNativeAddr
      );
      const getBnbBalance = await this._bnb.getNativeTokenBalance(
        evmNativeAddr
      );
      const getMaticBalance = await this._matic.getNativeTokenBalance(
        evmNativeAddr
      );

      const getUsdtEthBalance = await this._eth.getTokenBalance(
        evmErc20Addr,
        "usdt"
      );
      const getUsdcEthBalance = await this._eth.getTokenBalance(
        evmErc20Addr,
        "usdc"
      );
      const getUsdtBnbBalance = await this._bnb.getTokenBalance(
        evmErc20Addr,
        "usdt"
      );
      const getUsdcBnbBalance = await this._bnb.getTokenBalance(
        evmErc20Addr,
        "usdc"
      );
      const getUsdtMaticBalance = await this._matic.getTokenBalance(
        evmErc20Addr,
        "usdt"
      );
      const getUsdcMaticBalance = await this._matic.getTokenBalance(
        evmErc20Addr,
        "usdc"
      );

      const btcBalance = getBtcBalance?.status ? getBtcBalance?.data : null;
      const ethBalance = getEthBalance?.status ? getEthBalance?.data : null;
      const bnbBalance = getBnbBalance?.status ? getBnbBalance?.data : null;
      const maticBalance = getMaticBalance?.status
        ? getMaticBalance?.data
        : null;

      const usdtEthBalance = getUsdtEthBalance?.status
        ? getUsdtEthBalance?.data
        : null;
      const usdcEthBalance = getUsdcEthBalance?.status
        ? getUsdcEthBalance?.data
        : null;
      const usdtBnbBalance = getUsdtBnbBalance?.status
        ? getUsdtBnbBalance?.data
        : null;
      const usdcBnbBalance = getUsdcBnbBalance?.status
        ? getUsdcBnbBalance?.data
        : null;
      const usdtMaticBalance = getUsdtMaticBalance?.status
        ? getUsdtMaticBalance?.data
        : null;
      const usdcMaticBalance = getUsdcMaticBalance?.status
        ? getUsdcMaticBalance?.data
        : null;

      const updateUsersBalance = {
        updateBtcBalance: {},
        updateEthBalance: {},
        updateBnbBalance: {},
        updateMaticBalance: {},
        updateUsdtEthBalance: {},
        updateUsdcEthBalance: {},
        updateUsdtBnbBalance: {},
        updateUsdcBnbBalance: {},
        updateUsdtMaticBalance: {},
        updateUsdcMaticBalance: {},
        // { status: true, data: null };
        // { status: false, data: {isWithdrawing: user.isWithdrawing, isDepositing: user.isDepositing, walletBalanceGreaterThanDbBalance: walletBalance > dbBalance,}};
        // { status: false, data: error.message };
      };

      if (btcBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          btcBalance,
          user.btc_balance,
          "btc"
        );
        updateUsersBalance.updateBtcBalance = updateUserBalance;
      }
      if (ethBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          ethBalance,
          user.eth_balance,
          "eth"
        );
        updateUsersBalance.updateEthBalance = updateUserBalance;
      }
      if (bnbBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          bnbBalance,
          user.bnb_balance,
          "bnb"
        );
        updateUsersBalance.updateBnbBalance = updateUserBalance;
      }
      if (maticBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          maticBalance,
          user.matic_balance,
          "matic"
        );
        updateUsersBalance.updateMaticBalance = updateUserBalance;
      }
      if (usdtEthBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          usdtEthBalance,
          user.usdt_eth_balance,
          "usdt_eth"
        );
        updateUsersBalance.updateUsdtEthBalance = updateUserBalance;
      }
      if (usdcEthBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          usdcEthBalance,
          user.usdc_eth_balance,
          "usdc_eth"
        );
        updateUsersBalance.updateUsdcEthBalance = updateUserBalance;
      }
      if (usdtBnbBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          usdtBnbBalance,
          user.usdt_bsc_balance,
          "usdt_bnb"
        );
        updateUsersBalance.updateUsdtBnbBalance = updateUserBalance;
      }
      if (usdcBnbBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          usdcBnbBalance,
          user.usdc_bsc_balance,
          "usdc_bnb"
        );
        updateUsersBalance.updateUsdcBnbBalance = updateUserBalance;
      }
      if (usdtMaticBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          usdtMaticBalance,
          user.usdt_matic_balance,
          "usdt_matic"
        );
        updateUsersBalance.updateUsdtMaticBalance = updateUserBalance;
      }
      if (usdcMaticBalance) {
        const updateUserBalance = await this._addUserBalance(
          userId,
          usdcMaticBalance,
          user.usdc_matic_balance,
          "usdc_matic"
        );
        updateUsersBalance.updateUsdcMaticBalance = updateUserBalance;
      }
      return { status: true, data: updateUsersBalance };
    } catch (error) {
      return { status: false, data: error.message ? error.message : error };
    }
  };
  // ok
  getUnProcessBlock = () => {
    return {
      unProcessBlockNativeEth: this._unProcessBlockNativeEth,
      unProcessBlockNativeBnb: this._unProcessBlockNativeBnb,
      unProcessBlockNativeMatic: this._unProcessBlockNativeMatic,
    };
  };
  // ok
  getUnUpdateTxNative = () => {
    return {
      unUpdateTxNativeEth: this._unUpdateTxNativeEth,
      unUpdateTxNativeBnb: this._unUpdateTxNativeBnb,
      unUpdateTxNativeMatic: this._unUpdateTxNativeMatic,
      gatherCryptoTxHashMap: this._gatherCryptoTxHashMap,
    };
  };
  // ok
  _setUnProcessBlock = (network, blockNumb) => {
    if (!["eth", "bnb", "matic"].includes(network)) return false;
    switch (network) {
      case network == "eth":
        this._unProcessBlockNativeEth.push(blockNumb);
        break;
      case "bnb":
        this._unProcessBlockNativeBnb.push(blockNumb);
        break;
      case "matic":
        this._unProcessBlockNativeMatic.push(blockNumb);
        break;
      default:
        console.log("network incorrect _setUnProcessBlock");
        break;
    }
  };
  // ok
  _setUnUpdateTxNativeMap = (tokenName, userId, txHash, errMess) => {
    console.log(`unUpdateTxNative: ${tokenName} , ${txHash}, ${errMess}`);
    if (!["eth", "bnb", "matic"].includes(tokenName)) return false;
    const unUpdateTxNativeMap =
      tokenName == "eth"
        ? this._unUpdateTxNativeEth
        : tokenName == "bnb"
        ? this._unUpdateTxNativeBnb
        : tokenName == "matic"
        ? this._unUpdateTxNativeMatic
        : "";
    return unUpdateTxNativeMap.set(txHash, {
      userId: userId,
      count: 0,
      errMess: errMess,
    });
  };
  // ok
  listenToEvmNativeTx = async (network) => {
    // infura 10req/s 100.000req/day
    if (!["eth", "bnb", "matic"].includes(network))
      throw Error("network incorrect");

    const evm =
      network == "eth"
        ? this._eth
        : network == "bnb"
        ? this._bnb
        : network == "matic"
        ? this._matic
        : null;

    // const unUpdateTxs = // 6 reason increase unUpdateTxs: beginTransaction, updateUserBalance, updateAccountBalance, commit, isWithdrawing, unexpected
    //   network == "eth"
    //     ? this._unUpdateTxNativeEth
    //     : network == "bnb"
    //     ? this._unUpdateTxNativeBnb
    //     : network == "matic"
    //     ? this._unUpdateTxNativeMatic
    //     : null;
    // if (unUpdateTxs.size > 0) {
    //   for (const [txHash, user] of unUpdateTxs) {
    //     if (user.count < 5) {
    //       user.count = user.count + 1;
    //       unUpdateTxs.set(txHash, user);
    //       const updateUsersBalanceManually = await this.addUserBalanceManually(
    //         user.userId
    //       );
    //       if (updateUsersBalanceManually?.status) {
    //         unUpdateTxs.delete(txHash);
    //       }
    //     } else {
    //       if (unUpdateTxs.size > 1000) unUpdateTxs.delete(txHash);
    //     }
    //   }
    // }

    let blockNumber = 0;

    evm.web3Wss.eth.subscribe("newBlockHeaders", async (error, result) => {
      if (!error) {
        if (blockNumber && result?.number - blockNumber > 1) anLolRoi = true; // test nghe truot block
        blockNumber = result?.number;
        // console.log("block number:", result?.number, "on:", network);
        evm.web3Http.eth.getBlock(
          result?.number,
          true,
          async (error, block) => {
            if (!error) {
              const transactions = block?.transactions;
              if (!transactions || transactions?.length <= 0) return null; // console.log("there is no transaction");
              transactions.forEach(async (tx) => {
                const toAddr = tx?.to?.toLowerCase();
                const value = tx?.value;
                const txHash = tx?.hash;
                if (
                  this._evmNativeAddrMap.has(toAddr) &&
                  new BigNumber(value).isGreaterThan(BigNumber(0))
                ) {
                  const user = this._usersMap.get(
                    this._evmNativeAddrMap.get(toAddr)
                  );
                  user.isDepositing = true;
                  try {
                    const cryptoPrice = await this._getCryptoPrice(network);
                    if (!cryptoPrice) throw Error("cannot get crypto price");
                    const amountNative = await evm.web3Wss.utils.fromWei(
                      value,
                      "ether"
                    );
                    const amountToUsd = new BigNumber(amountNative)
                      .times(new BigNumber(cryptoPrice))
                      .toString();
                    const userEmail = user.email;
                    if (!user.isWithdrawing) {
                      await this._updateUserBalanceAndAccountBalance(
                        txHash,
                        amountNative,
                        amountToUsd,
                        userEmail,
                        this._evmNativeAddrMap.get(toAddr),
                        network,
                        cryptoPrice
                      );
                    } else {
                      return this._setUnUpdateTxNativeMap(
                        network,
                        this._evmNativeAddrMap.get(toAddr),
                        txHash,
                        "admin withdrawing money from this user"
                      );
                    }
                  } catch (error) {
                    return this._setUnUpdateTxNativeMap(
                      network,
                      this._evmNativeAddrMap.get(toAddr),
                      txHash,
                      error.message ? error.message : error
                    );
                  }
                  user.isDepositing = false;
                }
              });
            } else {
              console.log("get block:", network, error.message);
              return this._setUnProcessBlock(network, result.number);
            }
          }
        );
      } else {
        console.log("newblock headers", network, error.message);
        blockNumber = blockNumber + 1;
        return this._setUnProcessBlock(network, result.number);
      }
    });
  };
  // ok
  _setUnUpdateTxErc20Map = (tokenName, userId, txHash, errMess) => {
    console.log(`UnUpdateTxErc20: ${tokenName}, ${txHash}, ${errMess}`);
    if (
      ![
        "usdt_eth",
        "usdc_eth",
        "usdt_bnb",
        "usdc_bnb",
        "usdt_matic",
        "usdc_matic",
      ].includes(tokenName)
    )
      throw Error("token name is invalid to set unUpdateTxErc20Map");
    switch (tokenName) {
      case "usdt_eth":
        this._unUpdateTxEthUsdt.set(txHash, { userId, errMess, count: 0 });
      case "usdc_eth":
        this._unUpdateTxEthUsdc.set(txHash, { userId, errMess, count: 0 });
      case "usdt_bnb":
        this._unUpdateTxBnbUsdt.set(txHash, { userId, errMess, count: 0 });
      case "usdc_bnb":
        this._unUpdateTxBnbUsdc.set(txHash, { userId, errMess, count: 0 });
      case "usdt_matic":
        this._unUpdateTxMaticUsdt.set(txHash, { userId, errMess, count: 0 });
      case "usdc_matic":
        this._unUpdateTxMaticUsdc.set(txHash, { userId, errMess, count: 0 });
    }
  };
  // ok
  listenToEvmErc20Tx = async (network, tokenName) => {
    if (
      !["eth", "bnb", "matic"].includes(network) ||
      !["usdt", "usdc"].includes(tokenName)
    )
      throw Error("network or token name incorrect");

    const evm =
      network == "eth"
        ? this._eth
        : network == "bnb"
        ? this._bnb
        : network == "matic"
        ? this._matic
        : null;

    const contract =
      tokenName == "usdt"
        ? evm.usdtContract
        : tokenName == "usdc"
        ? evm.usdcContract
        : null;

    // const unUpdateTxs = // 10 reason increase unUpdateTxs: getConnection, beginTransaction, updateUserBalance, updateAccountBalance, commit, isWithdrawing, unexpected + 3 rollback
    //   `${tokenName}_${network}` == "usdt_eth"
    //     ? this._unUpdateTxEthUsdt
    //     : `${tokenName}_${network}` == "usdc_eth"
    //     ? this._unUpdateTxEthUsdc
    //     : `${tokenName}_${network}` == "usdt_bnb"
    //     ? this._unUpdateTxBnbUsdt
    //     : `${tokenName}_${network}` == "usdc_bnb"
    //     ? this._unUpdateTxBnbUsdc
    //     : `${tokenName}_${network}` == "usdt_matic"
    //     ? this._unUpdateTxMaticUsdt
    //     : `${tokenName}_${network}` == "usdc_matic"
    //     ? this._unUpdateTxMaticUsdc
    //     : null;
    // if (unUpdateTxs.size > 0) {
    //   for (const [txHash, user] of unUpdateTxs) {
    //     if (user.count < 5) {
    //       user.count = user.count + 1;
    //       unUpdateTxs.set(txHash, user);
    //       const updateUsersBalanceManually = await this.addUserBalanceManually(
    //         user.userId
    //       );
    //       if (updateUsersBalanceManually?.status) {
    //         unUpdateTxs.delete(txHash);
    //       }
    //     } else {
    //       if (unUpdateTxs.size > 1000) unUpdateTxs.delete(txHash);
    //     }
    //   }
    // }
    contract?.events
      .Transfer()
      .on("data", async (event) => {
        const txHash = event?.transactionHash;
        const toAddr = event?.returnValues?.to?.toLowerCase();
        const value = event?.returnValues?.value;
        const user = this._usersMap.get(this._evmErc20AddrMap?.get(toAddr));
        if (
          this._evmErc20AddrMap?.has(toAddr) &&
          new BigNumber(value).isGreaterThan(BigNumber(0)) &&
          user?.id > 0
        ) {
          user.isDepositing = true;
          let times = network == "eth" ? 30 : network == "bnb" ? 20 : 10;
          times = this._isMainnet ? times : times / 2;
          let checkCount = 0;
          let maxCheckCount = this._isMainnet ? 6 : 3;
          let handlTxSuccess = setInterval(async () => {
            try {
              const receipt = await evm.web3Wss.eth.getTransactionReceipt(
                txHash
              );
              if (receipt && receipt.status) {
                try {
                  const decimals = parseInt(
                    await contract.methods.decimals().call()
                  );
                  const amount = new BigNumber(value)
                    .dividedBy(new BigNumber(10).pow(decimals))
                    .toString();
                  if (!user?.isWithdrawing) {
                    await this._updateUserBalanceAndAccountBalance(
                      txHash,
                      amount,
                      amount,
                      user.email,
                      user.id,
                      `${tokenName}_${network}`,
                      "1"
                    );
                  } else {
                    this._setUnUpdateTxErc20Map(
                      `${tokenName}_${network}`,
                      user.id,
                      txHash,
                      "admin is withdrawing money from this user"
                    );
                  }
                } catch (error) {
                  this._setUnUpdateTxErc20Map(
                    `${tokenName}_${network}`,
                    user.id,
                    txHash,
                    error.message ? error.message : error
                  );
                }
                clearInterval(handlTxSuccess);
                user.isDepositing = false;
              }
              checkCount += 1;
              if (checkCount >= maxCheckCount) {
                clearInterval(handlTxSuccess);
                user.isDepositing = false;
              }
            } catch (error) {
              console.log(`getTransactionReceipt: ${error.message}`);
            }
          }, times * 1000);
        }
      })
      .on("error", (error) => {
        if (error) {
          switch (`${tokenName}_${network}`) {
            case `usdt_eth`:
              this._unProcessEventEthUsdt += 1;
              break;
            case `usdc_eth`:
              this._unProcessEventEthUsdc += 1;
              break;
            case `usdt_bnb`:
              this._unProcessEventBnbUsdt += 1;
              break;
            case `usdc_bnb`:
              this._unProcessEventBnbUsdc += 1;
              break;
            case `usdt_matic`:
              this._unProcessEventMaticUsdt += 1;
              break;
            case `usdt_matic`:
              this._unProcessEventMaticUsdc += 1;
              break;
          }
        }
      });
  };
  // ok
  _checkUsersBtcWalletBalance = async () => {
    for (const [userId, user] of this._usersMap) {
      const userBtcWalletBalance = await this._btc.getBTCBalance(
        user?.btc_address
      );
      if (
        userBtcWalletBalance?.status &&
        userBtcWalletBalance?.data > 0 &&
        new BigNumber(userBtcWalletBalance?.data).isGreaterThan(
          new BigNumber(user?.btc_balance)
        ) &&
        !user?.isWithdrawing
      ) {
        await this._addUserBalance(
          userId,
          userBtcWalletBalance?.data,
          user?.btc_balance,
          "btc"
        );
      }
    }
    // consume request as much as users amount each time call
  };
  // ok
  updateUsersBtcWalletBalance = async (minutes) => {
    setInterval(async () => {
      await this._checkUsersBtcWalletBalance();
    }, minutes * 60 * 1000);
  };

  // admin withdraw money from users wallet
  getUsersHaveMoneyByIds = async (ids) => {
    let btcPrices, ethPrices, bnbPrices, maticPrices;
    try {
      btcPrices = await this._getCryptoPrice("btc");
      ethPrices = await this._getCryptoPrice("eth");
      bnbPrices = await this._getCryptoPrice("bnb");
      maticPrices = await this._getCryptoPrice("matic");
      if (!btcPrices || !ethPrices || !bnbPrices || !maticPrices)
        throw Error("get crypto prices caugth error");
    } catch (error) {
      throw Error(error?.message);
    }
    return new Promise((res, rej) => {
      db.query(
        `select id,
            cast(btc_balance AS CHAR) AS btc_balance,
            cast(eth_balance AS CHAR) AS eth_balance,
            cast(bnb_balance AS CHAR) AS bnb_balance,
            cast(matic_balance AS CHAR) AS matic_balance,
            cast(usdt_eth_balance AS CHAR) AS usdt_eth_balance,
            cast(usdt_bsc_balance AS CHAR) AS usdt_bsc_balance,
            cast(usdt_matic_balance AS CHAR) AS usdt_matic_balance,
            cast(usdc_eth_balance AS CHAR) AS usdc_eth_balance,
            cast(usdc_bsc_balance AS CHAR) AS usdc_bsc_balance,
            cast(usdc_matic_balance AS CHAR) AS usdc_matic_balance
           from users where 
           btc_balance > 0 or eth_balance > 0 or bnb_balance > 0 or matic_balance > 0 or usdt_eth_balance > 0 or usdt_bsc_balance > 0 
           or usdt_matic_balance > 0 or usdc_eth_balance > 0 or usdc_bsc_balance > 0 or usdc_matic_balance > 0 and id in (?)`,
        [ids],
        (error, result, fields) => {
          if (error) return rej(null);
          if (!result || result.length <= 0) return rej(null);
          const filteredResult = result.filter((user) => {
            return (
              new BigNumber(user.btc_balance)
                .times(new BigNumber(btcPrices))
                .isGreaterThan(new BigNumber(this._btcWorthLeast)) ||
              new BigNumber(user.eth_balance)
                .times(new BigNumber(ethPrices))
                .isGreaterThan(new BigNumber(this._ethWorthLeast)) ||
              new BigNumber(user.bnb_balance)
                .times(new BigNumber(bnbPrices))
                .isGreaterThan(new BigNumber(this._bnbWorthLeast)) ||
              new BigNumber(user.matic_balance)
                .times(new BigNumber(maticPrices))
                .isGreaterThan(new BigNumber(this._maticWorthLeast)) ||
              new BigNumber(user.usdt_eth_balance).isGreaterThan(
                new BigNumber(this._usdEthWorthLeast)
              ) ||
              new BigNumber(user.usdc_eth_balance).isGreaterThan(
                new BigNumber(this._usdEthWorthLeast)
              ) ||
              new BigNumber(user.usdt_bsc_balance).isGreaterThan(
                new BigNumber(this._usdBscWorthLeast)
              ) ||
              new BigNumber(user.usdc_bsc_balance).isGreaterThan(
                new BigNumber(this._usdBscWorthLeast)
              ) ||
              new BigNumber(user.usdt_matic_balance).isGreaterThan(
                new BigNumber(this._usdMaticWorthLeast)
              ) ||
              new BigNumber(user.usdt_matic_balance).isGreaterThan(
                new BigNumber(this._usdMaticWorthLeast)
              )
            );
          });
          return res(filteredResult);
        }
      );
    });
  }; // [{id, btc_balance, eth_balacne...}...]

  getUsersHaveMoney = async (numberOfUserToGather) => {
    let btcPrices, ethPrices, bnbPrices, maticPrices;
    try {
      btcPrices = await this._getCryptoPrice("btc");
      ethPrices = await this._getCryptoPrice("eth");
      bnbPrices = await this._getCryptoPrice("bnb");
      maticPrices = await this._getCryptoPrice("matic");
      if (!btcPrices || !ethPrices || !bnbPrices || !maticPrices)
        throw Error("get crypto prices caugth error");
    } catch (error) {
      throw Error(error?.message);
    }
    return new Promise((res, rej) => {
      db.query(
        `select id,  
            cast(btc_balance AS CHAR) AS btc_balance,
            cast(eth_balance AS CHAR) AS eth_balance,
            cast(bnb_balance AS CHAR) AS bnb_balance,
            cast(matic_balance AS CHAR) AS matic_balance,
            cast(usdt_eth_balance AS CHAR) AS usdt_eth_balance,
            cast(usdt_bsc_balance AS CHAR) AS usdt_bsc_balance,
            cast(usdt_matic_balance AS CHAR) AS usdt_matic_balance,
            cast(usdc_eth_balance AS CHAR) AS usdc_eth_balance,
            cast(usdc_bsc_balance AS CHAR) AS usdc_bsc_balance,
            cast(usdc_matic_balance AS CHAR) AS usdc_matic_balance
           from users where 
           btc_balance > 0 or eth_balance > 0 or bnb_balance > 0 or matic_balance > 0 or usdt_eth_balance > 0 or usdt_bsc_balance > 0 
           or usdt_matic_balance > 0 or usdc_eth_balance > 0 or usdc_bsc_balance > 0 or usdc_matic_balance > 0`,
        [],
        (error, result, fields) => {
          if (error) return rej(null);
          if (!result || result.length <= 0) return res([]);
          const filteredResult = result.filter((user) => {
            return (
              new BigNumber(user.btc_balance)
                .times(new BigNumber(btcPrices))
                .isGreaterThan(new BigNumber(this._btcWorthLeast)) ||
              new BigNumber(user.eth_balance)
                .times(new BigNumber(ethPrices))
                .isGreaterThan(new BigNumber(this._ethWorthLeast)) ||
              new BigNumber(user.bnb_balance)
                .times(new BigNumber(bnbPrices))
                .isGreaterThan(new BigNumber(this._bnbWorthLeast)) ||
              new BigNumber(user.matic_balance)
                .times(new BigNumber(maticPrices))
                .isGreaterThan(new BigNumber(this._maticWorthLeast)) ||
              new BigNumber(user.usdt_eth_balance).isGreaterThan(
                new BigNumber(this._usdEthWorthLeast)
              ) ||
              new BigNumber(user.usdc_eth_balance).isGreaterThan(
                new BigNumber(this._usdEthWorthLeast)
              ) ||
              new BigNumber(user.usdt_bsc_balance).isGreaterThan(
                new BigNumber(this._usdBscWorthLeast)
              ) ||
              new BigNumber(user.usdc_bsc_balance).isGreaterThan(
                new BigNumber(this._usdBscWorthLeast)
              ) ||
              new BigNumber(user.usdt_matic_balance).isGreaterThan(
                new BigNumber(this._usdMaticWorthLeast)
              ) ||
              new BigNumber(user.usdt_matic_balance).isGreaterThan(
                new BigNumber(this._usdMaticWorthLeast)
              )
            );
          });
          const groupUsersToGatherCrypto =
            numberOfUserToGather > 0 &&
            filteredResult.length > numberOfUserToGather
              ? filteredResult.slice(0, numberOfUserToGather)
              : filteredResult;
          return res(groupUsersToGatherCrypto);
        }
      );
    });
  }; // [{id, btc_balance, eth_balacne...}...]

  checkUserWalletMapDbBalance = async (userDb) => {
    const user = this._usersMap.get(userDb?.id);
    const getBtcBalance = await this._btc.getBTCBalance(user.btc_address);
    const getEthBalance = await this._eth.getNativeTokenBalance(
      user.evm_native_address
    );
    const getBnbBalance = await this._bnb.getNativeTokenBalance(
      user.evm_native_address
    );
    const getMaticBalance = await this._matic.getNativeTokenBalance(
      user.evm_native_address
    );
    const getUsdtEthBalance = await this._eth.getTokenBalance(
      user.evm_erc20_address,
      "usdt"
    );
    const getUsdcEthBalance = await this._eth.getTokenBalance(
      user.evm_erc20_address,
      "usdc"
    );
    const getUsdtBnbBalance = await this._bnb.getTokenBalance(
      user.evm_erc20_address,
      "usdt"
    );
    const getUsdcBnbBalance = await this._bnb.getTokenBalance(
      user.evm_erc20_address,
      "usdc"
    );
    const getUsdtMaticBalance = await this._matic.getTokenBalance(
      user.evm_erc20_address,
      "usdt"
    );
    const getUsdcMaticBalance = await this._matic.getTokenBalance(
      user.evm_erc20_address,
      "usdc"
    );

    const btcBalanceWallet = getBtcBalance?.status ? getBtcBalance?.data : null;
    const ethBalanceWallet = getEthBalance?.status ? getEthBalance?.data : null;
    const bnbBalanceWallet = getBnbBalance?.status ? getBnbBalance?.data : null;
    const maticBalanceWallet = getMaticBalance?.status
      ? getMaticBalance?.data
      : null;
    const usdtEthBalanceWallet = getUsdtEthBalance?.status
      ? getUsdtEthBalance?.data
      : null;
    const usdcEthBalanceWallet = getUsdcEthBalance?.status
      ? getUsdcEthBalance?.data
      : null;
    const usdtBnbBalanceWallet = getUsdtBnbBalance?.status
      ? getUsdtBnbBalance?.data
      : null;
    const usdcBnbBalanceWallet = getUsdcBnbBalance?.status
      ? getUsdcBnbBalance?.data
      : null;
    const usdtMaticBalanceWallet = getUsdtMaticBalance?.status
      ? getUsdtMaticBalance?.data
      : null;
    const usdcMaticBalanceWallet = getUsdcMaticBalance?.status
      ? getUsdcMaticBalance?.data
      : null;

    const btcBalanceMap = user?.btc_balance;
    const ethBalanceMap = user?.eth_balance;
    const bnbBalanceMap = user?.bnb_balance;
    const maticBalanceMap = user?.matic_balance;
    const usdtEthBalanceMap = user?.usdt_eth_balance;
    const usdcEthBalanceMap = user?.usdc_eth_balance;
    const usdtBnbBalanceMap = user?.usdt_bsc_balance;
    const usdcBnbBalanceMap = user?.usdc_bsc_balance;
    const usdtMaticBalanceMap = user?.usdt_matic_balance;
    const usdcMaticBalanceMap = user?.usdc_matic_balance;

    const btcBalanceDb = userDb?.btc_balance;
    const ethBalanceDb = userDb?.eth_balance;
    const bnbBalanceDb = userDb?.bnb_balance;
    const maticBalanceDb = userDb?.matic_balance;
    const usdtEthBalanceDb = userDb?.usdt_eth_balance;
    const usdcEthBalanceDb = userDb?.usdc_eth_balance;
    const usdtBnbBalanceDb = userDb?.usdt_bsc_balance;
    const usdcBnbBalanceDb = userDb?.usdc_bsc_balance;
    const usdtMaticBalanceDb = userDb?.usdt_matic_balance;
    const usdcMaticBalanceDb = userDb?.usdc_matic_balance;

    const unMatchBalance = {
      btc: false,
      eth: false,
      bnb: false,
      matic: false,
      usdtEth: false,
      usdcEth: false,
      usdtBnb: false,
      usdcBnb: false,
      usdtMatic: false,
      usdcMatic: false,
    };
    if (btcBalanceWallet != btcBalanceMap || btcBalanceWallet != btcBalanceDb) {
      unMatchBalance.btc = getBtcBalance.status ? true : null;
    }
    if (ethBalanceWallet != ethBalanceMap || ethBalanceWallet != ethBalanceDb) {
      unMatchBalance.eth = getEthBalance.status ? true : null;
    }
    if (bnbBalanceWallet != bnbBalanceMap || bnbBalanceWallet != bnbBalanceDb) {
      unMatchBalance.bnb = getBnbBalance.status ? true : null;
    }
    if (
      maticBalanceWallet != maticBalanceMap ||
      maticBalanceWallet != maticBalanceDb
    ) {
      unMatchBalance.matic = getMaticBalance.status ? true : null;
    }
    if (
      usdtEthBalanceWallet != usdtEthBalanceMap ||
      usdtEthBalanceWallet != usdtEthBalanceDb
    ) {
      unMatchBalance.usdtEth = getUsdtEthBalance.status ? true : null;
    }
    if (
      usdcEthBalanceWallet != usdcEthBalanceMap ||
      usdcEthBalanceWallet != usdcEthBalanceDb
    ) {
      unMatchBalance.usdcEth = getUsdcEthBalance.status ? true : null;
    }
    if (
      usdtBnbBalanceWallet != usdtBnbBalanceMap ||
      usdtBnbBalanceWallet != usdtBnbBalanceDb
    ) {
      unMatchBalance.usdtBnb = getUsdtBnbBalance.status ? true : null;
    }
    if (
      usdcBnbBalanceWallet != usdcBnbBalanceMap ||
      usdcBnbBalanceWallet != usdcBnbBalanceDb
    ) {
      unMatchBalance.usdcBnb = getUsdcBnbBalance.status ? true : null;
    }
    if (
      usdtMaticBalanceWallet != usdtMaticBalanceMap ||
      usdtMaticBalanceWallet != usdtMaticBalanceDb
    ) {
      unMatchBalance.usdtMatic = getUsdtMaticBalance.status ? true : null;
    }
    if (
      usdcMaticBalanceWallet != usdcMaticBalanceMap ||
      usdcMaticBalanceWallet != usdcMaticBalanceDb
    ) {
      unMatchBalance.usdcMatic = getUsdcMaticBalance.status ? true : null;
    }

    const haveBalance = {};
    haveBalance.btc = btcBalanceWallet;
    haveBalance.eth = ethBalanceWallet;
    haveBalance.bnb = bnbBalanceWallet;
    haveBalance.matic = maticBalanceWallet;
    haveBalance.usdtEth = usdtEthBalanceWallet;
    haveBalance.usdcEth = usdcEthBalanceWallet;
    haveBalance.usdtBnb = usdtBnbBalanceWallet;
    haveBalance.usdcBnb = usdcBnbBalanceWallet;
    haveBalance.usdtMatic = usdtMaticBalanceWallet;
    haveBalance.usdcMatic = usdcMaticBalanceWallet;
    return {
      unMatchBalance: unMatchBalance,
      haveBalance: haveBalance,
    };
  }; // input: {id, btc_balance, eth_balance, evm_native_address...} output:  {unMatchBalance: {btc, eth...}, haveBalance: {btc, eth...}

  checkUsersWalletMapDbBalance = async (usersDb) => {
    const result = new Map();
    for (const userDb of usersDb) {
      if (this._usersMap.has(userDb?.id)) {
        const checkResult = await this.checkUserWalletMapDbBalance(userDb);
        result.set(userDb.id, {
          unMatchBalance: checkResult.unMatchBalance,
          haveBalance: checkResult.haveBalance,
        });
      }
    }
    return result;
  }; // input:[{id, btc_balance, eth_balance, evm_native_address...}...] output: Map<userId, {unMatchBalance: {btc, eth...}, haveBalance: {btc, eth...}}>

  gatherCrypto = async (
    groupUsersToGatherCrypto,
    gasPriceMultiplierForSendNativeToken,
    amountNativeTokenNeededToSendErc20Multiplier,
    gasPriceMultiplierForSendErc20
  ) => {
    const _getUnSettleGatherCryptoHistory = () => {
      return new Promise((response, reject) => {
        db.query(
          `select * from gather_crypto_history where is_settle = ?`,
          [false],
          (error, result, fields) => {
            if (error) return reject(error.message);
            if (result?.length > 0) return response(result);
            return response([]);
          }
        );
      });
    };
    const withdrawCryptoMap = new Map();
    const unMatchBalanceUserIds = [];
    let unsettleTxsUserIds = [];
    try {
      const unSettleTxs = await _getUnSettleGatherCryptoHistory();
      unsettleTxsUserIds = unSettleTxs.map((tx) => tx.user_id);
      const usersBalanceMap = await this.checkUsersWalletMapDbBalance(
        groupUsersToGatherCrypto
      );
      for (const [userId, balances] of usersBalanceMap) {
        const unMatchBalance = balances.unMatchBalance; // value could be true, false, null
        const haveBalance = balances.haveBalance; // value could be float or null
        const isUnMatchBalanceExist = Object.values(unMatchBalance).some(
          (value) => value === true || value === null
        );
        if (!isUnMatchBalanceExist && !unsettleTxsUserIds.includes(userId)) {
          // nếu không có unmatchBalance và mọi tx đều settle hết tiến hành rút
          console.log("gather crypto from: ", userId);
          haveBalance.id = userId;
          const withdrawCrypto = await this._withdrawUserCryptoToAdminAddr(
            // cai nay kieu gi cung co object duoc return
            haveBalance,
            gasPriceMultiplierForSendNativeToken,
            amountNativeTokenNeededToSendErc20Multiplier,
            gasPriceMultiplierForSendErc20
          );
          withdrawCryptoMap.set(userId, withdrawCrypto);
        } else if (
          isUnMatchBalanceExist &&
          !unsettleTxsUserIds.includes(userId)
        )
          unMatchBalanceUserIds.push(userId);
      }
      return {
        status: true,
        data: {
          withdrawCryptoMap,
          unMatchBalanceUserIds,
          unsettleTxsUserIds,
        },
      };
    } catch (error) {
      return { status: false, data: error.message ? error.message : error };
    }
  }; // input: [{id, btc_balance, eth_balacne...}...] 99% status true neu input correct
  // output: {status: true, data: { withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc...}>, unMatchBalanceUserIds }}

  _insertGatherCryptoTxHash = (userId, tokenName, network, txHash, amount) => {
    const insertTxHashToMem = () => {
      console.log(`insertTxHashToMem: `, network, tokenName);
      this._gatherCryptoTxHashMap.set(userId, {
        token_name: tokenName,
        network: network,
        tx_hash: txHash,
      });
    };
    return new Promise((response, reject) => {
      db.getConnection((error1, connection) => {
        if (error1) {
          insertTxHashToMem();
          return reject(error1.message);
        }
        connection.beginTransaction((error2) => {
          if (error2) {
            insertTxHashToMem();
            return reject(error2.message);
          }
          connection.query(
            `insert into gather_crypto_history (
                user_id,
                token_name,
                network,
                tx_hash,
                amount, 
                is_settle,
                created_at) values(?,?,?,?,?,false,now())
          `,
            [userId, tokenName, network, txHash, amount],
            (error3, result3, fields) => {
              if (error3) {
                return connection.rollback((errorRollback1) => {
                  if (errorRollback1) {
                    insertTxHashToMem();
                    return reject(errorRollback1.message);
                  }
                  insertTxHashToMem();
                  return reject(error3.message);
                });
              }
              connection.commit((error4) => {
                if (error4) {
                  return connection.rollback((errorRollback2) => {
                    if (errorRollback2) {
                      insertTxHashToMem();
                      return reject(errorRollback2.message);
                    }
                    insertTxHashToMem();
                    return reject(error4.message);
                  });
                }
                connection.release();
                response(true);
              });
            }
          );
        });
      });
    });
  };

  _withdrawUserCryptoToAdminAddr = async (
    userHaveBalance,
    gasPriceMultiplierForSendNativeToken,
    amountNativeTokenNeededToSendErc20Multiplier,
    gasPriceMultiplierForSendErc20
  ) => {
    const result = {
      btcTxHash: "",
      btcAmount: "",
      ethTxHash: "",
      ethAmount: "",
      bnbTxHash: "",
      bnbAmount: "",
      maticTxHash: "",
      maticAmount: "",
      usdtEthAmount: "",
      usdtEthTxHash: "",
      usdtBnbAmount: "",
      usdtBnbTxHash: "",
      usdtMaticAmount: "",
      usdtMaticTxHash: "",
      usdcEthAmount: "",
      usdcEthTxHash: "",
      usdcBnbAmount: "",
      usdcBnbTxHash: "",
      usdcMaticAmount: "",
      usdcMaticTxHash: "",
      errorWithdrawBtc: "",
      errorWithdrawEvmNative: [],
      errorWithdrawErc20: [],
      unExpectedErr: "",
    };
    const _getFeeToSendEvmNativeToken = async (evm, decimals) => {
      try {
        const getGas = await evm._getGas(this._evmAdminAddr);
        if (!getGas?.status) throw Error("get gas caught error");
        const { gasPriceWei, gasEstimate } = getGas?.data;
        const gasFeeWei = gasEstimate * gasPriceWei;
        const feeEth = evm.web3Wss.utils.fromWei(gasFeeWei.toString(), "ether");
        const fee = new BigNumber(feeEth)
          .times(new BigNumber("1.5"))
          .toFixed(parseInt(decimals));
        return { status: fee ? true : false, data: fee ? fee : null };
      } catch (error) {
        return { status: false, data: error?.message ? error?.message : error };
      }
    };
    const _checkNativeTokenEnoughToSend = async (
      walletBalance,
      type,
      btcAddr
    ) => {
      try {
        const implementer =
          type == "btc"
            ? this._btc
            : type == "eth"
            ? this._eth
            : type == "bnb"
            ? this._bnb
            : type == "matic"
            ? this._matic
            : null;
        const decimals =
          type == "btc"
            ? this._decimalsDb.btc_balan
            : type == "eth"
            ? this._decimalsDb.eth_balance
            : type == "bnb"
            ? this._decimalsDb.bnb_balance
            : type == "matic"
            ? this._decimalsDb.matic_balance
            : null;

        let fee = 0;
        if (type == "btc") {
          const getFee = await implementer.getFee(
            this._satoshiPerBytes,
            btcAddr
          );
          fee = getFee?.status ? getFee?.data : null;
        } else {
          const getFee = await _getFeeToSendEvmNativeToken(
            implementer,
            decimals
          );
          fee = getFee?.status ? getFee?.data : null;
        }
        return {
          status: true,
          data: {
            isEnough: fee
              ? new BigNumber(walletBalance).isGreaterThan(new BigNumber(fee))
              : null,
            fee: fee ? fee : null,
          },
        };
      } catch (error) {
        debugger;
        return { status: false, data: error?.message ? error?.message : error };
      }
    };
    try {
      const user = this._usersMap.get(userHaveBalance.id);

      if (!user) throw Error("cannot find users in memories please updateMap");

      user.isWithdrawing = true;

      const withdrawEvmNativeToken = async (evm, tokenName) => {
        try {
          console.log("gather ", tokenName);
          const decryptedWallet = JSON.parse(
            evm.decryptWallet(
              user.crypted_evm_native_wallet,
              this._privateKeyForUsersWallet.privateKey
            )
          );

          const checkEvmNativeEnoughtToSend =
            await _checkNativeTokenEnoughToSend(
              userHaveBalance[`${tokenName}`],
              tokenName
            );
          if (
            !checkEvmNativeEnoughtToSend?.status ||
            checkEvmNativeEnoughtToSend?.data?.fee == null
          )
            throw Error(
              "check Evm Native token enough to send caught error: ",
              checkEvmNativeEnoughtToSend?.data
            );
          if (!checkEvmNativeEnoughtToSend?.data?.isEnough)
            throw Error(`not enough balance to send: ${tokenName}`);

          const sendNativeToken = await evm.sendNativeToken(
            decryptedWallet.privateKey,
            this._evmAdminAddr,
            tokenName == "eth"
              ? new BigNumber(userHaveBalance.eth).minus(
                  new BigNumber(checkEvmNativeEnoughtToSend?.data?.fee)
                )
              : tokenName == "bnb"
              ? new BigNumber(userHaveBalance.bnb).minus(
                  new BigNumber(checkEvmNativeEnoughtToSend?.data?.fee)
                )
              : tokenName == "matic"
              ? new BigNumber(userHaveBalance.matic).minus(
                  new BigNumber(checkEvmNativeEnoughtToSend?.data?.fee)
                )
              : null
          );
          if (sendNativeToken?.status && sendNativeToken?.data) {
            if (tokenName == "eth") {
              result.ethTxHash = sendNativeToken?.data?.tx;
              result.ethAmount = new BigNumber(
                sendNativeToken?.data?.amount
              ).toString();
              await this._insertGatherCryptoTxHash(
                user.id,
                tokenName,
                tokenName,
                sendNativeToken?.data?.tx,
                new BigNumber(sendNativeToken?.data?.amount).toString()
              );
            } else if (tokenName == "bnb") {
              result.bnbTxHash = sendNativeToken?.data?.tx;
              result.bnbAmount = new BigNumber(
                sendNativeToken?.data?.amount
              ).toString();
              await this._insertGatherCryptoTxHash(
                user.id,
                tokenName,
                tokenName,
                sendNativeToken?.data?.tx,
                new BigNumber(sendNativeToken?.data?.amount).toString()
              );
            } else if (tokenName == "matic") {
              result.maticTxHash = sendNativeToken?.data?.tx;
              result.maticAmount = new BigNumber(
                sendNativeToken?.data?.amount
              ).toString();
              await this._insertGatherCryptoTxHash(
                user.id,
                tokenName,
                tokenName,
                sendNativeToken?.data?.tx,
                new BigNumber(sendNativeToken?.data?.amount).toString()
              );
            }
          } else {
            throw Error(
              `send native token caught Error: ${sendNativeToken?.data}`
            );
          }
        } catch (error) {
          console.log(
            "gather ",
            tokenName,
            "caught error:",
            error?.message ? error?.message : error
          );
          result.errorWithdrawEvmNative.push(
            error?.message ? error?.message : error
          );
        }
      };

      const withdrawErc20Token = async (
        evm,
        tokenName,
        network,
        amountToSend
      ) => {
        try {
          console.log(`gather ${tokenName} from ${network}`);
          if (!this._privKeyEvmToSendFee)
            throw Error("there is no private key to send fee");
          const decryptedWallet = JSON.parse(
            evm.decryptWallet(
              user.crypted_evm_erc20_wallet,
              this._privateKeyForUsersWallet.privateKey
            )
          );
          const amountNativeTokenNeededToSendErc20 =
            await evm.amountNativeTokenNeededToSendErc20(
              tokenName,
              decryptedWallet.address,
              this._evmAdminAddr,
              amountToSend
            );
          if (!amountNativeTokenNeededToSendErc20?.status) {
            throw Error(
              "get amount native token needed to send erc20 caught Error: ",
              amountNativeTokenNeededToSendErc20?.data
                ? amountNativeTokenNeededToSendErc20?.data
                : ""
            );
          }
          console.log(
            `amountNativeTokenNeededToSendErc20: `,
            amountNativeTokenNeededToSendErc20.status
          );
          if (amountNativeTokenNeededToSendErc20.data > 0) {
            const sendNativeTokenToExecute = await evm.sendNativeToken(
              this._privKeyEvmToSendFee,
              decryptedWallet.address,
              amountNativeTokenNeededToSendErc20Multiplier
                ? amountNativeTokenNeededToSendErc20.data *
                    amountNativeTokenNeededToSendErc20Multiplier
                : amountNativeTokenNeededToSendErc20.data * 1.5,
              gasPriceMultiplierForSendNativeToken
            );
            if (!sendNativeTokenToExecute?.status) {
              throw Error(
                "send native token to execute transaction caught Error: ",
                sendNativeTokenToExecute?.data
                  ? sendNativeTokenToExecute?.data
                  : ""
              );
            }
            console.log(
              `sendNativeTokenToExecute: `,
              sendNativeTokenToExecute?.status
            );
          }
          const sendUsd = await evm.sendToken(
            decryptedWallet.privateKey,
            this._evmAdminAddr,
            tokenName,
            amountToSend,
            gasPriceMultiplierForSendErc20
          );
          if (!sendUsd?.status) {
            throw Error(
              `send ${tokenName} caught Error: `,
              sendUsd.data ? sendUsd.data : ""
            );
          }
          console.log(`sendUsd: `, sendUsd?.status);
          if (`${tokenName}_${network}` == "usdt_eth") {
            result.usdtEthAmount = new BigNumber(amountToSend).toString();
            result.usdtEthTxHash = sendUsd.data;
          } else if (`${tokenName}_${network}` == "usdt_bnb") {
            result.usdtBnbAmount = new BigNumber(amountToSend).toString();
            result.usdtBnbTxHash = sendUsd.data;
          } else if (`${tokenName}_${network}` == "usdt_matic") {
            result.usdtMaticAmount = new BigNumber(amountToSend).toString();
            result.usdtMaticTxHash = sendUsd.data;
          } else if (`${tokenName}_${network}` == "usdc_eth") {
            result.usdcEthAmount = new BigNumber(amountToSend).toString();
            result.usdcEthTxHash = sendUsd.data;
          } else if (`${tokenName}_${network}` == "usdc_bnb") {
            result.usdcBnbAmount = new BigNumber(amountToSend).toString();
            result.usdcBnbTxHash = sendUsd.data;
          } else if (`${tokenName}_${network}` == "usdc_matic") {
            result.usdcMaticAmount = new BigNumber(amountToSend).toString();
            result.usdcMaticTxHash = sendUsd.data;
          }
          await this._insertGatherCryptoTxHash(
            user.id,
            tokenName,
            network,
            sendUsd.data,
            new BigNumber(amountToSend).toString()
          );
          console.log(`_insertGatherCryptoTxHash success`);
        } catch (error) {
          console.log(
            `gather ${tokenName} from ${network} caught error: ${
              error.message ? error.message : error
            }`
          );
          result.errorWithdrawErc20.push(error.message ? error.message : error);
        }
      };

      if (userHaveBalance.btc != null && userHaveBalance.btc > 0) {
        try {
          console.log("gather btc");
          const decryptedWallet = JSON.parse(
            this._btc.decryptWallet(
              user.crypted_btc_wallet,
              this._privateKeyForUsersWallet?.privateKey
            )
          );

          const checkBtcEnoughtToSend = await _checkNativeTokenEnoughToSend(
            userHaveBalance?.btc,
            "btc",
            user.btc_address
          );

          if (
            !checkBtcEnoughtToSend?.status ||
            checkBtcEnoughtToSend?.data?.fee == null
          )
            throw Error(
              "check Btc enough to send caught error: ",
              checkBtcEnoughtToSend?.data
            );
          if (!checkBtcEnoughtToSend?.data?.isEnough)
            throw Error("not enought balance to send");

          const sendBitcoinToAdminArr = await this._btc.sendBitcoin(
            decryptedWallet.privateKey,
            this._btcAdminAddr,
            this._btcAdminAddr,
            userHaveBalance.btc - checkBtcEnoughtToSend?.data?.fee,
            this._satoshiPerBytes
          );
          if (sendBitcoinToAdminArr?.status && sendBitcoinToAdminArr?.data) {
            result.btcTxHash = sendBitcoinToAdminArr?.data?.tx;
            result.btcAmount = new BigNumber(
              sendBitcoinToAdminArr?.data?.amount
            )
              .plus(new BigNumber(sendBitcoinToAdminArr?.data?.fee))
              .toString();
            await this._insertGatherCryptoTxHash(
              user.id,
              "btc",
              "btc",
              sendBitcoinToAdminArr?.data?.tx,
              new BigNumber(sendBitcoinToAdminArr?.data?.amount)
                .plus(new BigNumber(sendBitcoinToAdminArr?.data?.fee))
                .toString()
            );
          } else {
            throw Error(
              "send Bitcoin to Admin address caught error: ",
              sendBitcoinToAdminArr.data ? sendBitcoinToAdminArr.data : ""
            );
          }
        } catch (error) {
          console.log(
            "gather btc caught error: ",
            error?.message ? error?.message : error
          );
          result.errorWithdrawBtc = error?.message ? error?.message : error;
        }
      }

      if (userHaveBalance.eth != null && userHaveBalance.eth > 0)
        await withdrawEvmNativeToken(this._eth, "eth");

      if (userHaveBalance.bnb != null && userHaveBalance.bnb > 0)
        await withdrawEvmNativeToken(this._bnb, "bnb");

      if (userHaveBalance.matic != null && userHaveBalance.matic > 0)
        await withdrawEvmNativeToken(this._matic, "matic");

      if (userHaveBalance.usdtEth > 0)
        await withdrawErc20Token(
          this._eth,
          "usdt",
          "eth",
          userHaveBalance.usdtEth
        );

      if (userHaveBalance.usdcEth > 0)
        await withdrawErc20Token(
          this._eth,
          "usdc",
          "eth",
          userHaveBalance.usdcEth
        );

      if (userHaveBalance.usdtBnb > 0)
        await withdrawErc20Token(
          this._bnb,
          "usdt",
          "bnb",
          userHaveBalance.usdtBnb
        );

      if (userHaveBalance.usdcBnb > 0)
        await withdrawErc20Token(
          this._bnb,
          "usdc",
          "bnb",
          userHaveBalance.usdcBnb
        );

      if (userHaveBalance.usdtMatic > 0)
        await withdrawErc20Token(
          this._matic,
          "usdt",
          "matic",
          userHaveBalance.usdtMatic
        );

      if (userHaveBalance.usdcMatic > 0)
        await withdrawErc20Token(
          this._matic,
          "usdc",
          "matic",
          userHaveBalance.usdcMatic
        );
      if (
        !result.btcTxHash &&
        !result.ethTxHash &&
        !result.bnbTxHash &&
        !result.maticTxHash &&
        !result.usdtEthTxHash &&
        !result.usdtBnbTxHash &&
        !result.usdtMaticTxHash &&
        !result.usdcEthTxHash &&
        !result.usdcBnbTxHash &&
        !result.usdcMaticTxHash
      )
        user.isWithdrawing = false;
    } catch (error) {
      result.unExpectedErr = error.message ? error.message : error;
    }
    return result;
  }; // input: {id, btc, eth, usdtEth...} output {btcTxHash, btcAmount, errorWithdrawBtc...}

  checkTxsSuccess = async (withdrawCryptoMap) => {
    // input withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc...}>
    try {
      const checkTxResults = new Map();
      for (const [userId, withdrawResult] of withdrawCryptoMap) {
        console.log(`check tx success from user with id: ${userId}`);
        const checkTxResult = withdrawResult;
        checkTxResult.isWithdrawBtcSuccess = false;
        checkTxResult.isWithdrawEthSuccess = false;
        checkTxResult.isWithdrawBnbSuccess = false;
        checkTxResult.isWithdrawMaticSuccess = false;
        checkTxResult.isWithdrawUsdtEthSuccess = false;
        checkTxResult.isWithdrawUsdtBnbSuccess = false;
        checkTxResult.isWithdrawUsdtMaticSuccess = false;
        checkTxResult.isWithdrawUsdcEthSuccess = false;
        checkTxResult.isWithdrawUsdcBnbSuccess = false;
        checkTxResult.isWithdrawUsdcMaticSuccess = false;
        if (withdrawResult?.btcTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.btcTxHash,
            new BigNumber(withdrawResult.btcAmount).toString(),
            "btc_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawBtcSuccess = true;
        }
        if (withdrawResult?.ethTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.ethTxHash,
            new BigNumber(withdrawResult.ethAmount).toString(),
            "eth_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawEthSuccess = true;
        }
        if (withdrawResult?.bnbTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.bnbTxHash,
            new BigNumber(withdrawResult.bnbAmount).toString(),
            "bnb_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawBnbSuccess = true;
        }
        if (withdrawResult?.maticTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.maticTxHash,
            new BigNumber(withdrawResult.maticAmount).toString(),
            "matic_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawMaticSuccess = true;
        }
        if (withdrawResult?.usdtEthTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.usdtEthTxHash,
            withdrawResult.usdtEthAmount,
            "usdt_eth_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawUsdtEthSuccess = true;
        }
        if (withdrawResult?.usdtBnbTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.usdtBnbTxHash,
            withdrawResult.usdtBnbAmount,
            "usdt_bsc_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawUsdtBnbSuccess = true;
        }
        if (withdrawResult?.usdtMaticTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.usdtMaticTxHash,
            withdrawResult.usdtMaticAmount,
            "usdt_matic_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawUsdtMaticSuccess = true;
        }
        if (withdrawResult?.usdcEthTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.usdcEthTxHash,
            withdrawResult.usdcEthAmount,
            "usdc_eth_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawUsdcEthSuccess = true;
        }
        if (withdrawResult?.usdcBnbTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.usdcBnbTxHash,
            withdrawResult.usdcBnbAmount,
            "usdc_bsc_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawUsdcBnbSuccess = true;
        }
        if (withdrawResult?.usdcMaticTxHash) {
          const checkTxSuccess = await this._checkTxSuccess(
            userId,
            withdrawResult.usdcMaticTxHash,
            withdrawResult.usdcMaticAmount,
            "usdc_matic_balance"
          );
          if (checkTxSuccess) checkTxResult.isWithdrawUsdcMaticSuccess = true;
        }
        checkTxResults.set(userId, checkTxResult);
      }
      return { status: true, data: checkTxResults };
    } catch (error) {
      return { status: false, data: error?.message ? error?.message : error };
    }
  }; // output withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc, isWithdrawBtcSuccess...}>

  // lấy fee từ tx rồi + với cả amount
  _checkTxSuccess = async (userId, txHash, amount, type) => {
    if (!txHash || !amount)
      throw Error("please provide txHash and amount withdraw");
    if (
      ![
        "btc_balance",
        "eth_balance",
        "bnb_balance",
        "matic_balance",
        "usdt_eth_balance",
        "usdt_bsc_balance",
        "usdt_matic_balance",
        "usdc_eth_balance",
        "usdc_bsc_balance",
        "usdc_matic_balance",
      ].includes(type)
    )
      throw Error("balance type is invalid");
    let implementer;
    switch (type) {
      case "btc_balance":
        implementer = this._btc;
        break;
      case "eth_balance":
        implementer = this._eth;
        break;
      case "bnb_balance":
        implementer = this._bnb;
        break;
      case "matic_balance":
        implementer = this._matic;
        break;
      case "usdt_eth_balance":
        implementer = this._eth;
        break;
      case "usdt_bsc_balance":
        implementer = this._bnb;
        break;
      case "usdt_matic_balance":
        implementer = this._matic;
        break;
      case "usdc_eth_balance":
        implementer = this._eth;
        break;
      case "usdc_bsc_balance":
        implementer = this._bnb;
        break;
      case "usdc_matic_balance":
        implementer = this._matic;
        break;
      default:
        implementer = null;
    }
    const isEvmNative = [
      "eth_balance",
      "bnb_balance",
      "matic_balance",
    ].includes(type);
    try {
      console.log(`check txHash ${type} from user with id: ${userId}`);
      const checkTxSuccess = await implementer.isTxSuccess(txHash);
      if (checkTxSuccess?.status) {
        let minusAmount = amount;
        if (isEvmNative) {
          const tx = await implementer.web3Wss.eth.getTransaction(txHash);
          if (!tx || !tx.gasPrice || !tx.gas)
            throw Error("get evm tx caught error");
          const txFeeWei = new BigNumber(tx.gasPrice).times(
            new BigNumber(tx.gas)
          );
          const txFee = implementer.web3Wss.utils.fromWei(
            txFeeWei.toString(),
            "ether"
          );
          const minusAmountBigNumb = new BigNumber(txFee).plus(
            new BigNumber(amount)
          );
          minusAmount = minusAmountBigNumb.toString();
        }
        const minusUserBalance = await this._minusUserBalance(
          userId,
          minusAmount,
          type,
          txHash
        );
        return minusUserBalance ? true : false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }; // nếu txHash thành công thì update accountBalance và gatherCryptoHis nếu chưa thành công thì trả false không update

  _minusUserBalance = async (userId, minusAmount, balanceType, txHash) => {
    let decimals;
    switch (balanceType) {
      case "btc_balance":
        decimals = this._decimalsDb.btc_balance;
        break;
      case "eth_balance":
        decimals = this._decimalsDb.eth_balance;
        break;
      case "bnb_balance":
        decimals = this._decimalsDb.bnb_balance;
        break;
      case "matic_balance":
        decimals = this._decimalsDb.matic_balance;
        break;
      case "usdt_eth_balance":
        decimals = this._decimalsDb.usdt_eth_balance;
        break;
      case "usdc_eth_balance":
        decimals = this._decimalsDb.usdc_eth_balance;
        break;
      case "usdt_bsc_balance":
        decimals = this._decimalsDb.usdt_bsc_balance;
        break;
      case "usdc_bsc_balance":
        decimals = this._decimalsDb.usdc_bsc_balance;
        break;
      case "usdt_matic_balance":
        decimals = this._decimalsDb.usdt_matic_balance;
        break;
      case "usdc_matic_balance":
        decimals = this._decimalsDb.usdc_matic_balance;
        break;
    }
    return new Promise((response, reject) => {
      db.getConnection((error1, connection) => {
        if (error1) {
          return reject(error1.message);
        }
        connection.beginTransaction((error2) => {
          if (error2) {
            return reject(error2.message);
          }
          connection.query(
            `select is_settle from gather_crypto_history where user_id = ? and tx_hash = ?`,
            [userId, txHash],
            (error5, result5, field5) => {
              if (error5) {
                return connection.rollback((errorRollback3) => {
                  if (errorRollback3) {
                    return reject(errorRollback3.message);
                  }
                  return reject(error5.message);
                });
              }
              if (result5?.length <= 0)
                reject("get nothing from gather_crypto_history");
              if (result5[0].is_settle == true)
                reject("this transaction is already settle");
              connection.query(
                `select cast(${balanceType} as char) as ${balanceType} from users where id = ?`,
                [userId],
                (error6, result6, field6) => {
                  if (error6) {
                    return connection.rollback((errorRollback4) => {
                      if (errorRollback4) {
                        return reject(errorRollback4.message);
                      }
                      return reject(error6.message);
                    });
                  }
                  const currentBalance = result6[0][balanceType];
                  const newBalance = new BigNumber(currentBalance)
                    .minus(new BigNumber(minusAmount))
                    .toFixed(decimals);
                  connection.query(
                    `update users set ${balanceType} = ? where id = ?`,
                    [newBalance, userId],
                    (error3, ressult3, field3) => {
                      if (error3) {
                        return connection.rollback((errorRollback1) => {
                          if (errorRollback1) {
                            return reject(errorRollback1.message);
                          }
                          return reject(error3.message);
                        });
                      }
                      connection.query(
                        `update gather_crypto_history set is_settle = ?, settled_at = now() where user_id = ? and tx_hash = ?`,
                        [true, userId, txHash],
                        (error4, result4, field4) => {
                          if (error4) {
                            return connection.rollback((errorRollback2) => {
                              if (errorRollback2) {
                                return reject(errorRollback2.message);
                              }
                              return reject(error4.message);
                            });
                          }
                          connection.commit((errorCommit) => {
                            if (errorCommit) {
                              return connection.rollback((errorRollback2) => {
                                if (errorRollback2) {
                                  return reject(errorRollback2.message);
                                }
                                return reject(errorCommit.message);
                              });
                            }
                            connection.release();
                            this._usersMap.get(userId)[`${balanceType}`] =
                              newBalance.split(".")[1].length < decimals
                                ? newBalance +
                                  "0".repeat(
                                    decimals - newBalance.split(".")[1]?.length
                                  )
                                : newBalance;
                            return response(true);
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  };

  settleTxsFromUserIds = async (userIds) => {
    const getUnSettleTxs = (userIds) => {
      return new Promise((response, reject) => {
        db.query(
          `select user_id, token_name, network, tx_hash, cast(amount as char) as amount from gather_crypto_history where is_settle = ? and user_id in (?)`,
          [false, userIds],
          (error, result, fields) => {
            if (error) return reject(error.message);
            if (result?.length <= 0) return response([]);
            response(result);
          }
        );
      });
    };

    try {
      let ids = userIds.filter(
        (item, index) => userIds.indexOf(item) === index
      );
      if (ids?.length <= 0) throw Error("userId list is empty");
      const unSettleTxs = await getUnSettleTxs(ids);
      if (unSettleTxs?.length <= 0)
        throw Error(`could not find any un settle tx`);
      const settleTxsArr = [];
      for (let i = 0; i < unSettleTxs.length; i++) {
        const result = { userId: "", txHash: "", amount: 0, balanceType: "" };
        const tx = unSettleTxs[i];
        let type, decimals;
        switch (`${tx?.token_name}_${tx?.network}`) {
          case `btc_btc`:
            type = `btc_balance`;
            decimals = this._decimalsDb.btc_balance;

            break;
          case `eth_eth`:
            type = `eth_balance`;
            decimals = this._decimalsDb.eth_balance;

            break;
          case `bnb_bnb`:
            type = `bnb_balance`;
            decimals = this._decimalsDb.bnb_balance;

            break;
          case `matic_matic`:
            type = `matic_balance`;
            decimals = this._decimalsDb.matic_balance;

            break;
          case `usdt_eth`:
            type = `usdt_eth_balance`;
            decimals = this._decimalsDb.usdt_eth_balance;

            break;
          case `usdt_bnb`:
            type = `usdt_bsc_balance`;
            decimals = this._decimalsDb.usdt_bsc_balance;

            break;
          case `usdt_matic`:
            type = `usdt_matic_balance`;
            decimals = this._decimalsDb.usdt_matic_balance;

            break;
          case `usdc_eth`:
            type = `usdc_eth_balance`;
            decimals = this._decimalsDb.usdc_eth_balance;

            break;
          case `usdc_bnb`:
            type = `usdc_bsc_balance`;
            decimals = this._decimalsDb.usdc_bsc_balance;

            break;
          case `usdc_matic`:
            type = `usdc_matic_balance`;
            decimals = this._decimalsDb.usdc_matic_balance;
            break;
        }
        const checkkTxSuccess = await this._checkTxSuccess(
          tx?.user_id,
          tx?.tx_hash,
          new BigNumber(tx?.amount).toString(), // sau khi sửa thì amount này là amount không fee hàm này khỏi sửa
          type
        );
        result.userId = tx?.user_id;
        result.txHash = tx?.tx_hash;
        result.amount = new BigNumber(tx?.amount).toString();
        result.balanceType = type;
        result.isSettle = checkkTxSuccess;
        settleTxsArr.push(result);
      }
      return { status: true, data: settleTxsArr };
    } catch (error) {
      return { status: false, data: error?.message ? error?.message : error };
    }
  };

  handleAfterGatherCrypto = async (
    withdrawCryptoMap, // withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc, ?+isWithdrawBtcSuccess...}>} // withdrawCryptoMap+.isTxsSuccess = checkTxsSuccess() || gatherCrypto()
    usersHaveMoney, // [{id, btc_balance, eth_balacne...}...] // usersHaveMoney = getUsersHaveMoney()
    unMatchBalanceUserIds, // [1, 2, 3] // unMatchBalanceUserIds = gatherCrypto()
    shouldUpdateMap
  ) => {
    /**
     * khi users gửi tiền DB không ghi nhận thì dùng addUsserBalanceManually nên có hàm interval cho tất cả các loại crypto cho trường hợp loại này
     * khi admin rút tiền DB chưa ghi nhận thì checkTxSuccess nếu không insert txHash thì lên blockscan lấy thông tin checkTxSuccesManually
     */
    const isAddBalanceManuallySuccessMap = new Map();
    const unSettleWithdrawCryptoMap = new Map(withdrawCryptoMap); // withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc, isWithdrawBtcSuccess...}>}
    const userIdsWithdrawCaughtError = []; // [{id, btc_balance, eth_balacne...}...]

    const usersHaveMoneyMap = new Map();

    if (usersHaveMoney?.length > 0)
      usersHaveMoney.forEach((user) => usersHaveMoneyMap.set(user.id, user));

    try {
      if (shouldUpdateMap) await this.updateMap();

      /* Khi gatherCrypto gặp unMatch thì addUsserBalanceManually rồi gather lại (add bọn unMatch cùng với lúc check usersHaveMoneyMap)
        nếu vẫn tiếp tục gặp unMatch thì kiểm tra xem có txHash nào chưa settle không
        nếu không thì lấy địa chỉ ví lên blockscan tìm giao dịch lấy thông tin giao dịch về checkTxSuccess thủ công 
        */
      if (unMatchBalanceUserIds?.length > 0) {
        for (let i = 0; i < unMatchBalanceUserIds.length; i++) {
          const user = this._usersMap.get(unMatchBalanceUserIds[i]);
          if (user?.isWithdrawing == false) {
            const result = await this.addUserBalanceManually(
              unMatchBalanceUserIds[i]
            );
            isAddBalanceManuallySuccessMap.set(
              user?.id,
              result?.status ? true : false
            );
          }
        }
      }

      for (const [userId, withdrawCryptoResult] of withdrawCryptoMap) {
        /** check txsSuccess để update DB nếu khứa nào đã settle hết rồi thì xoá khỏi map kết quả 
         rồi tiếp tục lặp lại hàm với map kết quả đến khi không còn khứa nào trong map kết quả nữa
         trường hợp mapSize = 0 thì check DB xem còn tx nào chưa settle không để tiếp tục xử lý
         trường hợp mapSize > 0 mà đã lặp đến lần thứ n rồi thì lưu kết quả đấy lại xử lý luồng khác */

        const processedWithdrawCryptoResult =
          unSettleWithdrawCryptoMap.get(userId);

        const shouldCheckTxSuccess =
          "isWithdrawBtcSuccess" in withdrawCryptoResult ||
          "isWithdrawEthSuccess" in withdrawCryptoResult ||
          "isWithdrawBnbSuccess" in withdrawCryptoResult ||
          "isWithdrawMaticSuccess" in withdrawCryptoResult ||
          "isWithdrawUsdtEthSuccess" in withdrawCryptoResult ||
          "isWithdrawUsdtBnbSuccess" in withdrawCryptoResult ||
          "isWithdrawUsdtMaticSuccess" in withdrawCryptoResult ||
          "isWithdrawUsdcEthSuccess" in withdrawCryptoResult ||
          "isWithdrawUsdcBnbSuccess" in withdrawCryptoResult ||
          "isWithdrawUsdcMaticSuccess" in withdrawCryptoResult;

        if (shouldCheckTxSuccess) {
          if (
            withdrawCryptoResult.btcTxHash &&
            withdrawCryptoResult.isWithdrawBtcSuccess == false
          ) {
            const minusAmount = new BigNumber(
              withdrawCryptoResult.btcAmount
            ).toString();
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.btcTxHash,
              minusAmount,
              "btc_balance"
            );
            processedWithdrawCryptoResult.isWithdrawBtcSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.ethTxHash &&
            withdrawCryptoResult.isWithdrawEthSuccess == false
          ) {
            const minusAmount = new BigNumber(
              withdrawCryptoResult.ethAmount
            ).toString();
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.ethTxHash,
              minusAmount,
              "eth_balance"
            );
            processedWithdrawCryptoResult.isWithdrawEthSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.bnbTxHash &&
            withdrawCryptoResult.isWithdrawBnbSuccess == false
          ) {
            const minusAmount = new BigNumber(
              withdrawCryptoResult.bnbAmount
            ).toString();
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.bnbTxHash,
              minusAmount,
              "bnb_balance"
            );
            processedWithdrawCryptoResult.isWithdrawBnbSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.maticTxHash &&
            withdrawCryptoResult.isWithdrawMaticSuccess == false
          ) {
            const minusAmount = new BigNumber(
              withdrawCryptoResult.maticAmount
            ).toString();
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.maticTxHash,
              minusAmount,
              "matic_balance"
            );
            processedWithdrawCryptoResult.isWithdrawMaticSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.usdtEthTxHash &&
            withdrawCryptoResult.isWithdrawUsdtEthSuccess == false
          ) {
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.usdtEthTxHash,
              new BigNumber(withdrawCryptoResult.usdtEthAmount).toString(),
              "usdt_eth_balance"
            );
            processedWithdrawCryptoResult.isWithdrawUsdtEthSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.usdtBnbTxHash &&
            withdrawCryptoResult.isWithdrawUsdtBnbSuccess == false
          ) {
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.usdtBnbTxHash,
              new BigNumber(withdrawCryptoResult.usdtBnbAmount).toString(),
              "usdt_bsc_balance"
            );
            processedWithdrawCryptoResult.isWithdrawUsdtBnbSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.usdtMaticTxHash &&
            withdrawCryptoResult.isWithdrawUsdtMaticSuccess == false
          ) {
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.usdtMaticTxHash,
              new BigNumber(withdrawCryptoResult.usdtMaticAmount).toString(),
              "usdt_matic_balance"
            );
            processedWithdrawCryptoResult.isWithdrawUsdtMaticSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.usdcEthTxHash &&
            withdrawCryptoResult.isWithdrawUsdcEthSuccess == false
          ) {
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.usdcEthTxHash,
              new BigNumber(withdrawCryptoResult.usdcEthAmount).toString(),
              "usdc_eth_balance"
            );
            processedWithdrawCryptoResult.isWithdrawUsdcEthSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.usdcBnbTxHash &&
            withdrawCryptoResult.isWithdrawUsdcBnbSuccess == false
          ) {
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.usdcBnbTxHash,
              new BigNumber(withdrawCryptoResult.usdcBnbAmount).toString(),
              "usdc_bsc_balance"
            );
            processedWithdrawCryptoResult.isWithdrawUsdcBnbSuccess = isSettle;
          }
          if (
            withdrawCryptoResult.usdcMaticTxHash &&
            withdrawCryptoResult.isWithdrawUsdcMaticSuccess == false
          ) {
            const isSettle = await this._checkTxSuccess(
              userId,
              withdrawCryptoResult.usdcMaticTxHash,
              new BigNumber(withdrawCryptoResult.usdcMaticAmount).toString(),
              "usdc_matic_balance"
            );
            processedWithdrawCryptoResult.isWithdrawUsdcMaticSuccess = isSettle;
          }
          const isUnSettleTxExist =
            (processedWithdrawCryptoResult.btcTxHash &&
              !processedWithdrawCryptoResult.isWithdrawBtcSuccess) ||
            (processedWithdrawCryptoResult.ethTxHash &&
              !processedWithdrawCryptoResult.isWithdrawEthSuccess) ||
            (processedWithdrawCryptoResult.bnbTxHash &&
              !processedWithdrawCryptoResult.isWithdrawBnbSuccess) ||
            (processedWithdrawCryptoResult.maticTxHash &&
              !processedWithdrawCryptoResult.isWithdrawMaticSuccess) ||
            (processedWithdrawCryptoResult.usdtEthTxHash &&
              !processedWithdrawCryptoResult.isWithdrawUsdtEthSuccess) ||
            (processedWithdrawCryptoResult.usdtBnbTxHash &&
              !processedWithdrawCryptoResult.isWithdrawUsdtBnbSuccess) ||
            (processedWithdrawCryptoResult.usdtMaticTxHash &&
              !processedWithdrawCryptoResult.isWithdrawUsdtMaticSuccess) ||
            (processedWithdrawCryptoResult.usdcEthTxHash &&
              !processedWithdrawCryptoResult.isWithdrawUsdcEthSuccess) ||
            (processedWithdrawCryptoResult.usdcBnbTxHash &&
              !processedWithdrawCryptoResult.isWithdrawUsdcBnbSuccess) ||
            (processedWithdrawCryptoResult.usdcMaticTxHash &&
              !processedWithdrawCryptoResult.isWithdrawUsdcMaticSuccess);
          if (!isUnSettleTxExist) {
            unSettleWithdrawCryptoMap.delete(userId);
            this._usersMap.get(userId).isWithdrawing = false;
          }
        }

        /*check balance ở usersHaveMoney nếu số dư dương mà không có txHash thì dủ chỉ 1 cái thôi cũng add
        userHaveMoney vào userIdsWithdrawCaughtError */
        const user = usersHaveMoneyMap.get(userId);
        if (user) {
          const shouldAdd =
            (user.btc_balance > 0 && !withdrawCryptoResult.btcTxHash) ||
            (user.eth_balance > 0 && !withdrawCryptoResult.ethTxHash) ||
            (user.bnb_balance > 0 && !withdrawCryptoResult.bnbTxHash) ||
            (user.matic_balance > 0 && !withdrawCryptoResult.maticTxHash) ||
            (user.usdt_eth_balance > 0 &&
              !withdrawCryptoResult.usdtEthTxHash) ||
            (user.usdt_bsc_balance > 0 &&
              !withdrawCryptoResult.usdtBnbTxHash) ||
            (user.usdt_matic_balance > 0 &&
              !withdrawCryptoResult.usdtMaticTxHash) ||
            (user.usdc_eth_balance > 0 &&
              !withdrawCryptoResult.usdcEthTxHash) ||
            (user.usdc_bsc_balance > 0 &&
              !withdrawCryptoResult.usdcBnbTxHash) ||
            (user.usdc_matic_balance > 0 &&
              !withdrawCryptoResult.usdcMaticTxHash);
          if (shouldAdd) userIdsWithdrawCaughtError.push(user.id);
        }
      }

      return {
        status: true,
        data: {
          unSettleWithdrawCryptoMap, // Map<userId, {isBtcSettle, btcTxHash, btcAmount...}>
          userIdsWithdrawCaughtError, // [{id, btc_balance, eth_balacne...}...]
          isAddBalanceManuallySuccessMap, // Map<userId, Boolean>
        },
      };
    } catch (error) {
      return { status: false, data: error?.message ? error?.message : error };
    }
  };

  //user withdraw money according account balance
  _getUserAccountBalance = async (userEmail) => {
    return new Promise((res, rej) => {
      db.query`select balance from account where email = ? and type = ?`,
        [userEmail, 1],
        (error, result, field) => {
          if (error) rej(null);
          if (!result || result.length <= 0) rej(null);
          res(result[0].balance);
        };
    });
  };

  _minusUserAccountBalance = async (userEmail, amount) => {
    return new Promise((res, rej) => {
      db.query(
        `update account set balance = balance - ? where email = ?`,
        [amount, userEmail],
        (error, results, field) => {
          if (error) rej(false);
          if (!results || results.length <= 0) rej(false);
          res(true);
        }
      );
    });
  };

  userWithdrawMoney = async (
    userEmail,
    network,
    currencieType,
    userAddress,
    amountWithdrawInUsd
  ) => {
    if (network == "btc" && !this._privKeyBtcForUsersToWithdraw)
      throw Error("there is no privkey to withdraw btc");
    else if (network != "btc" && !this._privKeyEvmForUsersToWithdraw)
      throw Error("there is no privkey to withdraw evm");

    let implementer, privateKey;
    switch (`${network}-${currencieType}`) {
      case `btc-btc`:
        implementer = this._btc;
        privateKey = this._privKeyBtcForUsersToWithdraw;
        break;
      case `eth-eth`:
        implementer = this._eth;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `bnb-bnb`:
        implementer = this._bnb;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `matic-matic`:
        implementer = this._matic;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `eth-usdt`:
        implementer = this._eth;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `eth-usdc`:
        implementer = this._eth;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `bnb-usdt`:
        implementer = this._bnb;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `bnb-usdc`:
        implementer = this._bnb;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `matic-usdt`:
        implementer = this._matic;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      case `matic-usdc`:
        implementer = this._matic;
        privateKey = this._privKeyEvmForUsersToWithdraw;
        break;
      default:
        throw Error("network and currencies type is invalid");
    }
    if (currencieType == "btc") {
      const bankBtcWallet = await implementer._getWalletFromPrivateKey(
        privateKey
      );
      const userAccountBalance = await this._getUserAccountBalance(userEmail);
      const bankWalletBalance = await implementer.getBTCBalance(
        bankBtcWallet.address
      );
      const cryptoPrice = await this._getCryptoPrice(currencieType);
      const amountCrypto = amountWithdrawInUsd / cryptoPrice;

      if (parseFloat(userAccountBalance < amountWithdrawInUsd))
        throw Error("user balance insufficient funds");
      if (parseFloat(bankWalletBalance) <= amountCrypto * 1.2)
        throw Error("bank wallet insufficient funds");

      const sendBitcoin = await implementer.sendBitcoin(
        privateKey,
        userAddress,
        bankBtcWallet.address,
        amountCrypto,
        20
      );
      if (sendBitcoin.status) {
        const tx = sendBitcoin.data.tx;
        const minusAccountBalance = await this._minusUserAccountBalance(
          userEmail,
          amountWithdrawInUsd
        );
        return; // something
      } else {
        return; // something
      }
    } else if (!["eth", "bnb", "matic"].includes(currencieType)) {
      const bankEvmWallet =
        implementer.web3Wss.eth.accounts.privateKeyToAccount(privateKey);

      const userAccountBalance = await this._getUserAccountBalance(userEmail); // in usd
      const bankWalletBalance = await implementer.getNativeTokenBalance(
        bankEvmWallet.address
      );

      const cryptoPrice = await this._getCryptoPrice(currencieType);
      const amountCrypto = amountWithdrawInUsd / cryptoPrice;

      if (parseFloat(userAccountBalance < amountWithdrawInUsd))
        throw Error("user balance insufficient funds");
      if (parseFloat(bankWalletBalance) <= amountCrypto * 1.2)
        throw Error("bank wallet insufficient funds");

      const sendNativeToken = await implementer.sendNativeToken(
        privateKey,
        userAddress,
        amountCrypto
      );
      if (sendNativeToken.status) {
        const tx = sendNativeToken.data.tx;
        const minusAccountBalance = await this._minusUserAccountBalance(
          userEmail,
          amountWithdrawInUsd
        );
        return; // something
      } else {
        return; // something
      }
    } else {
      const bankEvmWallet =
        implementer.web3Wss.eth.accounts.privateKeyToAccount(privateKey);

      const userAccountBalance = await this._getUserAccountBalance(userEmail); // in usd
      const bankWalletBalance = await implementer.getTokenBalance(
        bankEvmWallet.address,
        currencieType
      );

      if (parseFloat(userAccountBalance < amountWithdrawInUsd))
        throw Error("user balance insufficient funds");
      if (parseFloat(bankWalletBalance) <= amountWithdrawInUsd * 1.2)
        throw Error("bank wallet insufficient funds");

      const sendToken = await implementer.sendToken(
        privateKey,
        userAddress,
        currencieType,
        amountWithdrawInUsd
      );

      if (sendToken.status) {
        const tx = sendToken.data.tx;
        const minusAccountBalance = await this._minusUserAccountBalance(
          userEmail,
          amountWithdrawInUsd
        );
        return; // something
      } else {
        return; // something
      }
    }
  }; // onyl withdraw usdt from matic network
}

const main = async () => {
  // wallet1:  { status: true, data: 0.02515355 }
  const btcWallet = {
    privateKey:
      "aa5b18308f8576d4520559649d95c1cd7ab4d22e48415cb0d891ad78cf296dd2",
    address: "myNeUWabCGwNHsLFfof3CJyCigmRpWYAiN",
  };

  // eth:'1.004868734532734495, bnb:'0.447675035527357, matic:'2.169898428832821884
  const evmWallet = {
    address: "0x59772e95C77Dd1575fB916DACDFabEF688cc7971",
    privateKey:
      "232f567845d6c965ba1212522ca590cf0bf7473df0b02f67d227be7ab91b8ad2",
  };

  const fs = require("fs");
  const path = require("path");

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

  const Cryptor = require("./crypto");

  const crypto = new Cryptor(false);
  const encryptBtcPrivKey = crypto.encrypt(btcWallet.privateKey);
  const encryptEvmPrivKey = crypto.encrypt(evmWallet.privateKey);
  const encryptPrivKeyForUsersWallet = crypto.encrypt(
    privKeyForUsersWalletAndDate
  );

  const cryptoPayment = new CryptoPaymentSystem(false);
  await cryptoPayment.init(
    encryptPrivKeyForUsersWallet,
    encryptBtcPrivKey,
    encryptEvmPrivKey,
    encryptEvmPrivKey
  );
  await cryptoPayment.listenToNewUsers();
  await cryptoPayment.listenToEvmNativeTx("eth");
  await cryptoPayment.listenToEvmNativeTx("bnb");
  await cryptoPayment.listenToEvmNativeTx("matic");

  const usersHaveMoney = await cryptoPayment.getUsersHaveMoney(20);
  const gatherCrypto = await cryptoPayment.gatherCrypto(
    usersHaveMoney,
    1.2,
    1.8
  ); 
  // Nếu ngắt đột ngột khi đang gatherCrypto kiểm tra xem đang thu thập đến userId nào và đang thu thập đến loại crypto nào và insert vào gather_crypto_history thủ công
  // sau đó lấy toàn bộ gather_crypto_history rồi tạo thành withdrawCryptoMap rồi handleAfterGatherCrypto để biến isWithdrawing thành false
  // output {status: true, data: { withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc...}>, unMatchBalanceUserIds, unsettleTxsUserIds }}
  if (gatherCrypto?.status) {
    // 99% pass den day mien la input chuan
    console.log("GATHER CRYPTO DONE");

    let withdrawCryptoMap = gatherCrypto?.data?.withdrawCryptoMap;
    let unMatchBalanceUserIds = gatherCrypto?.data?.unMatchBalanceUserIds;
    let unsettleTxsUserIds = gatherCrypto?.data?.unsettleTxsUserIds; // thang nao nam trong nay thi khong nam trong thang unMatch xem lai ky
    // for(const [userId, withdrawResult] of withdrawCryptoMap) {console.log(withdrawResult.errorWithdrawBtc); console.log(withdrawResult.errorWithdrawEvmNative); console.log(withdrawResult.errorWithdrawErc20); console.log(withdrawResult.unExpectedErr)}
    debugger;
    const handleUnsettleTxsUserIds = async (unsettleTxsUserIds) => {
      if (unsettleTxsUserIds?.length > 0) {
        const settleTxsFromUserIds = await cryptoPayment.settleTxsFromUserIds(
          unsettleTxsUserIds
        );
        if (
          settleTxsFromUserIds?.status &&
          settleTxsFromUserIds?.data?.length > 0 // [{ userId: "", txHash: "", amount: 0, balanceType: "", isSettle: Boolean }...]
        ) {
          const newUnsettleTxsUserIds = [];
          settleTxsFromUserIds?.data.forEach((tx) => {
            if (!tx.isSettle && !newUnsettleTxsUserIds.includes(tx.userId))
              newUnsettleTxsUserIds.push(tx.userId);
          });
          return newUnsettleTxsUserIds;
        }
      }
    }; // settle bằng cách lấy dữ liệu trong DB

    const newUnsettleTxsUserIds = await handleUnsettleTxsUserIds(
      unsettleTxsUserIds
    );
    unsettleTxsUserIds = newUnsettleTxsUserIds
      ? newUnsettleTxsUserIds
      : unsettleTxsUserIds;
    debugger;
    const isTxSuccess = await cryptoPayment.checkTxsSuccess( // settle dựa trên withdrawCryptoMap
      withdrawCryptoMap // input withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc...}>
    ); // output withdrawCryptoMap<userId, {btcTxHash, btcAmount, errorWithdrawBtc, isWithdrawBtcSuccess...}>
    if (isTxSuccess?.status) {
      // 99% pass den day mien la input chuan
      console.log("CHECK TX SUCCESS DONE");
      withdrawCryptoMap = isTxSuccess?.data;
    }

    debugger;
    const handleAfterGatherCrypto = await cryptoPayment.handleAfterGatherCrypto( // settle dựa trên withdrawCryptoMap đồng thời quyết định trạng thái isWithdrawing 
      withdrawCryptoMap,
      usersHaveMoney,
      unMatchBalanceUserIds
    ); // khả năng xảy ra lỗi cũng thấp nếu input chuẩn
    debugger;
    if (handleAfterGatherCrypto.status) {
      const unSettleWithdrawCryptoMap =
        handleAfterGatherCrypto?.data?.unSettleWithdrawCryptoMap;
      const userIdsWithdrawCaughtError =
        handleAfterGatherCrypto?.data?.userIdsWithdrawCaughtError;
      const isAddBalanceManuallySuccessMap =
        handleAfterGatherCrypto?.data?.isAddBalanceManuallySuccessMap;
      console.log(
        "unSettleWithdrawCryptoMap: ",
        unSettleWithdrawCryptoMap.size
      );
      console.log("userIdsWithdrawCaughtError: ", userIdsWithdrawCaughtError);
      console.log(
        "isAddBalanceManuallySuccessMap: ",
        isAddBalanceManuallySuccessMap
      );
    } else {
      const withdrawCryptoList = [];
      for (const [userId, withdrawResult] of withdrawCryptoMap) {
        withdrawResult.userId = userId;
        withdrawCryptoList.push(withdrawResult);
      }
      usersHaveMoney.map((user) => {
        return user.id;
      });
      const withdrawCryptoListJson = JSON.stringify(withdrawCryptoList);
      const usersHaveMoneyJson = JSON.stringify(usersHaveMoney);
      const unMatchBalanceUserIdsJson = JSON.stringify(unMatchBalanceUserIds);
      const unsettleTxsUserIdsJson = JSON.stringify(unsettleTxsUserIds);
      console.log(`handleAfterGatherCrypto failed`);
      console.log("-------------------------------------------------");
      console.log("withdrawCryptoListJson: ", withdrawCryptoListJson);
      console.log("usersHaveMoneyJson: ", usersHaveMoneyJson);
      console.log("unMatchBalanceUserIdsJson: ", unMatchBalanceUserIdsJson);
      console.log("unsettleTxsUserIdsJson: ", unsettleTxsUserIdsJson);
    }
  }

  setInterval(() => {
    if (anLolRoi) process.exit(0);
    if (
      cryptoPayment._unProcessBlockNativeEth.length > 0 ||
      cryptoPayment._unProcessBlockNativeBnb.length > 0 ||
      cryptoPayment._unProcessBlockNativeMatic.length > 0
    )
      process.exit(0);
  }, 2000);
};

module.exports = CryptoPaymentSystem;

main();

// const usersHaveMoney = await cryptoPayment.getUsersHaveMoney(20);

// const checkUsersWalletMapDbBalance =
//   await cryptoPayment.checkUsersWalletMapDbBalance(usersHaveMoney);

// console.log("Begin check unMatchBalance");
// for (const [userId, balances] of checkUsersWalletMapDbBalance) {
//   const unMatchBalance = balances.unMatchBalance;
//   const isUnMatchBalanceExist = Object.values(unMatchBalance).some(
//     (value) => value === true || value === null
//   );
//   if (isUnMatchBalanceExist) {
//     console.log(`user ${userId} have unMatchBalance:`, unMatchBalance);
//   }
// }
// console.log("End check unMatchBalance");
