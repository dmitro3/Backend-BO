const { PrivateKey } = require("bitcore-lib");
const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const axios = require("axios");
const bitcore = require("bitcore-lib");

class BitcoinImpl {
  constructor(isMainNet) {
    this._isMainNet = isMainNet;
  }
  // ok
  createWallet = () => {
    const netWork = this._isMainNet ? mainnet : testnet;
    var privateKey = new PrivateKey();
    var address = privateKey.toAddress(netWork);
    console.log(this._isMainNet ? "mainnet" : "testnet");
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
      if (!this._isAddressValid(walletAddress))
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
        return totalAmountAvailable / 10 ** 8;
      } else {
        throw Error("get utxos caught error");
      }
    } catch (error) {
      return `Lỗi không mong muốn getBTCBalance ${error}`;
    }
  };
  // chắc chắn gửi tiền đến địa chỉ ví hợp lệ 
  sendBitcoin = async (
    sendWallet,
    receiveAddress,
    addressToSendChange,
    amountToSend
  ) => {
    try {
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

      const getFee = await this._getFee(amountToSend ? 5 : 1);
      if (getFee.status) {
        recommendedFee = getFee.data;
      } else {
        throw Error("cannot get fee");
      }

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

      fee = transactionSize * recommendedFee; // satoshi per byte

      const satoshiToSend = amountToSend
        ? Math.round(amountToSend * 100000000)
        : totalAmountAvailable - fee;

      if (totalAmountAvailable - satoshiToSend - fee < 0) {
        throw new Error(
          `not enough balance totalAmountAvailable: ${totalAmountAvailable} - satoshiToSend: ${satoshiToSend} - fee: ${fee} = ${
            (totalAmountAvailable - satoshiToSend - fee) / 10 ** 8
          }`
        );
      }

      //Set transaction input
      transaction.from(inputs);
      // set the recieving address and the amount to send
      transaction.to(receiveAddress, satoshiToSend);
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
        ? { data: result.data, status: true }
        : { data: null, status: false }
    } catch (error) {
      return { data: error, status: false };
    }
  };
  // ok
  isTxComplete = async (txHash) => {
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

const main = async () => {
  const isMainNet = process.argv[2] == "1" ? true : false;
  const bitcoin = new BitcoinImpl(isMainNet);

  // const sendBitcoin = await bitcoin.sendBitcoin(
  //   wallet1,
  //   wallet2.address,
  //   wallet1.address,
  //   0.0005
  // );
  // console.log(await bitcoin.getBTCBalance(wallet2.address))


  // const checkTxComplete = await bitcoin.isTxComplete('d8b25e9b27507af19fe8cad3574fbd4eb88b856c4a1ce20da64ca51a26aeaae4')
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

main();

// d8b25e9b27507af19fe8cad3574fbd4eb88b856c4a1ce20da64ca51a26aeaae4

module.exports = BitcoinImpl;
