const Web3 = require("web3");
const contractInfo = require("./config/contractInfo");
const axios = require("axios");
const Helper = require("./helpers");
require("dotenv").config();

const main = async () => {
  const web3Eth = new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`
    )
  );
  const web3Matic = new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://polygon-mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`
    )
  );
  const web3Bnb = new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://bsc.getblock.io/${process.env.GETBLOCK_KEY}/mainnet/`
    )
  );
  const usdtMaticContract = new web3Matic.eth.Contract(
    contractInfo.usdtMaticMainnetContractInfo.ABI,
    contractInfo.usdtMaticMainnetContractInfo.address
  );
  const usdcMaticContract = new web3Matic.eth.Contract(
    contractInfo.usdcMaticMainnetContractInfo.ABI,
    contractInfo.usdcMaticMainnetContractInfo.address
  );
  const usdcErc20Contract = new web3Eth.eth.Contract(
    contractInfo.usdcEthMainnetContractInfo.ABI,
    contractInfo.usdcEthMainnetContractInfo.address
  );
  const usdcBep20Contract = new web3Bnb.eth.Contract(
    contractInfo.usdcBnbMainnetContractInfo.ABI,
    contractInfo.usdcBnbMainnetContractInfo.address
  );

  usdtMaticContract.events
    .Transfer()
    .on("data", async (event) => {
      console.log(event.returnValues)
      // event ProxyUpdated(address indexed _new, address indexed _old);
      // const newImplAddress = event.returnValues._new;
      try {
        const getAbiUsdtImplMatic = await axios.get(
          `https://api.polygonscan.com/api?module=contract&action=getabi&address=${newImplAddress}&apikey=${process.env.MATIC_SCAN_API}`
        );
        if (
          getAbiUsdtImplMatic.status == 200 &&
          getAbiUsdtImplMatic.data.status == "1"
        ) {
          const ABI = getAbiUsdtImplMatic.data.result;
          Helper.setABI(usdtMATICAbiFileName, JSON.parse(ABI));
          console.log("set new usdt abi json file for matic mainnet");
        } else {
          console.log("cannot set: ", getAbiUsdtImplMatic);
        }
      } catch (error) {
        console.log("get ABI caught Error");
      }
    })
    .on("error", (error) => {
      console.error("get event caught Error");
    });
  // usdcMaticContract.events
  //   .ProxyUpdated()
  //   .on("data", async (event) => {
  //     // event ProxyUpdated(address indexed _new, address indexed _old)
  //     const newImplAddress = event.returnValues._new;
  //     try {
  //       const getAbiUsdcImplMatic = await axios.get(
  //         `https://api.polygonscan.com/api?module=contract&action=getabi&address=${newImplAddress}&apikey=${process.env.MATIC_SCAN_API}`
  //       );
  //       if (
  //         getAbiUsdcImplMatic.status == 200 &&
  //         getAbiUsdcImplMatic.data.status == "1"
  //       ) {
  //         const ABI = getAbiUsdcImplMatic.data.result;
  //         Helper.setABI(usdcMATICAbiFileName, JSON.parse(ABI));
  //         console.log("set new usdc abi json file for matic mainnet");
  //       } else {
  //         console.log("cannot set: ", getAbiUsdcImplMatic);
  //       }
  //     } catch (error) {
  //       console.log("get ABI caught Error");
  //     }
  //   })
  //   .on("error", (error) => {
  //     console.error("get event caught Error");
  //   });
  // usdcErc20Contract.events
  //   .Upgraded()
  //   .on("data", async (event) => {
  //     // event Upgraded(address implementation);
  //     const newImplAddress = event.returnValues.implementation;
  //     try {
  //       const getAbiUsdcImplEth = await axios.get(
  //         `https://api.etherscan.io/api?module=contract&action=getabi&address=${newImplAddress}&apikey=${process.env.ETH_SCAN_API}`
  //       );
  //       if (
  //         getAbiUsdcImplEth.status == 200 &&
  //         getAbiUsdcImplEth.data.status == "1"
  //       ) {
  //         const ABI = getAbiUsdcImplEth.data.result;
  //         Helper.setABI(usdcERC20AbiFileName, JSON.parse(ABI));
  //         console.log("set new usdc abi json file for eth mainnet");
  //       } else {
  //         console.log("cannot set: ", getAbiUsdcImplEth);
  //       }
  //     } catch (error) {
  //       console.log("get ABI caught Error");
  //     }
  //   })
  //   .on("error", (error) => {
  //     console.error("get event caught Error");
  //   });
  // usdcBep20Contract.events
  //   .Upgraded()
  //   .on("data", async (event) => {
  //     // event Upgraded(address indexed implementation);
  //     const newImplAddress = event.returnValues.implementation;
  //     try {
  //       const getAbiUsdcImplBnb = await axios.get(
  //         `https://api.bscscan.com/api?module=contract&action=getabi&address=${newImplAddress}&apikey=${process.env.BSC_SCAN_API}`
  //       );
  //       if (
  //         getAbiUsdcImplBnb.status == 200 &&
  //         getAbiUsdcImplBnb.data.status == "1"
  //       ) {
  //         const ABI = getAbiUsdcImplBnb.data.result;
  //         Helper.setABI(usdcBEP20AbiFileName, JSON.parse(ABI));
  //         console.log("set new usdc abi json file for bsc mainnet");
  //       } else {
  //         console.log("cannot set: ", getAbiUsdcImplBnb);
  //       }
  //     } catch (error) {
  //       console.log("get ABI caught Error");
  //     }
  //   })
  //   .on("error", (error) => {
  //     console.error("get event caught Error");
  //   });
};

