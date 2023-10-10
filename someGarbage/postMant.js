const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');

const sendRequest = () => {
  return axios.create({
    baseURL: `http://192.168.1.48:3000/`,
    headers: {
      Authorization: `Token HeHe`,
      ...formData.getHeaders(), // Thêm header 'Content-Type: multipart/form-data'
    },
  });
};

const main = async () => {
  try {
    const formData = new FormData();
    formData.append('keyName', 'key-name');
    formData.append('keyFile', fs.createReadStream('key.pem')); // Đọc tệp key.pem và gửi dưới dạng stream

    const result = await sendRequest().post("/test", formData);
  } catch (error) {
    console.log(error);
  }
};

main();

// bitcoin wallet:  {
//   privateKey: 'e39037aa5eb0e3c48addeffbbd44cf8cebf2c81cbe15e90b71937a5db8413890',
//   address: 'n1jxFMK9oqrQ26ECAEb6uiVzmPkV3TBXxF'
// }
// evm native wallet :  {
//   address: '0xf10FbcB9c4C6490dF0e1bc81aD0a18C44184F707',
//   privateKey: '0x03556167b928c27d6249e9259254fb715f2410d0c66dc6eba971c9d57cf91bde'
// }
// evm erc20 wallet:  {
//   address: '0x34C76FAf0fefd0FfDb686A6eE735E08ad5e71cde',
//   privateKey: '0x2d45eaed3e27f9582f26a6f5edf1e007a49b3454f5a2df18f44b7b0337eee35b'
// }

//  const results = await sendRequest().post("api/users/updateWallet", {
//     email: "dungdq3@gmail.com",
//   });
//   if (!results.data.success)
//     console.log("loi me no roi: ", results.data.message);
//   const data = results.data.data;
//   const bitcoinWallet = data.bitcoinWallet;
//   const evmNativeWallet = data.evmNativeWallet;
//   const evmErc20Wallet = data.evmErc20Wallet;
//   console.log("bitcoin wallet: ", bitcoinWallet);
//   console.log("evm native wallet : ", evmNativeWallet);
//   console.log("evm erc20 wallet: ", evmErc20Wallet);

//   const results1 = await sendRequest().get("api/users/getAddressToDeposit", {
//     params: { email: "dungdq3@gmail.com" },
//   });
//   if (!results1.data.success) console.log("bo me roi: ", results1.data.message);
//   const data1 = results1.data.data;
//   const btc_address = data1.btc_address;
//   const evm_native_address = data1.evm_native_address;
//   const evm_erc20_address = data1.evm_erc20_address;
//   console.log("btc_address: ", btc_address);
//   console.log("evm_native_address: ", evm_native_address);
//   console.log("evm_erc20_address: ", evm_erc20_address);

//   console.log('btc_address is correct: ', bitcoinWallet.address == btc_address)
//   console.log('evm_native_address is correct: ', evmNativeWallet.address == evm_native_address)
//   console.log('evm_erc20_address correct: ', evmErc20Wallet.address == evm_erc20_address)
