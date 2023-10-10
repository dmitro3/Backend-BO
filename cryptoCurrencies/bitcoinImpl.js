const { PrivateKey } = require("bitcore-lib");
const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const axios = require("axios");
const bitcore = require("bitcore-lib");
const Cryptor = require("./crypto");
require("dotenv").config();

class BitcoinImpl {
  constructor(isMainNet) {
    this._isMainNet = isMainNet;
    this._crypto = isMainNet ? new Cryptor(true) : new Cryptor(false);
  }
  // ok
  createWallet = () => {
    const netWork = this._isMainNet ? mainnet : testnet;
    var privateKey = new PrivateKey();
    var address = privateKey.toAddress(netWork);
    return {
      privateKey: privateKey.toString(),
      address: address.toString(),
    };
  };
  // ok
  encryptWallet = (wallet) => {
    try {
      if (!wallet || !wallet.privateKey) throw Error("wallet invalid");
      if (!this._isAddressValid(wallet.address)) throw Error("address invalid");
      return this._crypto.encryptByPublicKey(wallet);
    } catch (error) {
      return null;
    }
  };
  // ok
  decryptWallet = (encryptedBtcWallet, privateKey) => {
    return this._crypto.decryptByPrivateKey(encryptedBtcWallet, privateKey);
  };

