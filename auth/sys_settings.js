// lấy giá của coin và update thẳng vào file stSys.json(được đại diện bằng dataSys) 
// tự động update giá vào file stSys.json sau 60 giây
// có thể dùng giao diện admin để update stsSys.json
// bất cứ client nào connect đến cũng được gửi stsSys.json lần đầu tiên và mỗi 60 giây lại nhận được stsSys.json thêm 1 lần nữa nhờ vào sự kiện update giá mỗi 60 giây
// cần kiểm tra xem connect socket có cần token không và token có phải là token của admin không 

const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
//const fs = require('fs')
const WebSocket = require('ws')
const config = require('../config.js')
const Helper = require("../helpers");
const fileSys = config.PATH_SYS_CONFIG;
const dataSys = Helper.getConfig(fileSys);

app.use(cors());

var httpServer = null

if(!config.USE_SSL){
    httpServer = require('http').createServer(app);
}else{
	let options = Helper.ssl;
	
    httpServer = require('https').createServer(options, app);
}

const wss = new WebSocket.Server(
    { 
        server: httpServer, 
        //port: 80 
    }
)

httpServer.listen(config.PORT_SYS);

console.log('Serve System run port: '+config.PORT_SYS)

// const configGetCoin = {
//     headers: {
//         'Accepts': 'application/json',
//         'X-CMC_PRO_API_KEY': 'a5140c7d-492a-4d74-8c6d-f72f75e039ab'
//     },
//     params: {
//         symbol: 'BTC,ETH,USDT,BNB'
//     },
//   }

function getCoinData(){
    let BNB, BTC, ETH, USDT = 1;
    dataSys.quotePriceUSDT = USDT

    axios.get('https://min-api.cryptocompare.com/data/price', {
        params: {
            fsym: "BNB",
            tsyms: "USD"
        }
    }).then((res) => {
        let data = res.data;
        BNB = data.USD;
        dataSys.quotePriceBNB = BNB;
    }).catch((error) => {});
	
    axios.get('https://min-api.cryptocompare.com/data/price', {
        params: {
            fsym: "BTC",
            tsyms: "USD"
        }
    }).then((res) => {
        let data = res.data;
        BTC = data.USD;
        dataSys.quotePriceBTC = BTC;
    }).catch((error) => {});
	
    axios.get('https://min-api.cryptocompare.com/data/price', {
        params: {
            fsym: "ETH",
            tsyms: "USD"
        }
    }).then((res) => {
        let data = res.data;
        ETH = data.USD;
        dataSys.quotePriceETH = ETH;
    
        let json = JSON.stringify(dataSys)
           
		Helper.setConfig(fileSys, dataSys);  
		
		wss.clients.forEach(function each(client) {
			client.send(JSON.stringify({type: 'getDataSys', data: dataSys}))
		});
        
    }).catch((error) => {});

    // axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', configGetCoin)
    // .then((res) => {
    //     let data = res.data.data
    //     let USDT = data.USDT.quote.USD.price
    //     let ETH = data.ETH.quote.USD.price
    //     let BTC = data.BTC.quote.USD.price
    //     let BNB = data.BNB.quote.USD.price
        
    // })
}

getCoinData() // update giá coin vào file stSys.json 

var timeLoop = 60, autoQuoteSet = true, checkAuto = true
autoQuote(timeLoop, autoQuoteSet) 
// update giá coin mỗi 60 giây
function autoQuote(t, a) {
    let auto
    if(!a){
        return clearInterval(auto)
    }else{
        auto = setInterval(() => {
            getCoinData()
        }, t * 1000); 
    }
    
}



