const config = require('../config')
const Helper = require("../helpers");
const fileSys = config.PATH_SYS_CONFIG;
const serveStatic = require('serve-static');
const path = require('path');
const userRouter = require("./../api/users/user.router")
const tradeRouter = require("./../api/trade/trade.router")
const betRouter = require("./../api/bet/bet.router")
const exChangeRouter = require("./../api/exchange/ex.router")
const Wallet = require("./../api/wallet/wallet.router")

const uploadAvatar = require("./../auth/upload/router")

const payPal = require("./../auth/pay/paypal")
const walletSys = require("./../api/sys.router")

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json())
app.use(cors());

app.use("/api/users", userRouter)

/*  bản ghi có type_key khác nt nn là trade còn có nt, nn là deposit api sử dụng các bảng trade_history, bet_history, commission_history, add_money_history
trade_history: hiển nhiên
bet_history: lấy tổng thắng và thua của người chơi cho admin 
commission_history: lấy tổng pending_commission
add_money_history: lấy tất cả các bản ghi trong add_money_history, lấy tổng số tiền nạp theo từng loại tiền 
 */ 
app.use("/api/trades", tradeRouter) 

app.use("/api/bets", betRouter) // lấy lịch sử cá cược và delete lịch sử cá cược dựa trên id chỉ liên quan đến bet_history

app.use("/api/auth", uploadAvatar) // update và get avatar và passport (chỉ liên quan đến bảng users)
app.use("/api/wallet", Wallet) // ko trigger ở bất cứ đâu luôn // lấy địa chỉ coin của user address_USDT address_BTC address_USDT (chỉ liên quan đến bảng users) 

// ko ảnh hưởng đến DB
app.use("/api/paypal", payPal) // vô dụng cần vứt nốt ở source src/pages/trade/slidebar/NapTien.vue/NapRutTien.vue
app.use("/api/exs", exChangeRouter) // exchange trong db thôi vô dụng cái này bỏ xoá cái luồng tradechina/src/views/trading/Exchange.vue trên client rồi tắt ở đây nữa là xong

app.use("/api/setup", walletSys) // lấy file stSys và stCommission update file stCommission check bảo mật

app.get('/status', (req, res) => {
    let dataSys = Helper.getConfig(fileSys);
    res.json({
        ok: dataSys.maintenance,
        msg: dataSys.maintenanceContent
    })
})


app.use(serveStatic(path.join(__dirname, 'public')))

app.get(/^\/portal\/?.*/,(req,res) => {
	res.sendFile(path.resolve(__dirname,'public/dist/portal.html'))
})

app.get(/./,(req,res) => {
 	res.sendFile(path.resolve(__dirname,'public/dist/index.html'))
})

app.get('/status', (req, res) => {
     res.send({
         message: `Hello ${req.body.email} !`
     })
})

app.listen(3000);
console.log("- Web start port 3000");

// const https = require("https")
// let options = Helper.ssl;

// const httpsServer = https.createServer(
//     options,
//     app
// )

// httpsServer.listen(3000)
// console.log("https server listen port 3000")

