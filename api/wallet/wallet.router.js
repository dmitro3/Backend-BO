const { 
    getUSDTAddress,
    getBTCAddress,
    getETHAddress
}  = require("./wallet.controller");
const router = require("express");
const app = router();
const { checkToken } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.get("/USDT/address", checkToken, getUSDTAddress)
app.get("/BTC/address", checkToken, getBTCAddress)
app.get("/ETH/address", checkToken, getETHAddress)



module.exports = app;