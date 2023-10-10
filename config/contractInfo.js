const usdtABIBnbMainnet = require("./mainnetABI/USDT_BEP20_mainnet.json");
const usdtABIEthMainnet = require("./mainnetABI/USDT_ERC20_mainnet.json");

const usdtABIMaticImplMainnet = require("./mainnetABI/implContractABI/USDT_MATIC_IMPL_mainnet.json");
const usdcABIMaticImplMainnet = require("./mainnetABI/implContractABI/USDC_MATIC_IMPL_mainnet.json");
const usdcABIBnbImplMainnet = require("./mainnetABI/implContractABI/USDC_BEP20_IMPL_mainnet.json");
const usdcABIEthImplMainnet = require("./mainnetABI/implContractABI/USDC_ERC20_IMPL_mainnet.json");

const usdtBnbMainnetContractInfo = {
  // usdt bep20
  ABI: usdtABIBnbMainnet,
  address: `0x55d398326f99059fF775485246999027B3197955`,
};

const usdtEthMainnetContractInfo = {
  // usdt erc20
  ABI: usdtABIEthMainnet,
  address: `0xdAC17F958D2ee523a2206206994597C13D831ec7`,
};

const usdtMaticMainnetContractInfo = {
  // usdt matic
  ABI: usdtABIMaticImplMainnet,
  address: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`,
};

const usdcMaticMainnetContractInfo = {
  // usdc matic
  ABI: usdcABIMaticImplMainnet,
  address: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`,
};

const usdcBnbMainnetContractInfo = {
  // usdc bep20
  ABI: usdcABIBnbImplMainnet,
  address: `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d`,
};

const usdcEthMainnetContractInfo = {
  // usdc erc20
  ABI: usdcABIEthImplMainnet,
  address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
};

// test net

const usdtABIMaticImplTestnet = require("../config/testnetABI/implContractABI/USDT_MATIC_IMPL_testnet.json");

const usdtBnbTestnetContractInfo = {
  // usdt bep20
  ABI: usdtABIBnbMainnet,
  address: `0x566377D40F550c47B97931E77E7548df0E5BdDE6`,
};

const usdcBnbTestnetContractInfo = {
  ABI: usdcABIBnbImplMainnet, // usdc bep20
  address: `0x6FfaC2ba8280b48D552afa77A8f757420F443fE5`,
};

const usdtEthTestnetContractInfo = {
  ABI: usdtABIEthMainnet, // usdt erc20
  address: `0xB89364e6853C8EF59160E4B4458b65224640CCAa`,
};

const usdcEthTestnetContractInfo = {
  ABI: usdcABIEthImplMainnet, // usdc erc20
  address: "0x3CAd85A4F2ccE897F5858d8ED4C5Df59412E93ca",
};

const usdtMaticTestnetContractInfo = {
  ABI: usdtABIMaticImplMainnet, // usdt matic
  address: "0x6828d1E411e8fF8d3200515361d74644405e51A4",
};

const usdcMaticTestnetContractInfo = {
  ABI: usdcABIMaticImplMainnet, // usdc matic
  address: "0x9C56f9CE846C1cCa0621F483279b294FB39A3389",
};

module.exports = {
  usdtBnbMainnetContractInfo,
  usdtMaticMainnetContractInfo,
  usdtEthMainnetContractInfo,
  usdcBnbMainnetContractInfo,
  usdcMaticMainnetContractInfo,
  usdcEthMainnetContractInfo,
  usdtBnbTestnetContractInfo,
  usdcBnbTestnetContractInfo,
  usdtEthTestnetContractInfo,
  usdcEthTestnetContractInfo,
  usdtMaticTestnetContractInfo,
  usdcMaticTestnetContractInfo,
};
// testUsdtEthResult = {
//   sendCoinFromAdminCaughtError: 1,
//   sendNativeTokenToExecuteCaughtError: 0,
//   sendUsdFromUserCaughtError: 3,
//   sendChangeFromUserCaughtError: 0,
//   sendErc20FromAdminErr: [
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//   ],
//   sendEthForGasFromAdminErr: [],
//   sendErc20FromUserErr: [
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Token name incorrect or amount invalid",
//   ],
//   sendChangeFromUserErr: [],
// };
// testUsdcEthResult = {
//   sendCoinFromAdminCaughtError: 5,
//   sendNativeTokenToExecuteCaughtError: 5,
//   sendUsdFromUserCaughtError: 8,
//   sendChangeFromUserCaughtError: 9,
//   sendErc20FromAdminErr: [
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//   ],
//   sendEthForGasFromAdminErr: [
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Returned error: insufficient funds for gas * price + value: balance 505183876106012370, tx cost 505183876106012400, overshot 30",
//   ],
//   sendErc20FromUserErr: [
//     "Token name incorrect or amount invalid",
//     "Token name incorrect or amount invalid",
//     "Returned error: insufficient funds for gas * price + value: balance 0, tx cost 376810531937, overshot 376810531937",
//     "Returned error: insufficient funds for gas * price + value: balance 194167491605, tx cost 769823859047, overshot 575656367442",
//     "Token name incorrect or amount invalid",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//   ],
//   sendChangeFromUserErr: [
//     "not enough balance balanceWei: 0, weiToSend: -13957335000, gasFeeWei: 13957335000",
//     "not enough balance balanceWei: 0, weiToSend: -161634123000, gasFeeWei: 161634123000",
//     "not enough balance balanceWei: 0, weiToSend: -191584659000, gasFeeWei: 191584659000",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "not enough balance balanceWei: 194167491605, weiToSend: -197239937395, gasFeeWei: 391407429000",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "not enough balance balanceWei: 6873211296821, weiToSend: -864634175179, gasFeeWei: 7737845472000",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//     "Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!",
//   ],
// };
// testUsdtBnbResult:  {
//   sendCoinFromAdminCaughtError: 0,
//   sendNativeTokenToExecuteCaughtError: 0,
//   sendUsdFromUserCaughtError: 0,
//   sendChangeFromUserCaughtError: 0,
//   sendErc20FromAdminErr: [],
//   sendEthForGasFromAdminErr: [],
//   sendErc20FromUserErr: [],
//   sendChangeFromUserErr: []
// }
// testUsdcBnbResult:  {
//   sendCoinFromAdminCaughtError: 0,
//   sendNativeTokenToExecuteCaughtError: 0,
//   sendUsdFromUserCaughtError: 0,
//   sendChangeFromUserCaughtError: 0,
//   sendErc20FromAdminErr: [],
//   sendEthForGasFromAdminErr: [],
//   sendErc20FromUserErr: [],
//   sendChangeFromUserErr: []
// }
// testUsdtMaticResult:  {
//   sendCoinFromAdminCaughtError: 0,
//   sendNativeTokenToExecuteCaughtError: 0,
//   sendUsdFromUserCaughtError: 0,
//   sendChangeFromUserCaughtError: 1,
//   sendErc20FromAdminErr: [],
//   sendEthForGasFromAdminErr: [],
//   sendErc20FromUserErr: [],
//   sendChangeFromUserErr: [
//     'not enough balance balanceWei: 29180380007782, weiToSend: -5469625389218, gasFeeWei: 34650005397000'
//   ]
// }
// testUsdcMaticResult:  {
//   sendCoinFromAdminCaughtError: 0,
//   sendNativeTokenToExecuteCaughtError: 0,
//   sendUsdFromUserCaughtError: 0,
//   sendChangeFromUserCaughtError: 0,
//   sendErc20FromAdminErr: [],
//   sendEthForGasFromAdminErr: [],
//   sendErc20FromUserErr: [],
//   sendChangeFromUserErr: []
// }
