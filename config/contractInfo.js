const usdtABIBnbMainnet = require("./mainnetABI/USDT_BEP20_mainnet.json");
const usdtABIEthMainnet = require("./mainnetABI/USDT_ERC20_mainnet.json");

const usdtABIMaticMainnet = require("./mainnetABI/USDT_MATIC_mainnet.json");
const usdcABIMaticMainnet = require("./mainnetABI/USDC_MATIC_mainnet.json");
const usdcABIBnbMainnet = require("./mainnetABI/USDC_BEP20_mainnet.json");
const usdcABIEthMainnet = require("./mainnetABI/USDC_ERC20_mainnet.json");

const usdtABIMaticImplMainnet = require("./mainnetABI/implContractABI/USDT_MATIC_IMPL_mainnet.json");
const usdcABIMaticImplMainnet = require("./mainnetABI/implContractABI/USDC_MATIC_IMPL_mainnet.json");
const usdcABIBnbImplMainnet = require("./mainnetABI/implContractABI/USDC_BEP20_IMPL_mainnet.json");
const usdcABIEthImplMainnet = require("./mainnetABI/implContractABI/USDC_ERC20_IMPL_mainnet.json");

const usdtBnbMainnetContractInfo = { // usdt bep20
  ABI: usdtABIBnbMainnet,
  address: `0x55d398326f99059fF775485246999027B3197955`,
};

const usdtEthMainnetContractInfo = { // usdt erc20
  ABI: usdtABIEthMainnet,
  address: `0xdAC17F958D2ee523a2206206994597C13D831ec7`,
};

const usdtMaticMainnetContractInfo = { // usdt matic
  ABI: usdtABIMaticImplMainnet,
  address: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`,
};

const usdcMaticMainnetContractInfo = { // usdc matic
  ABI: usdcABIMaticImplMainnet,
  address: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`,
};

const usdcBnbMainnetContractInfo = { // usdc bep20
  ABI: usdcABIBnbImplMainnet,
  address: `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d`,
};

const usdcEthMainnetContractInfo = { // usdc erc20
  ABI: usdcABIEthImplMainnet,
  address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
};

module.exports = {
  usdtBnbMainnetContractInfo,
  usdtMaticMainnetContractInfo,
  usdtEthMainnetContractInfo,
  usdcBnbMainnetContractInfo,
  usdcMaticMainnetContractInfo,
  usdcEthMainnetContractInfo,
};
