const Web3 = require("web3");
const ethereumUtil = require("ethereumjs-util");
const axios = require("axios");
const contractInfo = require("./config/contractInfo");
const { parseUnits } = require("ethers/lib/utils");
require("dotenv").config();

class EVMImpl {
  _bscScanApi = process.env.BSC_SCAN_API;
  _ethScanApi = process.env.ETH_SCAN_API;
  _maticScanApi = process.env.MATIC_SCAN_API;
  _encryptEVMPassword = process.env.EVM_ENCRYPT_PASSWORD;
  _urlEthMainNet = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlEthTestNet = `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlMaticMainNet = `wss://polygon-mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlMaticTestNet = `wss://polygon-mumbai.infura.io/ws/v3/${process.env.INFURA_KEY}`;
  _urlBnbMainNet = `wss://bsc.getblock.io/${process.env.GETBLOCK_KEY}/mainnet/`;
  _urlBnbTestNet = `wss://bsc.getblock.io/${process.env.GETBLOCK_KEY}/testnet/`;
  constructor(network) {
    this._network = network;
    switch (network) {
      case "eth-mainnet":
        this._rpcUrl = this._urlEthMainNet;
        this._usdtABI = contractInfo.usdtEthMainnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtEthMainnetContractInfo.address;
        this._usdcABI = contractInfo.usdcEthMainnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcEthMainnetContractInfo.address;
        break;
      case "eth-testnet":
        this._rpcUrl = this._urlEthTestNet;
        break;
      case "matic-mainnet":
        this._rpcUrl = this._urlMaticMainNet;
        this._usdtABI = contractInfo.usdtMaticMainnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtMaticMainnetContractInfo.address;
        this._usdcABI = contractInfo.usdcMaticMainnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcMaticMainnetContractInfo.address;
        break;
      case "matic-testnet":
        this._rpcUrl = this._urlMaticTestNet;
        break;
      case "bnb-mainnet":
        this._rpcUrl = this._urlBnbMainNet;
        this._usdtABI = contractInfo.usdtBnbMainnetContractInfo.ABI;
        this._usdtAddressContract =
          contractInfo.usdtBnbMainnetContractInfo.address;
        this._usdcABI = contractInfo.usdcBnbMainnetContractInfo.ABI;
        this._usdcAddressContract =
          contractInfo.usdcBnbMainnetContractInfo.address;
        break;
      case "bnb-testnet":
        this._rpcUrl = this._urlBnbTestNet;
        break;
      default:
        throw Error("network incorrect");
    }
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(this._rpcUrl));
    this.usdtContract = new this.web3.eth.Contract(
      this._usdtABI,
      this._usdtAddressContract
    );
    this.usdcContract = new this.web3.eth.Contract(
      this._usdcABI,
      this._usdcAddressContract
    );
  }
  
  createEncryptedWallet = () => {
    const wallet = this.web3.eth.accounts.create();
    return wallet.encrypt(this._encryptEVMPassword);
  };

  decryptWallet = (encryptedEVMWallet) => {
    return this.web3.eth.accounts.decrypt(
      encryptedEVMWallet,
      this._encryptEVMPassword
    );
  };

  getNativeTokenBalance = async (address) => {
    try {
      const balanceWei = await this.web3.eth.getBalance(address);
      const balanceNativeToken = this.web3.utils.fromWei(balanceWei, "ether");
      return balanceNativeToken
        ? { data: balanceNativeToken, status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
    }
  };

  _isAddressValid = (address) => {
    try {
      return this.web3.utils.isAddress(address);
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
      const gasPriceWei = await this.web3.eth.getGasPrice();
      const gasEstimate = await this.web3.eth.estimateGas({
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
      return { data: error, status: false };
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
      if (checkScan.status == 200 && checkScan.data.status) {
        return {
          data: checkScan,
          status: checkScan.data.result.status ? true : false,
        };
      } else {
        return { data: null, status: false };
      }
    } catch (error) {
      return { data: error, status: false };
    }
  };

  sendNativeToken = async (senderPrivateKey, receiverAddress, amount) => {
    try {
      if (!this._isAddressValid(receiverAddress))
        throw Error(`receive address invalid: ${receiverAddress}`);
      if (!this._isPrivateKeyValid(senderPrivateKey))
        throw Error(`sender private key invalid ${senderPrivateKey}`);

      const senderAccount =
        this.web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

      const nonce = await this.web3.eth.getTransactionCount(
        senderAccount.address,
        "latest"
      );

      const balanceWei = await this.web3.eth.getBalance(senderAccount.address);

      const getGas = await this._getGas(receiverAddress);

      if (getGas.status == false) throw Error("get gas caught error");

      const { gasPriceWei, gasEstimate } = getGas.data;

      const gasFeeWei = gasEstimate * gasPriceWei;

      const weiToSend = amount
        ? this.web3.utils.toWei(amount.toString(), "ether")
        : balanceWei - gasFeeWei;

      if (balanceWei - weiToSend - gasFeeWei < 0) {
        throw new Error(
          `not enough balance balanceWei: ${balanceWei} - weiToSend: ${weiToSend} - gasFeeWei: ${gasFeeWei} = ${
            (balanceWei - weiToSend - gasFeeWei) / 10 ** 8
          }`
        );
      }
      const txObject = {
        nonce: this.web3.utils.toHex(nonce),
        gasPrice: this.web3.utils.toHex(gasPriceWei),
        to: receiverAddress,
        value: this.web3.utils.toHex(weiToSend),
        gas: this.web3.utils.toHex(gasEstimate),
      };

      const signedTx = await senderAccount.signTransaction(txObject);

      const tx = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return tx.transactionHash;
    } catch (error) {
      console.error("Bo Me Roi:", error);
    }
  }; // gửi xong lưu txHash lại để về sau kiểm tra xem success hết chưa 

  // ERC20
  getTokenBalance = async (address, tokenName) => {
    const contract =
      tokenName == "usdt" ? this.usdtContract : "usdc" ? this.usdcContract : "";
    const balanceWei = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    const balanceUSDT = balanceWei / 10 ** decimals;
    return balanceUSDT;
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
        .transfer(recipientAddress, parseUnits(amount.toString(), decimals))
        .estimateGas({ from: senderAddress });
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasFeeWei = gas * gasPrice;
      const gasFee = this.web3.utils.fromWei(gasFeeWei.toString(), "ether");
      return gas && gasPrice && gasFee
        ? { data: { gas, gasPrice, gasFee }, status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
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

      if (!getFee.status) throw Error("get fee caught Errro");

      const { gas, gasPrice, gasFee } = getFee.data;

      const nativeTokenBalance = await this.getNativeTokenBalance(
        senderAddress
      );

      if (nativeTokenBalance < gasFee) {
        return {
          data: {
            senderAddress: senderAddress,
            amount: gasFee - nativeTokenBalance,
          },
          status: true,
        };
      } else {
        return {
          data: { senderAddress: senderAddress, amount: 0 },
          status: true,
        };
      }
    } catch (error) {
      return { data: null, status: false };
    }
  };

  sendToken = async (senderPrivateKey, receiverAddress, tokenName, amount) => {
    try {
      if (!tokenName || amount <= 0)
        throw Error("Token name incorrect or amount invalid");
      const contract =
        tokenName == "usdt"
          ? this.usdtContract
          : "usdc"
          ? this.usdcContract
          : "";
      const account = await this.web3.eth.accounts.privateKeyToAccount(
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
        parseUnits(amount.toString(), decimals)
      );
      const { gas, gasPrice, gasFee } = getFee.data;

      const tx = {
        from: account.address,
        to: contract.options.address,
        gas: gas,
        gasPrice: gasPrice,
        data: contractFunction.encodeABI(),
      };

      const signedTx = await this.web3.eth.accounts.signTransaction(
        tx,
        senderPrivateKey
      );
      const txReceipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return txReceipt.status
        ? { data: txReceipt.transactionHash, status: true }
        : { data: null, status: false };
    } catch (error) {
      return { data: error, status: false };
    }
  }; // gửi xong lưu txHash lại để về sau kiểm tra xem success hết chưa 
}

const wallet = {
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
  address: "0x33C6D9501E8aE68227fa46Cf9dBFc181EA979971",
  privateKey: process.env.WALLET_POLYGON_PRIVATE_KEY,
};

const main = async () => {
  try {
    const network = process.argv[2];
    const evmImml = new EVMImpl(network);

    const isTxSuccess = await evmImml.isTxSuccess("0xd396bcad11fb4abd0d30a423614cbc9dd08e8b725678454e4500c9f43dc112ec")

    if (isTxSuccess.status) console.log(isTxSuccess.data)

    // const getFee = await evmImml._getFeeToSendCoin(
    //   "usdt",
    //   richWallet.address,
    //   wallet.address,
    //   0.1
    // );
    // console.log(getFee);

    // const sendUsdt = await evmImml.sendToken(
    //   richWallet.privateKey,
    //   wallet.address,
    //   "usdt",
    //   0.1
    // );
    // console.log(sendUsdt.data)

    // const usdtBalance = await evmImml.getTokenBalance(
    //   richWallet.address,
    //   "usdt"
    // );
    // console.log("usdt balance on ", network, "is: ", usdtBalance, "usdt");

    // const tokenName = 'usdt'
    // const tokenBalance = await evmImml.getTokenBalance(richWallet.address, tokenName)
    // console.log(richWallet.address, ": ", tokenBalance)

    // const tx = await evmImml.sendNativeToken(
    //   wallet.privateKey,
    //   metamaskWallet.address
    // );
    // console.log(tx)
    // const isTxSuccess = await evmImml.isTxSuccess('0xd1b8a42f2137f54e981eb7e374ac4c28cf9fdbff61444cea0f861b6869ce2da6');
    // console.log(`is tx success on ${network}: `, isTxSuccess.status);

    // const isTxBnbSuccess = await evmImml.isTxSuccess(
    //   "0xd673b33bcd0ea799640162b9f671d245115dbe1b0e4573678c7b6074faee8af2"
    // );
    // const isTxMaticSuccess = await evmImml.isTxSuccess(
    //   "0x98b30dd08ccef6248f230b68859deaf61d24f62d6a621ffe480373f95814f07a"
    // );
    // const isTxEthSuccess = await evmImml.isTxSuccess(
    //   "0xdd76cbb2eb838a16099b7b2f0f20d0a8a16f8cbc5f67f778ae94a790e3592cb2"
    // );
    // console.log("is Tx BNB success: ", isTxBnbSuccess.status);
    // console.log("is Tx MATIC success: ", isTxMaticSuccess.status);
    // console.log("is Tx ETH success: ", isTxEthSuccess.status);
  } catch (error) {
    console.log(error);
  }
};

main();

// 0xd673b33bcd0ea799640162b9f671d245115dbe1b0e4573678c7b6074faee8af2 // bnb testnet transaction
// 0x98b30dd08ccef6248f230b68859deaf61d24f62d6a621ffe480373f95814f07a // matic testnet transaction
// 0xdd76cbb2eb838a16099b7b2f0f20d0a8a16f8cbc5f67f778ae94a790e3592cb2 // eth testnet transaction

// const implAddressUsdt = await evmImml.usdtContract.methods
//   .implementation()
//   .call();
// const implAddressUsdc = await evmImml.usdcContract.methods
//   .implementation()
//   .call();
// const getABIUsdt = await axios.get(
//   `https://api.polygonscan.com/api?module=contract&action=getabi&address=${implAddressUsdt}&apikey=${process.env.MATIC_SCAN_API}`
// );
// const getABIUsdc = await axios.get(
//   `https://api.polygonscan.com/api?module=contract&action=getabi&address=${implAddressUsdc}&apikey=${process.env.MATIC_SCAN_API}`
// )
// console.log(getABIUsdt.data.result);
// console.log(getABIUsdc.data.result)
