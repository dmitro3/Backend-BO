const Web3 = require('web3');
require("dotenv").config();

const richWallet = {address: '0x33C6D9501E8aE68227fa46Cf9dBFc181EA979971', privateKey: process.env.WALLET_POLYGON_PRIVATE_KEY}

// Kết nối tới mạng Ethereum hoặc BSC hoặc MATIC
const web3 = new Web3('https://matic.getblock.io/d467b2c6-6450-4b3e-a670-0c7deb4f2a2a/mainnet/'); // Thay YOUR_INFURA_PROJECT_ID bằng ID của bạn

// Địa chỉ hợp đồng USDT trên mạng Ethereum
const usdtContractAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

// ABI của hợp đồng USDT (ERC-20 token)
const usdtABI = require('./config/usdtPolygonMainnetABI.json')
const usdtContract = new web3.eth.Contract(usdtABI, usdtContractAddress);

async function checkUSDTBalance() {
    const balanceWei = await usdtContract.methods.balanceOf(richWallet.address).call();
    const decimal = await usdtContract.methods.decimals().call(); // Chú ý là 'decimals', không phải 'decimal'
    const balanceUSDT = balanceWei / 10**decimal; // Sử dụng phép chia
    console.log(`USDT balance of ${richWallet.address}: ${balanceUSDT} USDT`);
}

checkUSDTBalance()
