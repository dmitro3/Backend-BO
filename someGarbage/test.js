const EVMImpl = require("../cryptoCurrencies/evmImpl");
const BitcoinImpl = require("../cryptoCurrencies/bitcoinImpl");
const fs = require("fs");
const path = require("path");
const db = require("../database");

const _getUser = (id) => {
  return new Promise((res, rej) => {
    db.query(
      `select id, email,
      btc_balance,
      eth_balance,
      bnb_balance,
      matic_balance,
      usdt_eth_balance
      usdt_bsc_balance,
      usdt_matic_balance,
      usdc_eth_balance,
      usdc_bsc_balance,
      usdc_matic_balance,
      evm_native_address,
      evm_erc20_address,
      btc_address,
      crypted_evm_native_wallet,
      crypted_evm_erc20_wallet,
      crypted_btc_wallet
      from users where id = ?`,
      [id],
      (err, result, field) => {
        if (err) return rej(null);
        if (!result || result.length <= 0) return rej(null);
        return res(result[0]);
      }
    );
  });
};

const privKeyForUsersWallet = fs.readFileSync(
  path.resolve(
    __dirname,
    "../cryptoCurrencies/cryptoKey/privateKey_2023-09-06_13:17:26.pem"
  ),
  "utf8"
);

const evmWallet = {
  address: "0x59772e95C77Dd1575fB916DACDFabEF688cc7971",
  privateKey:
    "232f567845d6c965ba1212522ca590cf0bf7473df0b02f67d227be7ab91b8ad2",
};

const btcWallet = {
  privateKey:
    "aa5b18308f8576d4520559649d95c1cd7ab4d22e48415cb0d891ad78cf296dd2",
  address: "myNeUWabCGwNHsLFfof3CJyCigmRpWYAiN",
};

const _setUnUpdateTxNativeMap = (network, userId, txHash, errMess) => {
  if (["eth", "bnb", "matic"].includes(network))
    throw Error("network incorrect to set unUpdate Txs Native Map");
  const unUpdateTxNativeMap =
    network == "eth"
      ? this._unUpdateTxNativeEth
      : network == "bnb"
      ? this._unUpdateTxNativeBnb
      : network == "matic"
      ? this._unUpdateTxNativeMatic
      : "";
  unUpdateTxNativeMap.set(txHash, {
    userId: userId,
    count: 0,
    errMess: errMess,
  });
};

