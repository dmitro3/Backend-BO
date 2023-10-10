const Web3 = require("web3");
const ethereumUtil = require("ethereumjs-util");
const axios = require("axios");
const contractInfo = require("../config/contractInfo");
const { parseUnits } = require("ethers/lib/utils");
const BigNumber = require("bignumber.js");
const Crypto = require("./crypto");
require("dotenv").config();

class EVMImpl {
  // network eth-testnet, eth-mainnet, bnb-testnet, bnb-mainnet, matic-testnet, matic-mainnet
  _bscScanApi = process.env.BSC_SCAN_API;
  _ethScanApi = process.env.ETH_SCAN_API;
  _maticScanApi = process.env.MATIC_SCAN_API;
  _encryptEVMPassword = process.env.EVM_ENCRYPT_PASSWORD;
  _urlWssEthMainNet = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlWssEthTestNet = `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlWssMaticMainNet = `wss://polygon-mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlWssMaticTestNet = `wss://polygon-mumbai.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlWssBnbMainNet = `wss://bsc.getblock.io/${process.env.GETBLOCK_KEY}/mainnet/`;
  _urlWssBnbTestNet = `wss://bsc.getblock.io/${process.env.GETBLOCK_KEY}/testnet/`;
  _urlHttpEthMainNet = `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`;
  _urlHttpEthTestNet = `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`;
  _urlHttpMaticMainNet = `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`;
  _urlHttpMaticTestNet = `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`;
  _urlHttpBnbMainNet = `https://bsc.getblock.io/${process.env.GETBLOCK_KEY}/mainnet/`;
  _urlHttpBnbTestNet = `https://bsc.getblock.io/${process.env.GETBLOCK_KEY}/testnet/`;

  constructor(network) {
    this._network = network;
    switch (network) {
      case "eth-mainnet":
        this._rpcUrlWss = this._urlWssEthMainNet;
        this._rpcUrlHttp = this._urlHttpEthMainNet;
        this._usdtABI = contractInfo.usdtEthMainnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtEthMainnetContractInfo.address;
        this._usdcABI = contractInfo.usdcEthMainnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcEthMainnetContractInfo.address;
        this._crypto = new Crypto(true);
        break;
      case "eth-testnet":
        this._rpcUrlWss = this._urlWssEthTestNet;
        this._rpcUrlHttp = this._urlHttpEthTestNet;
        this._usdtABI = contractInfo.usdtEthTestnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtEthTestnetContractInfo.address;
        this._usdcABI = contractInfo.usdcEthTestnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcEthTestnetContractInfo.address;
        this._crypto = new Crypto(false);
        break;
      case "matic-mainnet":
        this._rpcUrlWss = this._urlWssMaticMainNet;
        this._rpcUrlHttp = this._urlHttpMaticMainNet;
        this._usdtABI = contractInfo.usdtMaticMainnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtMaticMainnetContractInfo.address;
        this._usdcABI = contractInfo.usdcMaticMainnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcMaticMainnetContractInfo.address;
        this._crypto = new Crypto(true);
        break;
      case "matic-testnet":
        this._rpcUrlWss = this._urlWssMaticTestNet;
        this._rpcUrlHttp = this._urlHttpMaticTestNet;
        this._usdtABI = contractInfo.usdtMaticTestnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtMaticTestnetContractInfo.address;
        this._usdcABI = contractInfo.usdcMaticTestnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcMaticTestnetContractInfo.address;
        this._crypto = new Crypto(false);
        break;
      case "bnb-mainnet":
        this._rpcUrlWss = this._urlWssBnbMainNet;
        this._rpcUrlHttp = this._urlHttpBnbMainNet;
        this._usdtABI = contractInfo.usdtBnbMainnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtBnbMainnetContractInfo.address;
        this._usdcABI = contractInfo.usdcBnbMainnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcBnbMainnetContractInfo.address;
        this._crypto = new Crypto(true);
        break;
      case "bnb-testnet":
        this._rpcUrlWss = this._urlWssBnbTestNet;
        this._rpcUrlHttp = this._urlHttpBnbTestNet;
        this._usdtABI = contractInfo.usdtBnbTestnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtBnbTestnetContractInfo.address;
        this._usdcABI = contractInfo.usdcBnbTestnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcBnbTestnetContractInfo.address;
        this._crypto = new Crypto(false);
        break;
      default:
        throw Error("network incorrect");
    }
    this.web3Wss = new Web3(
      new Web3.providers.WebsocketProvider(this._rpcUrlWss, {
        clientConfig: {
          maxReceivedFrameSize: 10000000000,
          maxReceivedMessageSize: 10000000000,
        },
      })
    );
    this.web3Http = new Web3(new Web3.providers.HttpProvider(this._rpcUrlHttp));
    this.usdtContract = new this.web3Wss.eth.Contract(
      this._usdtABI,
      this._usdtAddressContract
    );
    this.usdcContract = new this.web3Wss.eth.Contract(
      this._usdcABI,
      this._usdcAddressContract
    );
  }