  _getWalletFromPrivateKey = (privateKey) => {
    const network = this._isMainNet
      ? bitcore.Networks.mainnet
      : bitcore.Networks.testnet;
    const privKey = new PrivateKey(privateKey, network);
    const publicKey = privKey.toPublicKey();
    const address = publicKey.toAddress();
    return {
      privateKey: privateKey.toString(),
      address: address.toString(),
    };
  };
  // ok
  _getFee = async (numberOfBlockExpectedToFinish) => {
    const blocksExpectedToFinish = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "144",
      "504",
      "1008",
    ];
    try {
      if (
        !blocksExpectedToFinish.includes(
          numberOfBlockExpectedToFinish.toString()
        )
      )
        throw Error("the number of block is invalid");
      const url = this._isMainNet
        ? `https://blockstream.info/api/fee-estimates`
        : `https://blockstream.info/testnet/api/fee-estimates`;
      const resp = await axios({
        method: "GET",
        url: url,
      });

      return resp.status == 200 || resp.statusText == "OK"
        ? { data: resp.data[numberOfBlockExpectedToFinish], status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
    }
  };
  // ok
  _isAddressValid = async (address) => {
    try {
      const url = this._isMainNet
        ? `https://blockstream.info/api/address/${address}`
        : `https://blockstream.info/testnet/api/address/${address}`;
      const resp = await axios({ method: "GET", url: url });
      return resp.status == 200 || resp.statusText == "OK" ? true : false;
    } catch (error) {
      return false;
    }
  };
  // ok
  _getBTCutxos = async (walletAddress) => {
    try {
      if (!(await this._isAddressValid(walletAddress)))
        throw Error(`this address is invalid: ${walletAddress}`);
      const url = this._isMainNet
        ? `https://blockstream.info/api/address/${walletAddress}/utxo`
        : `https://blockstream.info/testnet/api/address/${walletAddress}/utxo`;
      const resp = await axios({
        method: "GET",
        url: url,
      });
      return resp.status == 200 || resp.statusText == "OK"
        ? { data: resp.data, status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
    }
  };
  // ok
  getBTCBalance = async (walletAddress) => {
    try {
      const utxos = await this._getBTCutxos(walletAddress);
      if (utxos.status) {
        let totalAmountAvailable = 0;
        utxos.data.forEach((utxo) => {
          if (utxo.value) {
            totalAmountAvailable += utxo.value;
          }
        });
        totalAmountAvailable = totalAmountAvailable / 10 ** 8;
        totalAmountAvailable = totalAmountAvailable.toFixed(8);
        return { status: true, data: totalAmountAvailable };
      } else {
        throw Error("get utxos caught error");
      }
    } catch (error) {
      return {
        status: false,
        data: `Lỗi không mong muốn getBTCBalance ${error}`,
      };
    }
  };

  getFee = async (satoshiPerBytes, walletAddress) => {
    try {
      let satoshiFee = 0;
      let recommendedFee = 0;
      let inputCount = 0;
      let outputCount = 2;

      const utxos = await this._getBTCutxos(walletAddress);

      if (utxos?.status) {
        for (const _ of utxos.data) {
          inputCount += 1;
        }
      } else {
        throw Error("cannot get utxos from senderWallet: ", walletAddress);
      }

      const transactionSize =
        inputCount * 180 + outputCount * 34 + 10 - inputCount;

      if (satoshiPerBytes) {
        satoshiFee = transactionSize * satoshiPerBytes;
      } else {
        const getFee = await this._getFee(5);
        if (getFee.status) {
          recommendedFee = getFee.data;
        } else {
          throw Error("cannot get satoshiFee");
        }
        satoshiFee = transactionSize * recommendedFee;
      }
      return { status: true, data: Math.round(satoshiFee) / 10 ** 8 };
    } catch (error) {
      return { status: false, data: error.message ? error.message : error };
    }
  };
  // chắc chắn gửi tiền đến địa chỉ ví hợp lệ
  sendBitcoin = async (
    senderPrivateKey,
    receiveAddress,
    addressToSendChange,
    amountToSend,
    satoshiPerBytes
  ) => {
    try {
      const sendWallet = this._getWalletFromPrivateKey(senderPrivateKey);
      if (
        !this._isAddressValid(sendWallet.address) ||
        !this._isAddressValid(receiveAddress) ||
        !this._isAddressValid(addressToSendChange)
      ) {
        throw Error("one of the address is invalid");
      }

      let fee = 0;
      let recommendedFee = 0;
      let inputCount = 0;
      let outputCount = 2;

      const transaction = new bitcore.Transaction();
      let totalAmountAvailable = 0;

      let inputs = [];

      // { data: resp.data, status: true };
      // { data: null, status: false };
      // { data: error, status: false };
      const utxos = await this._getBTCutxos(sendWallet.address);

      if (utxos.status) {
        for (const utxo of utxos.data) {
          let input = {};
          input.satoshis = utxo.value;
          input.script = bitcore.Script.buildPublicKeyHashOut(
            sendWallet.address
          ).toHex();
          input.address = sendWallet.address;
          input.txId = utxo.txid;
          input.outputIndex = utxo.vout;
          totalAmountAvailable += utxo.value;
          inputCount += 1;
          inputs.push(input);
        }
      } else {
        throw Error("cannot get utxos from senderWallet: ", sendWallet.address);
      }

      /**
       * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
       * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
       * from the transaction as well.
       * */

      const transactionSize =
        inputCount * 180 + outputCount * 34 + 10 - inputCount;

      if (satoshiPerBytes) {
        fee = transactionSize * satoshiPerBytes;
      } else {
        const getFee = await this._getFee(amountToSend ? 5 : 1);
        if (getFee.status) {
          recommendedFee = getFee.data;
        } else {
          throw Error("cannot get fee");
        }
        fee = transactionSize * recommendedFee;
      }

      const satoshiToSend = amountToSend
        ? Math.round(amountToSend * 100000000)
        : totalAmountAvailable - fee;
      if (
        totalAmountAvailable - satoshiToSend - fee < 0 ||
        totalAmountAvailable < fee
      ) {
        throw new Error(
          `not enough balance totalAmountAvailable: ${totalAmountAvailable} - satoshiToSend: ${satoshiToSend} - fee: ${fee} = ${
            (totalAmountAvailable - satoshiToSend - fee) / 10 ** 8
          }`
        );
      }

      //Set transaction input
      transaction.from(inputs);
      // set the recieving address and the amount to send
      transaction.to(receiveAddress, Math.round(satoshiToSend));
      // Set change address - Address to receive the left over funds after transfer
      transaction.change(addressToSendChange);
      //manually set transaction fees: 20 satoshis per byte
      transaction.fee(Math.round(fee));
      // Sign transaction with your private key
      transaction.sign(sendWallet.privateKey);
      // serialize Transactions
      const serializedTransaction = transaction.serialize();
      // Send transaction
      const url = this._isMainNet
        ? `https://blockstream.info/api/tx`
        : `https://blockstream.info/testnet/api/tx`;

      const result = await axios({
        method: "POST",
        url: url,
        data: serializedTransaction,
      });
      return result.status == 200 || result.statusText == "OK"
        ? {
            data: {
              tx: result.data,
              amount: satoshiToSend / 10 ** 8,
              fee: Math.round(fee) / 10 ** 8,
            },
            status: true,
          }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
    }
  };
  // ok
  isTxSuccess = async (txHash) => {
    try {
      const url = this._isMainNet
        ? `https://blockstream.info/api/tx/${txHash}`
        : `https://blockstream.info/testnet/api/tx/${txHash}`;
      const resp = await axios({
        method: "GET",
        url: url,
      });
      return (resp.status == 200 || resp.statusText == "OK") &&
        resp.data.status.confirmed
        ? { data: resp, status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
    }
  };
}

const wallet1 = {
  // bank funds
  // testnet
  privateKey:
    "aa5b18308f8576d4520559649d95c1cd7ab4d22e48415cb0d891ad78cf296dd2",
  address: "myNeUWabCGwNHsLFfof3CJyCigmRpWYAiN",
};
const wallet2 = {
  // testnet
  privateKey:
    "c3feef1630240060a3acfade422c0fd281c4ba7c71376c349c4a361af2740f38",
  address: "miwdcUfAmvd4ZQjtaf3mQjpbeSJrLLBPdH",
};
const wallet3 = {
  // mainnet
  privateKey:
    "8f138d7c11c99f3c5b9fb1c4a6d434bb91b472fc30ae2f3d555b964f0a469455",
  address: "14tYZndF18q8XQbKVi4fYsbVG13TRt6i8F",
};
const wallet4 = {
  privateKey:
    "ad289e4d92e162c11e8879d5d8ca0569726185a5e51e7ddfdec7c81aa56da889",
  address: "moA1QQMJ21SFZE8gAZnPMSHHTUdm4Cndgt",
};

const main = async () => {
  const bitcoin = new BitcoinImpl(false);
  // 0.0015
  console.log(
    (await bitcoin.isTxSuccess(
      "63697cf6980920daa22240c7c800031d50d4b8febb3a932b9e21f9ab70c7ecc1"
    )).status
  );
  // console.log(`wallet2: `, await bitcoin.getBTCBalance(wallet2.address));
  // console.log(`wallet3: `, await bitcoin.getBTCBalance(wallet4.address));

  // const balance = await bitcoin.sendBitcoin(
  //   wallet4.privateKey,
  //   wallet1.address,
  //   wallet4.address,
  //   null,
  //   1
  // );
  // console.log(balance);
  // 0.00000257

  // const bitcoinWallet = bitcoin.createWallet();
  // console.log(bitcoinWallet);
  // const encryptedWallet = bitcoin.encryptWallet(bitcoinWallet);
  // console.log(encryptedWallet);
  // const decryptedWallet = bitcoin.decryptWallet(encryptedWallet);
  // console.log(JSON.parse(decryptedWallet));
  // console.log(
  //   "wallet and decrypted wallet is the same: ",
  //   bitcoinWallet.address == JSON.parse(decryptedWallet).address &&
  //     bitcoinWallet.privateKey == JSON.parse(decryptedWallet).privateKey
  // );
  // const sendBitcoin = await bitcoin.sendBitcoin(
  //   wallet1,
  //   wallet2.address,
  //   wallet1.address,
  //   0.0005
  // );
  // console.log(await bitcoin.getBTCBalance(wallet2.address))
  // const checkTxComplete = await bitcoin.isTxSuccess('d8b25e9b27507af19fe8cad3574fbd4eb88b856c4a1ce20da64ca51a26aeaae4')
  // if(checkTxComplete.status) {
  //   txData = checkTxComplete.data.data
  //   console.log(checkTxComplete.data)
  // } else {
  //   console.log('check tx caught error: ', checkTxComplete.data)
  // }
  // console.log(
  //   `wallet1 ${isMainNet ? "in mainnet" : "in test net"} is valid: `,
  //   await bitcoin._isAddressValid(wallet1.address)
  // );
  // console.log(
  //   `wallet2 ${isMainNet ? "in mainnet" : "in test net"} is valid: `,
  //   await bitcoin._isAddressValid(wallet2.address)
  // );
  // console.log(
  //   `balance of wallet1 in ${isMainNet ? "mainnet" : "testnet"} is: `,
  //   await bitcoin.getBTCBalance(wallet1.address)
  // );
  // console.log(
  //   `balance of wallet2 in ${isMainNet ? "mainnet" : "testnet"} is: `,
  //   await bitcoin.getBTCBalance(wallet2.address)
  // );
};

// main();

module.exports = BitcoinImpl;