const _updateUserBalanceAndAccountBalance = async (
  txHash,
  amountNative,
  amountToUsd,
  userEmail,
  userId,
  network
) => {
  return new Promise((response, reject) => {
    const cryptoBalance =
      network == "eth"
        ? "eth_balance"
        : network == "bnb"
        ? "bnb_balance"
        : network == "matic"
        ? "matic_balance"
        : null;
    db.getConnection((error1, connection) => {
      if (error1) {
        _setUnUpdateTxNativeMap(network, userId, txHash, error1.message);
        return reject(error1.message);
      }
      connection.beginTransaction((error2) => {
        if (error2) {
          _setUnUpdateTxNativeMap(network, userId, txHash, error2.message);
          return reject(error2.message);
        }
        connection.query(
          `update users set ${cryptoBalance} = ${cryptoBalance} + ? where email = ?`,
          [amountNative, userEmail],
          (error3, results3, fields3) => {
            if (error3) {
              return connection.rollback((errRollback1) => {
                if (errRollback1) {
                  _setUnUpdateTxNativeMap(
                    network,
                    userId,
                    txHash,
                    errRollback1.message
                  );
                  return reject(errRollback1.message);
                }
                _setUnUpdateTxNativeMap(
                  network,
                  userId,
                  txHash,
                  error3.message
                );
                return reject(error3.message);
              });
            }
            connection.query(
              `update account set balance = balance + ? where email = ? and type = ?`,
              [amountToUsd, userEmail, 1],
              (error4, results4, fields4) => {
                if (error4) {
                  return connection.rollback((errRollback2) => {
                    if (errRollback2) {
                      _setUnUpdateTxNativeMap(
                        network,
                        userId,
                        txHash,
                        errRollback2.message
                      );
                      return reject(errRollback2.message);
                    }
                    _setUnUpdateTxNativeMap(
                      network,
                      userId,
                      txHash,
                      error4.message
                    );
                    return reject(error4.message);
                  });
                }
                connection.commit((error5) => {
                  if (error5) {
                    return connection.rollback((errRollback3) => {
                      if (errRollback3) {
                        _setUnUpdateTxNativeMap(
                          network,
                          userId,
                          txHash,
                          errRollback3.message
                        );
                        return reject(errRollback3.message);
                      }
                      _setUnUpdateTxNativeMap(
                        network,
                        userId,
                        txHash,
                        error5.message
                      );
                      return reject(error5.message);
                    });
                  }
                  connection.end();
                  this._usersMap.get(userId)[`${cryptoBalance}`] =
                    this._usersMap.get(userId)[`${cryptoBalance}`] +
                    amountNative;
                  response(true);
                });
              }
            );
          }
        );
      });
    });
  });
};
const main = async () => {
  try {
    db.query(
      `select balance from account where email = 'fake_email2' and type = 1`,
      [],
      (err, res, fields) => {
        if (err) return console.log(err);
        console.log(res[0]);
      }
    );
    db.query(
      `select  
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
      from users where email = 'fake_email2'`,
      [],
      (err, res, field) => {
        if (err) return console.log(err);
        console.log(res[0]);
      }
    );
    const user1 = await _getUser(2);
    const evmMatic = new EVMImpl("matic-testnet");
    const evmEth = new EVMImpl("eth-testnet");
    const evmBnb = new EVMImpl("bnb-testnet");
    const btc = new BitcoinImpl(false);

    const user1EncryptedEvmNativeWallet = user1.crypted_evm_native_wallet;
    const decryptUser1EvmNativeWallet = JSON.parse(
      evmMatic.decryptWallet(
        user1EncryptedEvmNativeWallet,
        privKeyForUsersWallet
      )
    );
    const user1EncryptedEvmErc20Wallet = user1.crypted_evm_erc20_wallet;
    const decryptUser1EvmErc20Wallet = JSON.parse(
      evmMatic.decryptWallet(
        user1EncryptedEvmErc20Wallet,
        privKeyForUsersWallet
      )
    );
    const user1EncryptedBtcWallet = user1.crypted_btc_wallet;
    const decryptUser1BtcWallet = JSON.parse(
      btc.decryptWallet(user1EncryptedBtcWallet, privKeyForUsersWallet)
    );

    // const sendBitcoin = await btc.sendBitcoin(btcWallet.privateKey, decryptUser1BtcWallet.address, btcWallet.address, 0.001)
    // const sendEth = await evmEth.sendNativeToken(evmWallet.privateKey, decryptUser1EvmNativeWallet.address, 0.01)
    // const sendBnb = await evmBnb.sendNativeToken(evmWallet.privateKey, decryptUser1EvmNativeWallet.address, 0.0009)
    // const sendMatic = await evmMatic.sendNativeToken(evmWallet.privateKey, decryptUser1EvmNativeWallet.address, 0.02)
    // const sendUsdtEth = await evmEth.sendToken(evmWallet.privateKey, decryptUser1EvmErc20Wallet.address, 'usdt', 100)
    // const sendUsdcEth = await evmEth.sendToken(evmWallet.privateKey, decryptUser1EvmErc20Wallet.address, 'usdc', 100)
    // const sendUsdtBnb = await evmBnb.sendToken(evmWallet.privateKey, decryptUser1EvmErc20Wallet.address, 'usdt', 100)
    // const sendUsdcBnb = await evmBnb.sendToken(evmWallet.privateKey, decryptUser1EvmErc20Wallet.address, 'usdc', 100)
    // const sendUsdtMatic = await evmMatic.sendToken(evmWallet.privateKey, decryptUser1EvmErc20Wallet.address, 'usdt', 100)
    // const sendUsdcMatic = await evmMatic.sendToken(evmWallet.privateKey, decryptUser1EvmErc20Wallet.address, 'usdc', 100)

    // const sendUsdtEth = await evmEth.sendToken(decryptUser1EvmErc20Wallet.privateKey, evmWallet.address,'usdt', 100)
    // const sendUsdcEth = await evmEth.sendToken(decryptUser1EvmErc20Wallet.privateKey, evmWallet.address,'usdc', 100)
    // const sendUsdtBnb = await evmBnb.sendToken(decryptUser1EvmErc20Wallet.privateKey, evmWallet.address,'usdt', 100)
    // const sendUsdcBnb = await evmBnb.sendToken(decryptUser1EvmErc20Wallet.privateKey, evmWallet.address,'usdc', 100)
    // const sendUsdtMatic = await evmMatic.sendToken(decryptUser1EvmErc20Wallet.privateKey, evmWallet.address,'usdt', 100)
    // const sendUsdcMatic = await evmMatic.sendToken(decryptUser1EvmErc20Wallet.privateKey, evmWallet.address,'usdc', 100)
    // const sendEth = await evmEth.sendNativeToken(decryptUser1EvmNativeWallet.privateKey, evmWallet.address)
    // const sendBnb = await evmBnb.sendNativeToken(decryptUser1EvmNativeWallet.privateKey, evmWallet.address)
    // const sendMatic = await evmMatic.sendNativeToken(decryptUser1EvmNativeWallet.privateKey, evmWallet.address)

    // console.log("sendBitcoin: ", sendBitcoin?.status)
    // console.log("sendEth: ", sendEth?.status)
    // console.log("sendBnb: ", sendBnb?.status)
    // console.log("sendMatic: ", sendMatic?.status)
    // console.log("sendUsdtEth: ", sendUsdtEth?.status)
    // console.log("sendUsdcEth: ", sendUsdcEth?.status)
    // console.log("sendUsdtBnb: ", sendUsdtBnb?.status)
    // console.log("sendUsdcBnb: ", sendUsdcBnb?.status)
    // console.log("sendUsdtMatic: ", sendUsdtMatic?.status)
    // console.log("sendUsdcMatic: ", sendUsdcMatic?.status)

    const btcBalance = await btc.getBTCBalance(decryptUser1BtcWallet.address);
    const ethBalance = await evmEth.getNativeTokenBalance(
      decryptUser1EvmNativeWallet.address
    ); // 1.5
    // const _getFeeToSendEvmNativeToken = async (evm) => {
    //   try {
    //     const getGas = await evm._getGas(evmWallet.address);
    //     if (!getGas?.status) throw Error("get gas caught error");
    //     const { gasPriceWei, gasEstimate } = getGas?.data;
    //     const gasFeeWei = gasEstimate * gasPriceWei;
    //     const fee =
    //       evm.web3Wss.utils.fromWei(gasFeeWei.toString(), "ether") * 1.5;
    //     return { status: fee ? true : false, data: fee ? fee : null };
    //   } catch (error) {
    //     return { status: false, data: error?.message ? error?.message : error };
    //   }
    // };
    // const getFee = await _getFeeToSendEvmNativeToken(evmEth)
    // if(getFee?.status == false) return
    // const sendEth = await evmEth.sendNativeToken(decryptUser1EvmNativeWallet.privateKey, evmWallet.address, ethBalance.data - getFee.data)
    // console.log("sendEth: ", sendEth?.status)

    const bnbBalance = await evmBnb.getNativeTokenBalance(
      decryptUser1EvmNativeWallet.address
    ); // 0.5
    const maticBalance = await evmMatic.getNativeTokenBalance(
      decryptUser1EvmNativeWallet.address
    ); // 2.6
    const usdtEthBalance = await evmEth.getTokenBalance(
      decryptUser1EvmErc20Wallet.address,
      "usdt"
    );
    const usdcEthBalance = await evmEth.getTokenBalance(
      decryptUser1EvmErc20Wallet.address,
      "usdc"
    );
    const usdtBnbBalance = await evmBnb.getTokenBalance(
      decryptUser1EvmErc20Wallet.address,
      "usdt"
    );
    const usdcBnbBalance = await evmBnb.getTokenBalance(
      decryptUser1EvmErc20Wallet.address,
      "usdc"
    );
    const usdtMaticBalance = await evmMatic.getTokenBalance(
      decryptUser1EvmErc20Wallet.address,
      "usdt"
    );
    const usdcMaticBalance = await evmMatic.getTokenBalance(
      decryptUser1EvmErc20Wallet.address,
      "usdc"
    );
    console.log(btcBalance.data, `btcBalance`);
    console.log(ethBalance.data, `ethBalance`);
    console.log(bnbBalance.data, `bnbBalance`);
    console.log(maticBalance.data, `maticBalance`);
    console.log(usdtEthBalance.data, `usdtEthBalance`);
    console.log(usdcEthBalance.data, `usdcEthBalance`);
    console.log(usdtBnbBalance.data, `usdtBnbBalance`);
    console.log(usdcBnbBalance.data, `usdcBnbBalance`);
    console.log(usdtMaticBalance.data, `usdtMaticBalance`);
    console.log(usdcMaticBalance.data, `usdcMaticBalance`);
  } catch (error) {
    console.log(error);
  }
  try {
  } catch (error) {
    console.log(error);
  }
};

main();

module.exports = main;
