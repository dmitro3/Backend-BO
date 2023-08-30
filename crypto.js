const crypto = require("crypto");
const bitcoin = require("bitcoinjs-lib");
require("dotenv").config();
// check file .env: BTC_ENCRYPT_PASSWORD, SALT, ITERATIONS, KEYLEN, DIGEST
class Cryptor {
  constructor(isMainNet) {
    this._algorithm = "aes-256-cbc";
    this._encryptBTCPassword = process.env.BTC_ENCRYPT_PASSWORD;
    this._salt = process.env.SALT;
    this._iterations = process.env.ITERATIONS;
    this._keylen = process.env.KEYLEN;
    this._digest = process.env.DIGEST;
    this._isMainNet = isMainNet;
  }
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

  encrypt = (jsonWallet) => {
    if (!jsonWallet || !jsonWallet.privateKey || !jsonWallet.address)
      return "encrypt fail no jsonWallet";
    if (!this._isAddressValid(jsonWallet.address)) return "address invalid";
    const key = this._getKey();
    if (!key || key.length != 32) return `encrypt fail: ${key}`;
    const iv = crypto.randomBytes(16);
    const jsonData = JSON.stringify(jsonWallet);
    const cipher = crypto.createCipheriv(this._algorithm, key, iv);
    let encryptedData = cipher.update(jsonData, "utf8", "hex");
    encryptedData += cipher.final("hex");
    return { encrypted_data: encryptedData, iv: iv };
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
}

module.exports = Cryptor;
