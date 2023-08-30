const { 
    getAllTradeHis,
    getAllTradeHisTrash,
    deleteTradeHisById,
    getAllDepositHis,
    getAllDepositHisTrash,
    getAllWithDrawalHis,
    doneWithdrawal,
    getRevenueNap,
    getRevenueRut,
    getRevenueTrans,
    getShowDT,
    historyAllAddMoney,
    totalAddMoney,
    doneRefuseWithdrawal,
    acceptDeposit
}  = require("./trade.controller");
const router = require("express");
const app = router();
const { checkToken } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// trigger tại history/data-list/list-trade-view ListHisTrade
// lấy lịch sử giao dịch (type != nt, nn)
app.get("/historyAll", checkToken, getAllTradeHis);

// trigger tại history/data-list/list-trade-view ListHisTrade
// lấy lịch sử giao dịch (type != nt, nn) đã bị delete
app.get("/historyAllTrash", checkToken, getAllTradeHisTrash);

// trigger tại history/data-list/list-trade-view ListHisTrade, history/data-list/list-withdrawal-view ListHisRutTien, 
// history/data-list/list-deposit-view ListHisNapTien, history/data-list/list-addmoney ListHisAddMoney
// update delete_status of trade_history
app.patch("/deleteTradeHisById", checkToken, deleteTradeHisById);

// trigger tại history/data-list/list-deposit-view ListHisNapTien 
// lấy lịch sử nạp tiền (type = nt, nn)
app.get("/hisDepositAll", checkToken, getAllDepositHis);

// trigger tại history/data-list/list-withdrawal-view ListHisRutTien, history/data-list/list-deposit-view ListHisNapTien, history/data-list/list-addmoney ListHisAddMoney
// lấy lịch sử nạp tiền đã bị xoá (type = nt, nn, delete_status = 1)
app.get("/hisDepositAllTrash", checkToken, getAllDepositHisTrash);

// trigger tại history/data-list/list-withdrawal-view ListHisRutTien
// lấy lịch sử rút tiền (rt)
app.get("/hisWithDrawalAll", checkToken, getAllWithDrawalHis);

// trigger tại history/data-list/list-withdrawal-view ListHisRutTien
// update status của trade_history
// app.post("/doneWithdrawal", checkToken, doneWithdrawal);

// trigger tại history/data-list/list-deposit-view ListHisNapTien
// update status của trade history và account + thêm số tiền vàp balance
app.post("/accept-deposit", checkToken, acceptDeposit);

// trigger tại history/data-list/list-withdrawal-view ListHisRutTien
// update trạng thái trade_history thành từ chối rồi cộng lại số dư vào money_usdt trong db 
// app.post("/doneRefuseWithdrawal", checkToken, doneRefuseWithdrawal);

// không có phía client
// cái này ý là update xong chuyển tiền thủ công cho user
// app.post("/doneWithdrawalTele", doneWithdrawal);

// trigger tại history/data-list/list-trade-view ListHisTrade, history/data-list/list-deposit-view ListHisNapTien
// lấy SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB những cái đã hoàn thành và thuộc mạng bep20 và loại nạp tiền
app.get("/getRevenueNap", checkToken, getRevenueNap);

// trigger tại history/data-list/list-trade-view ListHisTrade, history/data-list/list-withdrawal-view ListHisRutTien
// lấy SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB những cái đã hoàn thành và thuộc mạng bep20 và loại rút tiền
app.get("/getRevenueRut", checkToken, getRevenueRut);

// không trigger
app.get("/getRevenueTrans", checkToken, getRevenueTrans);

// không trigger
app.get("/getRevenueTrans", checkToken, getRevenueTrans);

// trigger tại /analytics DashboardAnalytics, 
// lấy một loạt các thông số tại trade_history, bet_history, commission_history
app.post("/getShowDT", checkToken, getShowDT);

// lấy hết từ add_money_history
// trigger tại history/data-list/list-addmoney ListHisAddMoney
app.get("/historyAllAddMoney", checkToken, historyAllAddMoney);

// SELECT SUM(price_USDT) AS tUSD, SUM(price_ETH) AS tETH, SUM(price_BTC) AS tBTC, SUM(price_PAYPAL) AS tPAYPAL, SUM(price_VN) AS tVN FROM add_money_history
// trigger tại history/data-list/list-addmoney ListHisAddMoney
app.get("/totalAddMoney", checkToken, totalAddMoney);

module.exports = app;