wss.on('connection', function(ws){
    // admin update stSys.json
    ws.on('message', d => {
        var data = JSON.parse(d)
			
        if(data.type === 'setDataSys'){
            let g = data.data
	
            dataSys.quotePriceUSDT = g.qUSDT // giá sấp sĩ USD
            dataSys.quotePriceETH = g.qETH // giá sấp sĩ USD
            dataSys.quotePriceBTC = g.qBTC // giá sấp sĩ USD
            dataSys.quotePricePAYPAL = g.qPaypal //  giá sấp sĩ USD
            
            dataSys.typeCurrUseSys = g.tCUseSys // đồng tiền tệ sử dụng trong hệ thống

            dataSys.minDepositBTC = g.mDBTC // nạp tiền tối thiểu
            dataSys.minDepositETH = g.mDETH // nạp tiền tối thiểu
            dataSys.minDepositUSDT = Number(g.mDUSDT) // nạp tiền tối thiểu
            dataSys.minDepositPaypal = g.mDPaypal // nạp tiền tối thiểu

            dataSys.minWithdrawalBTC = g.mWBTC // rút tiền tối thiểu
            dataSys.minWithdrawalETH = g.mWETH // rút tiền tối thiểu
            dataSys.minWithdrawalUSDT = Number(g.mWUSDT) // rút tiền tối thiểu
            dataSys.minWithdrawalPaypal = g.mWPaypal // rút tiền tối thiểu

            dataSys.isActiveWalletPaypal = g.iAWPaypal // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống
            dataSys.isActiveWalletETH = g.iAWETH // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống
            dataSys.isActiveWalletUSDT = g.iAWUSDT // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống
            dataSys.isActiveWalletBTC = g.iAWBTC // Bật / tắt đồng COIN sử dụng nạp và gửi tiền trong hệ thống

            dataSys.feeRutPaypalNoiBo = g.fDPaypalNB
            dataSys.feeRutPaypalAcc = g.fDPaypalAcc
            dataSys.feeRutBTCNoiBo = g.fDBTCNB
            dataSys.feeRutBTCAcc = g.fDBTCAcc
            dataSys.feeRutETHNoiBo = g.fDETHNB
            dataSys.feeRutETHERC20 = g.fDETHERC20
            dataSys.feeRutUSDTNoiBo = g.fDUSDTNB
            dataSys.feeRutUSDTBEP20 = g.fDUSDTBEP20
            dataSys.feeRutUSDTERC20 = g.fDUSDTERC20

            dataSys.teleChatIDBet = g.teleChatIDBet
            dataSys.teleChatID = g.teleChatID
            dataSys.teleToken = g.teleToken
            dataSys.teleActiveBet = g.teleActiveBet
            dataSys.teleActiveDeposit = g.teleActiveDeposit
            dataSys.teleActiveWithdraw = g.teleActiveWithdraw
            dataSys.maintenance = g.maintenance

            dataSys.ADDRESS_ETH_USDT = g.ADDRESS_ETH_USDT
            dataSys.PRIVATE_KEY_ADDRESS_ETH_USDT = g.PRIVATE_KEY_ADDRESS_ETH_USDT
            dataSys.ADDRESS_ETH_TRANSACTION = g.ADDRESS_ETH_TRANSACTION
            dataSys.PRIVATE_KEY_ETH_TRANSACTION = g.PRIVATE_KEY_ETH_TRANSACTION
            dataSys.IS_TEST_SMART_CHAIN = g.IS_TEST_SMART_CHAIN



            dataSys.BANK_NAME = g.BANK_NAME
            dataSys.BANK_ACCOUNT_NAME = g.BANK_ACCOUNT_NAME
            dataSys.BANK_ACCOUNT = g.BANK_ACCOUNT
            dataSys.BANK_BRANCH = g.BANK_BRANCH

            timeLoop = g.timeLoopQuote
            autoQuoteSet = g.autoQuote

            if(g.autoQuote && !checkAuto){
                checkAuto = true
                autoQuote(g.timeLoopQuote, true)
                console.log('Auto On')
            }else{
                checkAuto = false
                autoQuote(99999999, false)
                console.log('Auto Off')
            }

            //let json = JSON.stringify(dataSys)
			Helper.setConfig(fileSys, dataSys);  
				
            //fs.writeFile(fileSys, json, 'utf8', function(err) {
             //   if (err) throw err;
            //})
        }
    })

    dataSys['timeLoop'] = timeLoop
    dataSys['autoQuoteSet'] = autoQuoteSet
	
	const dataSyss = Helper.getConfig(fileSys);

    ws.send(JSON.stringify({type: 'getDataSys', data: dataSyss}))

})