const updateABI = async (network) => {
  const usdtMaticImplAddress = `0x7ffb3d637014488b63fb9858e279385685afc1e2`;
  const usdcERC20ImplAddress = `0xa2327a938febf5fec13bacfb16ae10ecbc4cbdcf`;
  const usdcBEP20ImplAddress = `0xba5fe23f8a3a24bed3236f05f2fcf35fd0bf0b5c`;
  const usdcMaticImplAddress = `0xdd9185db084f5c4fff3b4f70e7ba62123b812226`;

  const usdcERC20AbiFileName = `USDC_ERC20_IMPL_mainnet`;
  const usdcBEP20AbiFileName = `USDC_BEP20_IMPL_mainnet`;
  const usdcMATICAbiFileName = `USDC_MATIC_IMPL_mainnet`;
  const usdtMATICAbiFileName = `USDT_MATIC_IMPL_mainnet`;

  try {
    switch (network) {
      case "eth":
        const getAbiUsdcImplEth = await axios.get(
          `https://api.etherscan.io/api?module=contract&action=getabi&address=${usdcERC20ImplAddress}&apikey=${process.env.ETH_SCAN_API}`
        );
        if (
          getAbiUsdcImplEth.status == 200 &&
          getAbiUsdcImplEth.data.status == "1"
        ) {
          const ABI = getAbiUsdcImplEth.data.result;
          Helper.setABI(usdcERC20AbiFileName, JSON.parse(ABI));
          console.log("set new usdc abi json file for eth mainnet");
        } else {
          console.log("cannot set: ", getAbiUsdcImplEth);
        }
        break;
      case "matic":
        const getAbiUsdtImplMatic = await axios.get(
          `https://api.polygonscan.com/api?module=contract&action=getabi&address=${usdtMaticImplAddress}&apikey=${process.env.MATIC_SCAN_API}`
        );
        if (
          getAbiUsdtImplMatic.status == 200 &&
          getAbiUsdtImplMatic.data.status == "1"
        ) {
          const ABI = getAbiUsdtImplMatic.data.result;
          Helper.setABI(usdtMATICAbiFileName, JSON.parse(ABI));
          console.log("set new usdt abi json file for matic mainnet");
        } else {
          console.log("cannot set: ", getAbiUsdtImplMatic);
        }
        const getAbiUsdcImplMatic = await axios.get(
          `https://api.polygonscan.com/api?module=contract&action=getabi&address=${usdcMaticImplAddress}&apikey=${process.env.MATIC_SCAN_API}`
        );
        if (
          getAbiUsdcImplMatic.status == 200 &&
          getAbiUsdcImplMatic.data.status == "1"
        ) {
          const ABI = getAbiUsdcImplMatic.data.result;
          Helper.setABI(usdcMATICAbiFileName, JSON.parse(ABI));
          console.log("set new usdc abi json file for matic mainnet");
        } else {
          console.log("cannot set: ", getAbiUsdcImplMatic);
        }
        break;
      case "bnb":
        const getAbiUsdcImplBnb = await axios.get(
          `https://api.bscscan.com/api?module=contract&action=getabi&address=${usdcBEP20ImplAddress}&apikey=${process.env.BSC_SCAN_API}`
        );
        if (
          getAbiUsdcImplBnb.status == 200 &&
          getAbiUsdcImplBnb.data.status == "1"
        ) {
          const ABI = getAbiUsdcImplBnb.data.result;
          Helper.setABI(usdcBEP20AbiFileName, JSON.parse(ABI));
          console.log("set new usdc abi json file for bsc mainnet");
        } else {
          console.log("cannot set: ", getAbiUsdcImplBnb);
        }
        break;
      default:
        console.log("ca map can cap kia");
        break;
    }
  } catch (error) {
    console.log("get ABI caught Error");
  }
};

const updateAddressABI = async (address) => {}

main();
