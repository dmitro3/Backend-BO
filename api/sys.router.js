const router = require("express")
const app = router();
//const { checkToken } = require("../auth/token_validation.js")
//const fs = require('fs')
const config = require('../config')
const Helper = require("../helpers");
const fileSys = config.PATH_SYS_CONFIG // stSys
const fileSysCommission = config.PATH_SYS_COMMISSION // stCommission


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// lấy file stCommission
app.get("/getRateCommission", (req, res) => {
    //let Sys = fs.readFileSync(fileSysCommission)
    const dataSys = Helper.getConfig(fileSysCommission);
    res.json({success: 1, data: dataSys})
});
// update file stCommission cái này nên yêu cầu token admin 
app.post("/saveRateCommission", (req, res) => {

    const dataSys = req.body;
	Helper.setConfig(fileSysCommission, dataSys);
	res.json({success: 1})
});
// lấy mồi vài trường trong file stSys
app.get("/wallet", (req, res) => {

    const dataSys = Helper.getConfig(fileSys);
	
	let obj = {
		qUSDT: dataSys.quotePriceUSDT, // giá sấp sĩ USD
		qETH: dataSys.quotePriceETH, // giá sấp sĩ USD
		qBTC: dataSys.quotePriceBTC, // giá sấp sĩ USD
		qBNB: dataSys.quotePriceBNB, //  giá sấp sĩ USD
		qPaypal: dataSys.quotePricePAYPAL, //  giá sấp sĩ USDquotePriceBNB
		
		tCUseSys: dataSys.typeCurrUseSys, // đồng tiền tệ sử dụng trong hệ thống

		mDBTC: dataSys.minDepositBTC, // nạp tiền tối thiểu
		mDETH: dataSys.minDepositETH, // nạp tiền tối thiểu
		mDUSDT: dataSys.minDepositUSDT, // nạp tiền tối thiểu
		mDPaypal: dataSys.minDepositPaypal, // nạp tiền tối thiểu

		mWBTC: dataSys.minWithdrawalBTC, // rút tiền tối thiểu
		mWETH: dataSys.minWithdrawalETH, // rút tiền tối thiểu
		mWUSDT: dataSys.minWithdrawalUSDT, // rút tiền tối thiểu
		mWPaypal: dataSys.minWithdrawalPaypal, // rút tiền tối thiểu

		iAWPaypal: dataSys.isActiveWalletPaypal, // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống
		iAWETH: dataSys.isActiveWalletETH, // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống
		iAWUSDT: dataSys.isActiveWalletUSDT, // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống
		iAWBTC: dataSys.isActiveWalletBTC, // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống

		fDPaypalNB: dataSys.feeRutPaypalNoiBo,
		fDPaypalAcc: dataSys.feeRutPaypalAcc,
		fDBTCNB: dataSys.feeRutBTCNoiBo,
		fDBTCAcc: dataSys.feeRutBTCAcc,
		fDETHNB: dataSys.feeRutETHNoiBo,
		fDETHERC20: dataSys.feeRutETHERC20,
		fDUSDTNB: dataSys.feeRutUSDTNoiBo,
		fDUSDTBEP20: dataSys.feeRutUSDTBEP20,
		fDUSDTERC20: dataSys.feeRutUSDTERC20,

		// BANK_NAME: dataSys.BANK_NAME,
		// BANK_ACCOUNT: dataSys.BANK_ACCOUNT,
		// BANK_ACCOUNT_NAME: dataSys.BANK_ACCOUNT_NAME,
		// BANK_BRANCH: dataSys.BANK_BRANCH,

		ADDRESS_ETH_USDT: dataSys.ADDRESS_ETH_USDT,
	}
	res.json({success: 1, data: obj})
});



module.exports = app;