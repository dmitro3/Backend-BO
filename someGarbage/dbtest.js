const db = require("./database");

const btcWallet = {
  encrypted_data:
    "6aa272091c2793609b4d4edb4a5bee3f96a12770345e912ef71e71f2db178e7f981d0a4b7ccb690c0328f0e3d815aaa1d8381ad7b6508df9dea2ba52c93e61c9129366026e1bdb832261ae6087d9f34206ad1b00aca0dfc09c9bbcce0c8bf48a8e922487e85a925b02b1d5af36288af9fde007c32fceb7f7b11beb86b05bce0db9de0bbec65701dd21bed5d5a56a4889",
  iv: "c88c9285bc5dc69febad78298262f99b",
};

const evmWallet = {
  version: 3,
  id: "409ff035-f32f-4ad4-8b35-b8600c436778",
  address: "9a7ed79be424e40aa965729e2b94cb5b78e8bce3",
  crypto: {
    ciphertext:
      "beb145739ece1715fa3af2e190f784ab381856caf890bad75d9a947c650d47d6",
    cipherparams: { iv: "27e1a24f78ff7ccb4555e43cd67e9325" },
    cipher: "aes-128-ctr",
    kdf: "scrypt",
    kdfparams: {
      dklen: 32,
      salt: "6a84697eb2090e1a873c85429f64972e00388cb953ad588a2355e4c3cb07744a",
      n: 8192,
      r: 8,
      p: 1,
    },
    mac: "528395a61d39da7c73a50527f9f997d7ae976fbdb0c4c5a2356a1182e25ec8bf",
  },
};

const updateWalletForUser = async (btc, evm, email) => {
  db.query(
    `update users set crypted_evm_wallet = ?, crypted_btc_wallet = ? where email = ?`,
    [JSON.stringify(evm), JSON.stringify(btc), email],
    (err, res) => {
      if (err) console.log(err);
      if (res) console.log("update user wallet success");
    }
  );
};

require("dotenv").config();
const crypto = require("crypto");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://bsc.getblock.io/d467b2c6-6450-4b3e-a670-0c7deb4f2a2a/testnet/"
  )
);

const getWallet = async (email) => {
  db.query(
    `select crypted_evm_wallet, crypted_btc_wallet from users where email = ?`,
    [email],
    (err, res) => {
      if (err) console.log(err);
      const encryptedEVM = JSON.parse(res[0].crypted_evm_wallet);
      const encryptedBTC = JSON.parse(res[0].crypted_btc_wallet);
      // get evm wallet
      const encryptEVMPassword = process.env.EVM_ENCRYPT_PASSWORD;
      const evmDecrypt = web3.eth.accounts.decrypt(
        encryptedEVM,
        encryptEVMPassword
      );
      console.log('evm wallet: ',evmDecrypt)
      // get btc wallet
      const algorithm = "aes-256-cbc";
      const encryptBTCPassword = process.env.BTC_ENCRYPT_PASSWORD;
      const key = crypto.pbkdf2Sync(
        encryptBTCPassword,
        "salt",
        100000,
        32,
        "sha256"
      );
      const iv = Buffer.from(encryptedBTC.iv, 'hex')
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decryptedData = decipher.update(encryptedBTC.encrypted_data, "hex", "utf8");
      decryptedData += decipher.final("utf8");
      console.log("btc wallet:", JSON.parse(decryptedData));
    }
  );
};
getWallet("dungdq3@gmail.com");
