const { PrivateKey } = require("bitcore-lib");

const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");

const createWallet = (network = testnet) => {
  var privateKey = new PrivateKey();
  var address = privateKey.toAddress(network);
  return {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };
};

const axios = require("axios");
const bitcore = require("bitcore-lib");
const TESTNET = true;

const sendBitcoin = async (sendWallet, recieverWallet, amountToSend) => {
  // chuyển tiền và tiền thừa trong utxo về ví người nhận
  try {
    const satoshiToSend = Math.round(amountToSend * 100000000);
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;
    debugger;
    // const recommendedFee = await axios.get(
    //   "https://bitcoinfees.earn.com/api/v1/fees/recommended"
    // );

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];

    const resp = await axios({
      method: "GET",
      url: `https://blockstream.info/testnet/api/address/${sendWallet.address}/utxo`,
    });
    const utxos = resp.data;

    for (const utxo of utxos) {
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

    /**
     * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
     * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
     * from the transaction as well.
     * */
    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;

    // fee = (transactionSize * recommendedFee.data.hourFee) / 3; // satoshi per byte
    if (TESTNET) {
      fee = transactionSize * 1; // 1 sat/byte is fine for testnet
    }
    debugger;
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }
    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(recieverWallet.address, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(recieverWallet.address);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(Math.round(fee));

    // Sign transaction with your private key
    transaction.sign(sendWallet.privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();
    debugger;
    // Send transaction
    const result = await axios({
      method: "POST",
      url: `https://blockstream.info/testnet/api/tx`,
      data: serializedTransaction,
    });
    return result.data;
  } catch (error) {
    debugger;
    return error;
  }
};
const getBTCutxos = async (theWallet) => {
  const resp = await axios({
    method: "GET",
    url: `https://blockstream.info/testnet/api/address/${theWallet.address}/utxo`,
  });
  console.log(resp.data);
};



const wallet = {
  privateKey:
    "aa5b18308f8576d4520559649d95c1cd7ab4d22e48415cb0d891ad78cf296dd2",
  address: "myNeUWabCGwNHsLFfof3CJyCigmRpWYAiN",
};
const hdWallet = {
  xpub: "tpubD6NzVbkrYhZ4XeunZEo12ffFs67LXszDEqG1Rjn7ehJQznzgd99pbszmyHXtRApDHSHo2DeGfswBUxwiRvCrKaUX3KVAhxeXLzKx6CxinKX",
  privateKey:
    "a6cd0dad540944788794e325798dfa9f39baf1085682510e08611fb47037d62f",
  address: "mgiQkxMZ2y9yYSTQRQEjs1UCpkYUMsyNi2",
  mnemonic:
    "embudo letal válido aporte sopa bucle flúor núcleo regla legión viejo equipo",
};

const Cryptor = require('./crypto')
const cryptoObject = new Cryptor(false)
const encryptedWallet = cryptoObject.encrypt(wallet)
console.log('Here is encrypted Wallet: ', encryptedWallet)
const decryptedWallet = cryptoObject.decrypt(encryptedWallet)
console.log('Here is decrypted Wallet: ', decryptedWallet)
