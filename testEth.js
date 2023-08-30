const Web3 = require("web3");
const axios = require("axios");

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://bsc.getblock.io/d467b2c6-6450-4b3e-a670-0c7deb4f2a2a/testnet/"
  )
);
require("dotenv").config();

const bscScanApi = process.env.BSC_SCAN_API;
const encryptPassword = process.env.EVM_ENCRYPT_PASSWORD;

const wallet = web3.eth.accounts.create();
const firstEncrypt = wallet.encrypt(encryptPassword);
const secondEncrypt = web3.eth.accounts.encrypt(
  wallet.privateKey,
  encryptPassword
);

const firstDecrypt = web3.eth.accounts.decrypt(firstEncrypt, encryptPassword);
const secondDecrypt = web3.eth.accounts.decrypt(secondEncrypt, encryptPassword);

async function checkBalance(address) {
  // phục vụ cho user gửi tiền
  try {
    const balanceWei = await web3.eth.getBalance(address);
    const balanceNativeToken = web3.utils.fromWei(balanceWei, "ether");

    console.log(`Balance of ${address}: ${balanceNativeToken} ETH`);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendAndTrackTransaction(senderPrivateKey, receiverAddress) {
  try {
    const senderAccount =
      web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

    const nonce = await web3.eth.getTransactionCount(senderAccount.address);
    const gasPrice = await web3.eth.getGasPrice();

    const balanceWei = await web3.eth.getBalance(senderAccount.address);

    const gasLimit = 21000; // Số gas cố định cho việc gửi ETH/BNB

    const txObject = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice),
      to: receiverAddress,
      value: web3.utils.toHex(balanceWei - gasPrice * gasLimit), // Trừ phí gas
      gas: web3.utils.toHex(gasLimit),
    };

    const signedTx = await senderAccount.signTransaction(txObject);

    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    if (tx.transactionHash) {
      const apiUrl = `https://api-testnet.bscscan.com/api?module=transaction&action=getstatus&txhash=${tx.transactionHash}&apikey=${bscScanApi}`;
      const checkBscScan = await axios.get(apiUrl);
      const status =
        checkBscScan.data.result.isError === "0" ? "Success" : "Fail";
      if (status == "Success") {
        console.log("check bsc scan ok");
      } else {
        console.log("check bsc scan lỗi");
      }
    } else {
      console.log("check bsc scan lỗi");
    }
  } catch (error) {
    console.error("Bo Me Roi:", error);
  }
}

const senderPrivateKey =
  "0x8a07d2d230dcb97272576b6a4f8841f06cf4b865a9d6e241925287421bd57b00"; // Thay bằng private key của ví gửi
const receiverAddress = "0x59772e95C77Dd1575fB916DACDFabEF688cc7971"; // Thay bằng địa chỉ ví nhận

// const walletEcrypted = {
//   version: 3,
//   id: "409ff035-f32f-4ad4-8b35-b8600c436778",
//   address: "9a7ed79be424e40aa965729e2b94cb5b78e8bce3",
//   crypto: {
//     ciphertext:
//       "beb145739ece1715fa3af2e190f784ab381856caf890bad75d9a947c650d47d6",
//     cipherparams: { iv: "27e1a24f78ff7ccb4555e43cd67e9325" },
//     cipher: "aes-128-ctr",
//     kdf: "scrypt",
//     kdfparams: {
//       dklen: 32,
//       salt: "6a84697eb2090e1a873c85429f64972e00388cb953ad588a2355e4c3cb07744a",
//       n: 8192,
//       r: 8,
//       p: 1,
//     },
//     mac: "528395a61d39da7c73a50527f9f997d7ae976fbdb0c4c5a2356a1182e25ec8bf",
//   },
// };
// address: '0x9a7ed79Be424E40AA965729E2B94cb5B78E8BCe3',
// privateKey: '0x8a07d2d230dcb97272576b6a4f8841f06cf4b865a9d6e241925287421bd57b00',