  createWallet = () => {
    return this.web3Wss.eth.accounts.create();
  };

  encryptWallet = (wallet) => {
    try {
      if (!wallet || !wallet.privateKey) throw Error("wallet invalid");
      if (!this._isAddressValid(wallet.address)) throw Error("address invalid");
      return this._crypto.encryptByPublicKey(wallet);
    } catch (error) {
      return null;
    }
  };

  decryptWallet = (encryptedEVMWallet, privateKey) => {
    return this._crypto.decryptByPrivateKey(encryptedEVMWallet, privateKey);
  };

  getNativeTokenBalance = async (address) => {
    try {
      const balanceWei = await this.web3Wss.eth.getBalance(address);
      const decimals = this._network.includes("bnb") ? 8 : 18;
      let balanceNativeToken = this.web3Wss.utils.fromWei(balanceWei, "ether");
      balanceNativeToken = new BigNumber(balanceNativeToken).toFixed(decimals);
      return balanceNativeToken
        ? { data: balanceNativeToken, status: true }
        : { data: null, status: false };
    } catch (error) {
      debugger;
      return { data: error.message ? error.message : error, status: false };
    }
  };

  _isAddressValid = (address) => {
    try {
      return this.web3Wss.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  _isPrivateKeyValid = (privKey) => {
    try {
      return ethereumUtil.isValidPrivate(
        Buffer.from(
          privKey.startsWith("0x") ? privKey.slice(2) : privKey,
          "hex"
        )
      );
    } catch (error) {
      return false;
    }
  };

  _getGas = async (recipientAddress) => {
    try {
      const gasPriceWei = await this.web3Wss.eth.getGasPrice();
      const gasEstimate = await this.web3Wss.eth.estimateGas({
        to: recipientAddress,
        data: "0x", // Dữ liệu rỗng cho native token
      });
      return {
        data: {
          gasEstimate: gasEstimate ? gasEstimate : 21000,
          gasPriceWei: gasPriceWei,
        },
        status: true,
      };
    } catch (error) {
      return { data: error.message ? error.message : error, status: false };
    }
  };

  isTxSuccess = async (txHash) => {
    try {
      let url = "";
      switch (this._network) {
        case "eth-mainnet":
          url = `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this._ethScanApi}`;
          break;
        case "eth-testnet":
          url = `https://api-sepolia.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this._ethScanApi}`;
          // url = `https://api-sepolia.etherscan.io/api?module=account&action=txlistinternal&txhash=${txHash}&apikey=${this._ethScanApi}`;
          break;
        case "matic-mainnet":
          url = `https://api.polygonscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this._maticScanApi}`;
          break;
        case "matic-testnet":
          url = `https://api-testnet.polygonscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this._maticScanApi}`;
          break;
        case "bnb-mainnet":
          url = `https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this._bscScanApi}`;
          break;
        case "bnb-testnet":
          url = `https://api-testnet.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this._bscScanApi}`;
          break;
        default:
          throw Error("network incorrect");
      }
      const checkScan = await axios.get(url);
      if (
        checkScan.status == 200 &&
        checkScan.data.status &&
        checkScan.data.result.status
      ) {
        return {
          data: checkScan,
          status: checkScan.data.result.status ? true : false,
        };
      } else {
        return { data: null, status: false };
      }
    } catch (error) {
      return { data: error.message ? error.message : error, status: false };
    }
  };

  sendNativeToken = async (
    senderPrivateKey,
    receiverAddress,
    amount,
    gasPriceMultiplier
  ) => {
    try {
      if (!this._isAddressValid(receiverAddress))
        throw Error(`receive address invalid: ${receiverAddress}`);
      if (!this._isPrivateKeyValid(senderPrivateKey))
        throw Error(`sender private key invalid ${senderPrivateKey}`);

      const senderAccount =
        this.web3Wss.eth.accounts.privateKeyToAccount(senderPrivateKey);

      const nonce = await this.web3Wss.eth.getTransactionCount(
        senderAccount.address,
        "latest"
      );

      const balanceWei = await this.web3Wss.eth.getBalance(
        senderAccount.address
      );

      const getGas = await this._getGas(receiverAddress);

      if (getGas.status == false) throw Error("get gas caught error");

      const { gasPriceWei, gasEstimate } = getGas.data;

      const gasFeeWei = gasEstimate * gasPriceWei;

      const decimals = this._network.includes("bnb") ? 8 : 18;
      const bigNumber = new BigNumber(amount);
      const weiToSend = amount
        ? this.web3Wss.utils.toWei(bigNumber.toFixed(decimals), "ether")
        : balanceWei - gasFeeWei;
      if (
        parseInt(balanceWei) < parseInt(weiToSend) + parseInt(gasFeeWei) ||
        parseInt(balanceWei) < parseInt(gasFeeWei)
      ) {
        throw new Error(
          `not enough balance balanceWei: ${balanceWei}, weiToSend: ${weiToSend}, gasFeeWei: ${gasFeeWei}`
        );
      }

      const txObject = {
        nonce: this.web3Wss.utils.toHex(nonce),
        gasPrice: !gasPriceMultiplier
          ? this.web3Wss.utils.toHex(gasPriceWei)
          : this.web3Wss.utils.toHex(
              Math.round(gasPriceWei * gasPriceMultiplier)
            ),
        to: receiverAddress,
        value: this.web3Wss.utils.toHex(weiToSend),
        gas: this.web3Wss.utils.toHex(gasEstimate),
      };

      const signedTx = await senderAccount.signTransaction(txObject);
      const tx = await this.web3Wss.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return tx.status
        ? {
            data: {
              tx: tx.transactionHash,
              amount: this.web3Wss.utils.fromWei(weiToSend.toString(), "ether"),
              fee: this.web3Wss.utils.fromWei(gasFeeWei.toString(), "ether"),
            },
            status: true,
          }
        : { data: null, status: false };
    } catch (error) {
      debugger;
      return { data: error.message ? error.message : error, status: false };
    }
  }; // gửi xong lưu txHash lại để về sau kiểm tra xem success hết chưa

  // ERC20
  getTokenBalance = async (address, tokenName) => {
    try {
      const contract =
        tokenName == "usdt"
          ? this.usdtContract
          : "usdc"
          ? this.usdcContract
          : "";
      const balanceWei = await contract.methods.balanceOf(address).call();
      const decimals = await contract.methods.decimals().call();
      const balanceUSDT = balanceWei / 10 ** decimals;
      return { data: balanceUSDT.toFixed(6), status: true };
    } catch (error) {
      return { data: error.message ? error.message : error, status: false };
    }
  };

  _getFeeToSendCoin = async (
    tokenName,
    senderAddress,
    recipientAddress,
    amount
  ) => {
    try {
      if (!["usdt", "usdc"].includes(tokenName))
        throw Error("Token name incorrect");
      const contract =
        tokenName == "usdt"
          ? this.usdtContract
          : "usdc"
          ? this.usdcContract
          : "";
      const decimals = await contract.methods.decimals().call();
      const gas = await contract.methods
        .transfer(
          recipientAddress,
          parseUnits(
            new BigNumber(amount).toFixed(parseInt(decimals)),
            decimals
          ).toString()
        ) // 29.999.970 usd is maximum of in tx
        .estimateGas({ from: senderAddress });
      const gasPrice = await this.web3Wss.eth.getGasPrice();
      const gasFeeWei = gas * gasPrice;
      const gasFee = this.web3Wss.utils.fromWei(gasFeeWei.toString(), "ether");
      return gas && gasPrice && gasFee
        ? { data: { gas, gasPrice, gasFee }, status: true }
        : { data: null, status: false };
    } catch (error) {
      debugger
      return { data: error.message ? error.message : error, status: false };
    }
  };

  amountNativeTokenNeededToSendErc20 = async (
    tokenName,
    senderAddress,
    adminWalletAddress,
    amount
  ) => {
    try {
      const getFee = await this._getFeeToSendCoin(
        tokenName,
        senderAddress,
        adminWalletAddress,
        amount
      );

      if (!getFee.status) throw Error("get fee caught Errror");

      const { gas, gasPrice, gasFee } = getFee.data;
      const getNativeTokenBalance = await this.getNativeTokenBalance(
        senderAddress
      );
      if (!getNativeTokenBalance.status) throw Error("get native token failed");

      if (
        new BigNumber(getNativeTokenBalance.data).isLessThan(BigNumber(gasFee))
      ) {
        return {
          data: gasFee,
          status: true,
        };
      } else {
        return {
          data: 0,
          status: true,
        };
      }
    } catch (error) {
      debugger;
      return { data: error.message ? error.message : error, status: false };
    }
  };

  sendToken = async (
    senderPrivateKey,
    receiverAddress,
    tokenName,
    amount,
    gasPriceMultiplier
  ) => {
    try {
      if (!tokenName || new BigNumber(amount).isLessThanOrEqualTo(BigNumber(0)))
        throw Error("Token name incorrect or amount invalid");
      const contract =
        tokenName == "usdt"
          ? this.usdtContract
          : "usdc"
          ? this.usdcContract
          : "";
      const account = await this.web3Wss.eth.accounts.privateKeyToAccount(
        senderPrivateKey
      );
      const getFee = await this._getFeeToSendCoin(
        tokenName,
        account.address,
        receiverAddress,
        amount
      );
      if (!getFee.status) throw Error("Get Fee caught error");
      const decimals = await contract.methods.decimals().call();
      const contractFunction = contract.methods.transfer(
        receiverAddress,
        parseUnits(
          new BigNumber(amount).toFixed(parseInt(decimals)),
          decimals
        ).toString()
      );

      const { gas, gasPrice, gasFee } = getFee.data;

      const tx = {
        from: account.address,
        to: contract.options.address,
        gas: gas,
        gasPrice: !gasPriceMultiplier
          ? gasPrice
          : Math.round(gasPriceMultiplier * gasPrice),
        data: contractFunction.encodeABI(),
      };

      const signedTx = await this.web3Wss.eth.accounts.signTransaction(
        tx,
        senderPrivateKey
      );
      const txReceipt = await this.web3Wss.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return txReceipt.status
        ? { data: txReceipt.transactionHash, status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error.message ? error.message : error, status: false };
    }
  }; // gửi xong lưu txHash lại để về sau kiểm tra xem success hết chưa
}

module.exports = EVMImpl;

const wallet = {
  // have money in matic not safe anymore
  address: "0x24a36f3F812e21E129D49a0888E63BCf28C33215",
  privateKey:
    "0xec1d3901a3d3653319faa4f6439193dfb107f3c85b33b25e36b82507badcc3fc",
};
const metamaskWallet = {
  address: "0x59772e95C77Dd1575fB916DACDFabEF688cc7971",
  privateKey:
    "232f567845d6c965ba1212522ca590cf0bf7473df0b02f67d227be7ab91b8ad2",
};
const richWallet = {
  // have money in matic
  address: "0x33C6D9501E8aE68227fa46Cf9dBFc181EA979971",
  privateKey: process.env.WALLET_POLYGON_PRIVATE_KEY,
};

const main = async (times) => {
  const evmImml1 = new EVMImpl("bnb-testnet");
  console.log(
    (
      await evmImml1.amountNativeTokenNeededToSendErc20(
        "usdt",
        "0x8Ae458fe172d87A73579Db8ecfb17AD1e101B32a",
        "0x59772e95C77Dd1575fB916DACDFabEF688cc7971",
        10
      )
    ).data
  );
};

// main(20);
