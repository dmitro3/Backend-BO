const crypto = require("crypto");
const path = require("path");
const bitcoin = require("bitcoinjs-lib");
const NodeRSA = require("node-rsa");
const fs = require("fs");
const { format } = require("date-fns");
const dotenv = require("dotenv");
dotenv.config();

class Cryptor {
  constructor(isMainNet) {
    this._algorithm = "aes-256-cbc";
    this._encryptBTCPassword = process.env.BTC_ENCRYPT_PASSWORD;
    this._salt = process.env.SALT;
    this._iterations = process.env.ITERATIONS;
    this._keylen = process.env.KEYLEN;
    this._digest = process.env.DIGEST;
    this._isMainNet = isMainNet;
    this._privateKeyPath = process.env.PRIV_KEY_PATH;
    this._publicKeyPath = process.env.PUB_KEY_PATH;
  }

  _isAddressValid = (address) => {
    const network = this._isMainNet
      ? bitcoin.networks.bitcoin
      : bitcoin.networks.testnet;
    try {
      bitcoin.address.fromBase58Check(address, network);
      return true;
    } catch (error) {
      return false;
    }
  };

  // symetrics
  _getKey = () => {
    try {
      if (
        !this._encryptBTCPassword ||
        !this._salt ||
        !this._iterations ||
        !this._keylen ||
        !this._digest
      ) {
        return `can't get key`;
      }
      return crypto.pbkdf2Sync(
        this._encryptBTCPassword,
        this._salt,
        parseInt(this._iterations),
        parseInt(this._keylen),
        this._digest
      );
    } catch (error) {
      if (error) return `can't get key`;
    }
  };

  _getIVBuffer = (ivString) => {
    try {
      if (!ivString) return "can get iv";
      return Buffer.from(ivString, "hex");
    } catch (error) {
      if (error) return "can get iv";
    }
  };

  encrypt = (jsonWallet) => {
    // if (!jsonWallet || !jsonWallet.privateKey || !jsonWallet.address)
    //   return "encrypt fail no jsonWallet";
    // if (!this._isAddressValid(jsonWallet.address)) return "address invalid";
    const key = this._getKey();
    if (!key || key.length != 32) return `encrypt fail: ${key}`;
    const iv = crypto.randomBytes(16);
    const jsonData = JSON.stringify(jsonWallet);
    const cipher = crypto.createCipheriv(this._algorithm, key, iv);
    let encryptedData = cipher.update(jsonData, "utf8", "hex");
    encryptedData += cipher.final("hex");
    return { encrypted_data: encryptedData, iv: iv.toString('hex') };
  };

  decrypt = ({ encrypted_data, iv }) => {
    if (!iv || !encrypted_data)
      return "decrypt fail no iv or no encrypted_data";
    const key = this._getKey();
    const ivBuffer = this._getIVBuffer(iv);
    if (!key || !ivBuffer || key.length != 32 || ivBuffer.length != 16)
      return "decrypt fail no key or no iv";
    const decipher = crypto.createDecipheriv(this._algorithm, key, ivBuffer);
    let decryptedData = decipher.update(encrypted_data, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    return JSON.parse(decryptedData);
  };

  // asymetrics
  generateKeyPairAndUpdateKeyPath = () => {
    try {
      const rsaKey = new NodeRSA({ b: 2048 });
      const privateKey = rsaKey.exportKey("pkcs8-private");
      const publicKey = rsaKey.exportKey("pkcs8-public");
      const currentDate = new Date();
      const dateStr = format(currentDate, "yyyy-MM-dd_HH:mm:ss");

      fs.writeFileSync(
        path.resolve(__dirname, `./cryptoKey/privateKey_${dateStr}.pem`),
        privateKey
      );
      fs.writeFileSync(
        path.resolve(__dirname, `./cryptoKey/publicKey_${dateStr}.pem`),
        publicKey
      );

      const envFilePath = path.resolve(__dirname, "../.env");
      const envContent = fs.readFileSync(envFilePath, "utf8");
      const envVariables = dotenv.parse(envContent);

      envVariables.PRIV_KEY_PATH = path.resolve(
        __dirname,
        `./cryptoKey/privateKey_${dateStr}.pem`
      );
      envVariables.PUB_KEY_PATH = path.resolve(
        __dirname,
        `./cryptoKey/publicKey_${dateStr}.pem`
      );

      const updatedEnvContent = Object.entries(envVariables)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      fs.writeFileSync(envFilePath, updatedEnvContent);
    } catch (error) {
      console.log(error);
    }
  };

  _deleteKey = (keyType) => {
    try {
      if (keyType != "privKey" && keyType != "pubKey")
        throw Error("key type invalid");
      const keyPath =
        keyType == "privKey" ? this._privateKeyPath : this._publicKeyPath;
      fs.unlinkSync(path.resolve(__dirname, keyPath));
      return { status: true, message: "delete key success" };
    } catch (err) {
      return { status: false, message: err };
    }
  };

  _getPrivateKey = (keyContent) => {
    try {
      if (!keyContent) return null;
      if (!keyContent.includes(`BEGIN PRIVATE KEY`)) return null;
      const key = new NodeRSA();
      return key.importKey(keyContent, "pkcs8-private");
    } catch (error) {
      return null;
    }
  };

  _getPublicKey = () => {
    try {
      if (!this._publicKeyPath) return null;
      let publicKey = fs.readFileSync(
        path.resolve(__dirname, this._publicKeyPath),
        "utf8"
      );
      if (!publicKey) return null;
      const key = new NodeRSA();
      return key.importKey(publicKey, "pkcs8-public");
    } catch (error) {
      return null;
    }
  };

  encryptByPublicKey = (jsonWallet) => {
    try {
      const key = this._getPublicKey();
      if (!key) throw Error("Cannot get Key");
      return typeof jsonWallet == "object"
        ? key.encrypt(JSON.stringify(jsonWallet), "base64")
        : key.encrypt(jsonWallet, "base64");
    } catch (error) {
      return null;
    }
  };

  decryptByPrivateKey = (encryptedWallet, keyContent) => {
    try {
      const key = this._getPrivateKey(keyContent);
      if (!key) throw Error("Cannot get Key");
      return key.decrypt(encryptedWallet, "utf8");
    } catch (error) {
      return null;
    }
  };
}

module.exports = Cryptor;




